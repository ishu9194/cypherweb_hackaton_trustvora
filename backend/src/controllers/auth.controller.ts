import type { FastifyReply, FastifyRequest } from "fastify";
import bcrypt from "bcryptjs";
import { prisma } from "../lib/prisma.js";
import { GoogleAuthSchema, LoginSchema, RegisterSchema } from "../schemas/auth.schema.js";
import { asyncHandler, HttpError } from "../utils/asyncHandler.js";

/** Fields safe to return to the client — never leak passwordHash. */
function toPublicUser(user: { id: string; email: string | null; name: string; role: string; createdAt: Date }) {
  return { id: user.id, email: user.email, name: user.name, role: user.role, createdAt: user.createdAt };
}

export const register = asyncHandler(async (request: FastifyRequest, reply: FastifyReply) => {
  const body = RegisterSchema.parse(request.body);

  const existing = await prisma.user.findUnique({ where: { email: body.email } });
  if (existing) {
    throw new HttpError(409, "An account with this email already exists");
  }

  const passwordHash = await bcrypt.hash(body.password, 10);
  const user = await prisma.user.create({
    data: { name: body.name, email: body.email, passwordHash, role: body.role as any },
  });

  const token = await reply.jwtSign({ sub: user.id, role: user.role }, { expiresIn: "7d" });

  return reply.status(201).send({ success: true, data: { user: toPublicUser(user), token } });
});

export const login = asyncHandler(async (request: FastifyRequest, reply: FastifyReply) => {
  const body = LoginSchema.parse(request.body);

  const user = await prisma.user.findUnique({ where: { email: body.email } });
  if (!user || !user.passwordHash) {
    throw new HttpError(401, "Invalid email or password");
  }

  const valid = await bcrypt.compare(body.password, user.passwordHash);
  if (!valid) {
    throw new HttpError(401, "Invalid email or password");
  }

  const token = await reply.jwtSign({ sub: user.id, role: user.role }, { expiresIn: "7d" });

  return reply.status(200).send({ success: true, data: { user: toPublicUser(user), token } });
});

export const googleAuth = asyncHandler(async (request: FastifyRequest, reply: FastifyReply) => {
  const body = GoogleAuthSchema.parse(request.body);
  const email = body.email || "google_user@example.com";
  const name = body.name || "Google User";

  let user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    user = await prisma.user.create({
      data: { name, email, role: "CLIENT" },
    });
  }

  const token = await reply.jwtSign({ sub: user.id, role: user.role }, { expiresIn: "7d" });

  return reply.status(200).send({ success: true, data: { user: toPublicUser(user), token } });
});

export const me = asyncHandler(async (request: FastifyRequest, reply: FastifyReply) => {
  const { sub } = request.user as { sub: string };

  const user = await prisma.user.findUnique({
    where: { id: sub },
    include: { lawyerProfile: true },
  });

  if (!user) {
    throw new HttpError(404, "User not found");
  }

  return reply.status(200).send({ success: true, data: { ...toPublicUser(user), lawyerProfile: user.lawyerProfile } });
});
