import type { FastifyReply, FastifyRequest } from "fastify";
import { prisma } from "../lib/prisma.js";
import { asyncHandler, HttpError } from "../utils/asyncHandler.js";

// ─── Helper ───────────────────────────────────────────────────────────────────
/** Reads userId from the JWT payload (Fastify jwt stores it under `sub`). */
function getUserId(request: FastifyRequest): string {
  const user = (request as any).user as { sub?: string; id?: string };
  const id = user.sub ?? user.id;
  if (!id) throw new HttpError(401, "Not authenticated");
  return id;
}

/** Resolves the lawyerId for the currently authenticated user. Throws 404 if not a lawyer. */
async function resolveLawyerId(userId: string): Promise<string> {
  const lawyer = await prisma.lawyer.findUnique({
    where: { userId },
    select: { id: true },
  });
  if (!lawyer) throw new HttpError(404, "Lawyer profile not found");
  return lawyer.id;
}

// Numeric fields that must be coerced from string → number before writing to Prisma
const NUMERIC_FIELDS = new Set([
  "experienceYears", "consultationFee", "responseTimeMinutes",
  "casesWon", "successRate",
]);

// ─── My Profile ───────────────────────────────────────────────────────────────

export const getMyProfile = asyncHandler(async (request: FastifyRequest, reply: FastifyReply) => {
  const userId = getUserId(request);

  const lawyer = await prisma.lawyer.findUnique({
    where: { userId },
    include: {
      education: { orderBy: { order: "asc" } },
      timeline: { orderBy: { order: "asc" } },
      courtMemberships: { orderBy: { order: "asc" } },
      faqs: { orderBy: { order: "asc" } },
      officeLocations: { orderBy: { order: "asc" } },
      gallery: { orderBy: { order: "asc" } },
    },
  });

  if (!lawyer) throw new HttpError(404, "Lawyer profile not found");
  return reply.status(200).send({ success: true, data: lawyer });
});

export const updateMyProfile = asyncHandler(async (request: FastifyRequest, reply: FastifyReply) => {
  const userId = getUserId(request);
  const lawyerId = await resolveLawyerId(userId);

  const allowed = [
    "name", "title", "subtitle", "bio", "avatarUrl", "gender",
    "city", "state", "experienceYears", "qualification", "court",
    "languages", "specializations", "consultationFee", "consultationTypes",
    "responseTimeMinutes", "barNumber", "barCouncilName", "phone",
    "whatsapp", "website", "linkedin", "onlineConsultation",
    "offlineConsultation", "workingDays", "workingHours", "casesWon", "successRate",
  ];

  const body = request.body as Record<string, unknown>;
  const data: Record<string, unknown> = {};
  for (const key of allowed) {
    if (!(key in body)) continue;
    const val = body[key];
    // Coerce numeric fields — HTML inputs always send strings
    if (NUMERIC_FIELDS.has(key)) {
      const n = Number(val);
      data[key] = isNaN(n) ? 0 : n;
    } else {
      data[key] = val;
    }
  }

  const updated = await prisma.lawyer.update({ where: { id: lawyerId }, data });
  return reply.status(200).send({ success: true, data: updated });
});

// ─── Education ────────────────────────────────────────────────────────────────

export const addEducation = asyncHandler(async (request: FastifyRequest, reply: FastifyReply) => {
  const userId = getUserId(request);
  const lawyerId = await resolveLawyerId(userId);
  const { degree, institution, year, order = 0 } = request.body as any;

  const entry = await prisma.lawyerEducation.create({
    data: { lawyerId, degree, institution, year: Number(year), order: Number(order) },
  });
  return reply.status(201).send({ success: true, data: entry });
});

export const updateEducation = asyncHandler(async (request: FastifyRequest, reply: FastifyReply) => {
  const userId = getUserId(request);
  const lawyerId = await resolveLawyerId(userId);
  const { id } = request.params as { id: string };
  const { degree, institution, year, order } = request.body as any;

  const entry = await prisma.lawyerEducation.updateMany({
    where: { id, lawyerId },
    data: { degree, institution, year: year ? Number(year) : undefined, order: order !== undefined ? Number(order) : undefined },
  });
  if (entry.count === 0) throw new HttpError(404, "Education entry not found");
  return reply.status(200).send({ success: true });
});

export const deleteEducation = asyncHandler(async (request: FastifyRequest, reply: FastifyReply) => {
  const userId = getUserId(request);
  const lawyerId = await resolveLawyerId(userId);
  const { id } = request.params as { id: string };

  await prisma.lawyerEducation.deleteMany({ where: { id, lawyerId } });
  return reply.status(200).send({ success: true });
});

// ─── Timeline ─────────────────────────────────────────────────────────────────

export const addTimeline = asyncHandler(async (request: FastifyRequest, reply: FastifyReply) => {
  const userId = getUserId(request);
  const lawyerId = await resolveLawyerId(userId);
  const { year, title, description, order = 0 } = request.body as any;

  const entry = await prisma.lawyerTimeline.create({
    data: { lawyerId, year, title, description, order: Number(order) },
  });
  return reply.status(201).send({ success: true, data: entry });
});

export const updateTimeline = asyncHandler(async (request: FastifyRequest, reply: FastifyReply) => {
  const userId = getUserId(request);
  const lawyerId = await resolveLawyerId(userId);
  const { id } = request.params as { id: string };
  const { year, title, description, order } = request.body as any;

  const entry = await prisma.lawyerTimeline.updateMany({
    where: { id, lawyerId },
    data: { year, title, description, order: order !== undefined ? Number(order) : undefined },
  });
  if (entry.count === 0) throw new HttpError(404, "Timeline entry not found");
  return reply.status(200).send({ success: true });
});

