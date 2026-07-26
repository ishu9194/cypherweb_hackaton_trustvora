import type { FastifyReply, FastifyRequest } from "fastify";
import { prisma } from "../lib/prisma.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const getCases = asyncHandler(async (req: FastifyRequest, reply: FastifyReply) => {
  const { sub } = req.user as { sub: string };

  const appointments = await prisma.appointment.findMany({
    where: { clientId: sub },
    orderBy: { date: "desc" },
  });

  const cases = appointments.map((a) => ({
    id: a.id,
    title: `${a.type} Consultation`,
    practiceArea: a.type,
    status: a.status === "completed" ? "closed" : a.status === "cancelled" ? "closed" : "in-progress",
    progress: a.status === "completed" ? 100 : a.status === "cancelled" ? 0 : 50,
    lawyerName: a.lawyerName,
    updatedAt: a.updatedAt.toISOString(),
  }));

  return reply.send({ success: true, data: cases });
});

export const getDocuments = asyncHandler(async (_req: FastifyRequest, reply: FastifyReply) => {
  // Return documents array or empty array if none uploaded yet
  return reply.send({ success: true, data: [] });
});

export const getNotifications = asyncHandler(async (_req: FastifyRequest, reply: FastifyReply) => {
  // Return notifications array or empty array if none
  return reply.send({ success: true, data: [] });
});

export const getPayments = asyncHandler(async (req: FastifyRequest, reply: FastifyReply) => {
  const { sub } = req.user as { sub: string };

  const appointments = await prisma.appointment.findMany({
    where: { clientId: sub },
    orderBy: { createdAt: "desc" },
  });

  const payments = appointments.map((a) => ({
    id: `pay-${a.id}`,
    description: `Consultation — ${a.lawyerName}`,
    amount: a.fee,
    status: a.status === "cancelled" ? "refunded" : "paid",
    date: a.createdAt.toISOString(),
    invoiceUrl: "#",
  }));

  return reply.send({ success: true, data: payments });
});

export const getReviews = asyncHandler(async (req: FastifyRequest, reply: FastifyReply) => {
  const { sub } = req.user as { sub: string };

  const reviews = await prisma.review.findMany({
    where: { authorId: sub },
    orderBy: { createdAt: "desc" },
  });

  return reply.send({ success: true, data: reviews });
});
