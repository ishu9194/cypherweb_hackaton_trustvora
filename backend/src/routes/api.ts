import { FastifyInstance } from "fastify";
import { prisma } from "../lib/prisma.js";
import {
  CreateUserSchema,
  CreateVerificationSchema,
  UpdateVerificationSchema,
} from "../schemas/index.js";
import { TrustEngineService } from "../services/trustEngine.js";

export async function apiRoutes(fastify: FastifyInstance) {
  // 1. Create or fetch User Profile
  fastify.post("/users", async (request, reply) => {
    const body = CreateUserSchema.parse(request.body);

    // Only include identifiers that were actually provided — an empty {}
    // condition in an OR array matches every row in Prisma, so we build the
    // filter from just the fields that exist rather than always including both.
    const orConditions = [
      body.walletAddress ? { walletAddress: body.walletAddress } : null,
      body.email ? { email: body.email } : null,
    ].filter((condition): condition is NonNullable<typeof condition> => condition !== null);

    let user = await prisma.user.findFirst({
      where: { OR: orConditions },
    });

    if (!user) {
      user = await prisma.user.create({
        data: {
          walletAddress: body.walletAddress,
          email: body.email,
          name: body.name || "Anonymous User",
        },
      });
    }

    return reply.status(200).send({ success: true, data: user });
  });

  // 2. Get User Profile with Verifications and Trust Logs
  fastify.get("/users/:id", async (request, reply) => {
    const { id } = request.params as { id: string };

    const user = await prisma.user.findUnique({
      where: { id },
      include: {
        verifications: true,
        trustLogs: { orderBy: { createdAt: "desc" }, take: 10 },
      },
    });

    if (!user) {
      return reply.status(404).send({ success: false, error: "User not found" });
    }

    return reply.status(200).send({ success: true, data: user });
  });

  // 3. Submit a new Verification Claim
  fastify.post("/verifications", async (request, reply) => {
    const body = CreateVerificationSchema.parse(request.body);

    try {
      const verification = await prisma.verification.create({
        data: {
          userId: body.userId,
          claimType: body.claimType,
          claimData: body.claimData,
        },
      });

      return reply.status(201).send({ success: true, data: verification });
    } catch (error: any) {
      // Most likely a foreign-key violation (userId doesn't exist)
      return reply.status(400).send({ success: false, error: "Could not create verification — check that userId exists" });
    }
  });

  // 4. Update Verification Status (Triggers Trust Engine scoring)
  fastify.patch("/verifications/:id/status", async (request, reply) => {
    const { id } = request.params as { id: string };
    const body = UpdateVerificationSchema.parse(request.body);

    try {
      const result = await TrustEngineService.processVerificationOutcome(
        id,
        body.status,
        body.scoreImpact,
        body.reason
      );

      return reply.status(200).send({ success: true, data: result });
    } catch (error: any) {
      return reply.status(400).send({ success: false, error: error.message });
    }
  });
}