export const deleteTimeline = asyncHandler(async (request: FastifyRequest, reply: FastifyReply) => {
  const userId = getUserId(request);
  const lawyerId = await resolveLawyerId(userId);
  const { id } = request.params as { id: string };

  await prisma.lawyerTimeline.deleteMany({ where: { id, lawyerId } });
  return reply.status(200).send({ success: true });
});

// ─── Court Memberships ────────────────────────────────────────────────────────

export const addCourtMembership = asyncHandler(async (request: FastifyRequest, reply: FastifyReply) => {
  const userId = getUserId(request);
  const lawyerId = await resolveLawyerId(userId);
  const { courtName, since, order = 0 } = request.body as any;

  const entry = await prisma.lawyerCourtMembership.create({
    data: { lawyerId, courtName, since: Number(since), order: Number(order) },
  });
  return reply.status(201).send({ success: true, data: entry });
});

export const updateCourtMembership = asyncHandler(async (request: FastifyRequest, reply: FastifyReply) => {
  const userId = getUserId(request);
  const lawyerId = await resolveLawyerId(userId);
  const { id } = request.params as { id: string };
  const { courtName, since, order } = request.body as any;

  const entry = await prisma.lawyerCourtMembership.updateMany({
    where: { id, lawyerId },
    data: { courtName, since: since ? Number(since) : undefined, order: order !== undefined ? Number(order) : undefined },
  });
  if (entry.count === 0) throw new HttpError(404, "Court membership not found");
  return reply.status(200).send({ success: true });
});

export const deleteCourtMembership = asyncHandler(async (request: FastifyRequest, reply: FastifyReply) => {
  const userId = getUserId(request);
  const lawyerId = await resolveLawyerId(userId);
  const { id } = request.params as { id: string };

  await prisma.lawyerCourtMembership.deleteMany({ where: { id, lawyerId } });
  return reply.status(200).send({ success: true });
});

// ─── FAQs ─────────────────────────────────────────────────────────────────────

export const addFAQ = asyncHandler(async (request: FastifyRequest, reply: FastifyReply) => {
  const userId = getUserId(request);
  const lawyerId = await resolveLawyerId(userId);
  const { question, answer, order = 0 } = request.body as any;

  const entry = await prisma.lawyerFAQ.create({
    data: { lawyerId, question, answer, order: Number(order) },
  });
  return reply.status(201).send({ success: true, data: entry });
});

export const updateFAQ = asyncHandler(async (request: FastifyRequest, reply: FastifyReply) => {
  const userId = getUserId(request);
  const lawyerId = await resolveLawyerId(userId);
  const { id } = request.params as { id: string };
  const { question, answer, order } = request.body as any;

  const entry = await prisma.lawyerFAQ.updateMany({
    where: { id, lawyerId },
    data: { question, answer, order: order !== undefined ? Number(order) : undefined },
  });
  if (entry.count === 0) throw new HttpError(404, "FAQ not found");
  return reply.status(200).send({ success: true });
});

export const deleteFAQ = asyncHandler(async (request: FastifyRequest, reply: FastifyReply) => {
  const userId = getUserId(request);
  const lawyerId = await resolveLawyerId(userId);
  const { id } = request.params as { id: string };

  await prisma.lawyerFAQ.deleteMany({ where: { id, lawyerId } });
  return reply.status(200).send({ success: true });
});

// ─── Office Locations ─────────────────────────────────────────────────────────

export const addOffice = asyncHandler(async (request: FastifyRequest, reply: FastifyReply) => {
  const userId = getUserId(request);
  const lawyerId = await resolveLawyerId(userId);
  const { name, address, city, state, pincode, mapsLink, order = 0 } = request.body as any;

  const entry = await prisma.lawyerOffice.create({
    data: { lawyerId, name, address, city, state, pincode, mapsLink, order: Number(order) },
  });
  return reply.status(201).send({ success: true, data: entry });
});

export const updateOffice = asyncHandler(async (request: FastifyRequest, reply: FastifyReply) => {
  const userId = getUserId(request);
  const lawyerId = await resolveLawyerId(userId);
  const { id } = request.params as { id: string };
  const { name, address, city, state, pincode, mapsLink, order } = request.body as any;

  const entry = await prisma.lawyerOffice.updateMany({
    where: { id, lawyerId },
    data: { name, address, city, state, pincode, mapsLink, order: order !== undefined ? Number(order) : undefined },
  });
  if (entry.count === 0) throw new HttpError(404, "Office not found");
  return reply.status(200).send({ success: true });
});

export const deleteOffice = asyncHandler(async (request: FastifyRequest, reply: FastifyReply) => {
  const userId = getUserId(request);
  const lawyerId = await resolveLawyerId(userId);
  const { id } = request.params as { id: string };

  await prisma.lawyerOffice.deleteMany({ where: { id, lawyerId } });
  return reply.status(200).send({ success: true });
});

// ─── Gallery ──────────────────────────────────────────────────────────────────

export const addGalleryImage = asyncHandler(async (request: FastifyRequest, reply: FastifyReply) => {
  const userId = getUserId(request);
  const lawyerId = await resolveLawyerId(userId);
  const { url, caption, type = "photo", order = 0 } = request.body as any;

  const entry = await prisma.lawyerGalleryImage.create({
    data: { lawyerId, url, caption, type, order: Number(order) },
  });
  return reply.status(201).send({ success: true, data: entry });
});

export const deleteGalleryImage = asyncHandler(async (request: FastifyRequest, reply: FastifyReply) => {
  const userId = getUserId(request);
  const lawyerId = await resolveLawyerId(userId);
  const { id } = request.params as { id: string };

  await prisma.lawyerGalleryImage.deleteMany({ where: { id, lawyerId } });
  return reply.status(200).send({ success: true });
});
