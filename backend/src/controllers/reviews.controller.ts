import type { FastifyReply, FastifyRequest } from "fastify";
import { prisma } from "../lib/prisma.js";
import { CreateReviewSchema } from "../schemas/review.schema.js";
import { asyncHandler, HttpError } from "../utils/asyncHandler.js";

export const createReview = asyncHandler(async (request: FastifyRequest, reply: FastifyReply) => {
  const { sub } = request.user;
  const body = CreateReviewSchema.parse(request.body);

  const [user, lawyer] = await Promise.all([
    prisma.user.findUnique({ where: { id: sub }, select: { name: true } }),
    prisma.lawyer.findUnique({ where: { id: body.lawyerId }, select: { id: true, rating: true, reviewCount: true } }),
  ]);
  if (!user) throw new HttpError(404, "User not found");
  if (!lawyer) throw new HttpError(404, "Lawyer not found");

  // A completed appointment with this lawyer marks the review as a verified client review.
  const hasCompletedAppointment = await prisma.appointment.findFirst({
    where: { clientId: sub, lawyerId: body.lawyerId, status: "completed" },
    select: { id: true },
  });

  const newReviewCount = lawyer.reviewCount + 1;
  const newRating = (lawyer.rating * lawyer.reviewCount + body.rating) / newReviewCount;

  const [review] = await prisma.$transaction([
    prisma.review.create({
      data: {
        lawyerId: body.lawyerId,
        authorId: sub,
        authorName: user.name,
        rating: body.rating,
        comment: body.comment,
        verifiedClient: Boolean(hasCompletedAppointment),
      },
    }),
    prisma.lawyer.update({
      where: { id: body.lawyerId },
      data: { rating: newRating, reviewCount: newReviewCount },
    }),
  ]);

  return reply.status(201).send({ success: true, data: review });
});
