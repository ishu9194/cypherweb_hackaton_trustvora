import type { FastifyReply, FastifyRequest } from "fastify";
import { prisma } from "../lib/prisma.js";
import { CreateReviewSchema } from "../schemas/review.schema.js";
import { asyncHandler, HttpError } from "../utils/asyncHandler.js";
import { TrustEngineService } from "../services/trustEngine.js";
import { emitNewReview, emitTrustScoreUpdated } from "../socket.js";

export const createReview = asyncHandler(async (request: FastifyRequest, reply: FastifyReply) => {
  const { sub } = request.user;
  const body = CreateReviewSchema.parse(request.body);

  const [user, lawyer] = await Promise.all([
    prisma.user.findUnique({ where: { id: sub }, select: { name: true } }),
    prisma.lawyer.findUnique({ where: { id: body.lawyerId }, select: { id: true, rating: true, reviewCount: true } }),
  ]);
  if (!user) throw new HttpError(404, "User not found");
  if (!lawyer) throw new HttpError(404, "Lawyer not found");

  const appointment = await prisma.appointment.findFirst({
    where: { clientId: sub, lawyerId: body.lawyerId },
    select: { id: true, status: true },
  });

  if (!appointment) {
    throw new HttpError(403, "You must have a booked consultation with this lawyer to submit a review.");
  }

  const isVerifiedClient = appointment.status === "completed";

  const review = await prisma.review.create({
    data: {
      lawyerId: body.lawyerId,
      authorId: sub,
      authorName: user.name,
      rating: body.rating,
      comment: body.comment,
      verifiedClient: isVerifiedClient,
    },
  });

  // Invoke Trust Engine to recalculate lawyer trust score and rating metrics
  const trustEngineResult = await TrustEngineService.recalculateLawyerTrustScore(body.lawyerId);

  // Emit WebSocket real-time events
  emitNewReview(review);
  if (trustEngineResult) {
    emitTrustScoreUpdated(body.lawyerId, trustEngineResult.trustScore, trustEngineResult.rating);
  }

  return reply.status(201).send({ success: true, data: review });
});
