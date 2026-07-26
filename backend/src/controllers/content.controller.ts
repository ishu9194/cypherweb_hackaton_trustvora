import type { FastifyReply, FastifyRequest } from "fastify";
import { prisma } from "../lib/prisma.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const getBlogPosts = asyncHandler(async (_req: FastifyRequest, reply: FastifyReply) => {
  return reply.send({ success: true, data: [] });
});

export const getFaqs = asyncHandler(async (_req: FastifyRequest, reply: FastifyReply) => {
  return reply.send({ success: true, data: [] });
});

export const getPracticeAreas = asyncHandler(async (_req: FastifyRequest, reply: FastifyReply) => {
  const practiceAreas = await prisma.practiceArea.findMany();
  return reply.send({ success: true, data: practiceAreas });
});
