import type { FastifyReply, FastifyRequest } from "fastify";
import type { Prisma } from "@prisma/client";
import { prisma } from "../lib/prisma.js";
import { LawyerQuerySchema } from "../schemas/lawyer.schema.js";
import { asyncHandler, HttpError } from "../utils/asyncHandler.js";

const SORT_MAP: Record<string, Prisma.LawyerOrderByWithRelationInput> = {
  rating: { rating: "desc" },
  priceAsc: { consultationFee: "asc" },
  priceDesc: { consultationFee: "desc" },
  experience: { experienceYears: "desc" },
  responseTime: { responseTimeMinutes: "asc" },
};

export const listLawyers = asyncHandler(async (request: FastifyRequest, reply: FastifyReply) => {
  const query = LawyerQuerySchema.parse(request.query);

  const where: Prisma.LawyerWhereInput = {
    ...(query.search && {
      OR: [
        { name: { contains: query.search, mode: "insensitive" } },
        { city: { contains: query.search, mode: "insensitive" } },
        { court: { contains: query.search, mode: "insensitive" } },
        { qualification: { contains: query.search, mode: "insensitive" } },
      ],
    }),
    ...(query.practiceArea && { specializations: { has: query.practiceArea } }),
    ...(query.minRating !== undefined && { rating: { gte: query.minRating } }),
    ...(query.maxPrice !== undefined && { consultationFee: { lte: query.maxPrice } }),
    ...(query.consultationType && { consultationTypes: { has: query.consultationType } }),
  };

  const [lawyers, total] = await Promise.all([
    prisma.lawyer.findMany({
      where,
      orderBy: SORT_MAP[query.sort],
      skip: (query.page - 1) * query.pageSize,
      take: query.pageSize,
    }),
    prisma.lawyer.count({ where }),
  ]);

  return reply.status(200).send({
    success: true,
    data: lawyers,
    meta: {
      page: query.page,
      pageSize: query.pageSize,
      total,
      totalPages: Math.max(1, Math.ceil(total / query.pageSize)),
    },
  });
});

export const getLawyerById = asyncHandler(async (request: FastifyRequest, reply: FastifyReply) => {
  const { id } = request.params as { id: string };

  const lawyer = await prisma.lawyer.findUnique({
    where: { id },
    include: {
      reviews: { orderBy: { createdAt: "desc" } },
      education: { orderBy: { order: "asc" } },
      timeline: { orderBy: { order: "asc" } },
      courtMemberships: { orderBy: { order: "asc" } },
      faqs: { orderBy: { order: "asc" } },
      officeLocations: { orderBy: { order: "asc" } },
      gallery: { orderBy: { order: "asc" } },
    },
  });

  if (!lawyer) {
    throw new HttpError(404, "Resource not found");
  }

  return reply.status(200).send({ success: true, data: lawyer });
});

export const getPublicStats = asyncHandler(async (_request: FastifyRequest, reply: FastifyReply) => {
  const [totalLawyers, verifiedLawyers, totalAppointments, totalReviews, lawyers] = await Promise.all([
    prisma.lawyer.count(),
    prisma.lawyer.count({ where: { verified: true } }),
    prisma.appointment.count(),
    prisma.review.count(),
    prisma.lawyer.findMany({ select: { casesWon: true, successRate: true, reviewCount: true } }),
  ]);

  const totalCasesWon = lawyers.reduce((sum, l) => sum + (l.casesWon || 0), 0);
  const totalReviewsCount = lawyers.reduce((sum, l) => sum + (l.reviewCount || 0), 0);
  const avgSuccessRate = lawyers.length > 0
    ? Math.round(lawyers.reduce((sum, l) => sum + (l.successRate || 0), 0) / lawyers.length)
    : 95;

  return reply.status(200).send({
    success: true,
    data: {
      verifiedLawyersCount: verifiedLawyers || totalLawyers,
      totalLawyersCount: totalLawyers,
      clientsServedCount: totalCasesWon + totalAppointments + totalReviewsCount,
      successRate: avgSuccessRate,
      totalReviews: totalReviews + totalReviewsCount,
    },
  });
});
