import type { FastifyReply, FastifyRequest } from "fastify";
import { prisma } from "../lib/prisma.js";
import { asyncHandler, HttpError } from "../utils/asyncHandler.js";

// Helper: map prisma CaseStatus to frontend-friendly string
function mapStatus(status: string) {
  return status === "in_progress" ? "in-progress" : status;
}

function mapStatusToPrisma(status: string) {
  return status === "in-progress" ? "in_progress" : status;
}

// ── CLIENT ──────────────────────────────────────────────────────────────────

/** POST /dashboard/cases — Client opens a new case */
export const createCase = asyncHandler(async (req: FastifyRequest, reply: FastifyReply) => {
  const { sub } = req.user as { sub: string };
  const { title, description, practiceArea, priority, lawyerId } = req.body as {
    title: string;
    description: string;
    practiceArea: string;
    priority?: "low" | "medium" | "high";
    lawyerId?: string;
  };

  if (!title?.trim()) throw new HttpError(400, "Title is required");
  if (!description?.trim()) throw new HttpError(400, "Description is required");
  if (!practiceArea?.trim()) throw new HttpError(400, "Practice area is required");

  // Validate lawyerId if provided
  if (lawyerId) {
    const lawyer = await prisma.lawyer.findUnique({ where: { id: lawyerId } });
    if (!lawyer) throw new HttpError(404, "Lawyer not found");
  }

  const newCase = await prisma.case.create({
    data: {
      clientId: sub,
      lawyerId: lawyerId || null,
      title: title.trim(),
      description: description.trim(),
      practiceArea: practiceArea.trim(),
      priority: (priority as any) || "medium",
    },
    include: { lawyer: { select: { name: true, avatarUrl: true } } },
  });

  return reply.status(201).send({
    success: true,
    data: {
      id: newCase.id,
      title: newCase.title,
      description: newCase.description,
      practiceArea: newCase.practiceArea,
      status: mapStatus(newCase.status),
      priority: newCase.priority,
      progress: 0,
      lawyerName: newCase.lawyer?.name ?? null,
      lawyerAvatarUrl: newCase.lawyer?.avatarUrl ?? null,
      createdAt: newCase.createdAt.toISOString(),
      updatedAt: newCase.updatedAt.toISOString(),
    },
  });
});

/** GET /dashboard/cases — Client views their cases */
export const getClientCases = asyncHandler(async (req: FastifyRequest, reply: FastifyReply) => {
  const { sub } = req.user as { sub: string };

  const cases = await prisma.case.findMany({
    where: { clientId: sub },
    include: {
      lawyer: { select: { name: true, avatarUrl: true } },
      documents: { select: { id: true, name: true, sizeLabel: true, url: true, category: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  const progressMap: Record<string, number> = {
    open: 10,
    in_progress: 50,
    resolved: 90,
    closed: 100,
  };

  const data = cases.map((c: any) => ({
    id: c.id,
    title: c.title,
    description: c.description,
    practiceArea: c.practiceArea,
    status: mapStatus(c.status),
    priority: c.priority,
    progress: progressMap[c.status] ?? 0,
    lawyerName: c.lawyer?.name ?? null,
    lawyerAvatarUrl: c.lawyer?.avatarUrl ?? null,
    notes: c.notes ?? "",
    documents: c.documents,
    createdAt: c.createdAt.toISOString(),
    updatedAt: c.updatedAt.toISOString(),
  }));

  return reply.send({ success: true, data });
});

/** PATCH /dashboard/cases/:id/notes — Client saves notes for a case */
export const updateCaseNotes = asyncHandler(async (req: FastifyRequest, reply: FastifyReply) => {
  const { sub } = req.user as { sub: string };
  const { id } = req.params as { id: string };
  const { notes } = req.body as { notes: string };

  const existing = await prisma.case.findFirst({ where: { id, clientId: sub } });
  if (!existing) throw new HttpError(404, "Case not found");

  const updated = await prisma.case.update({ where: { id }, data: { notes } });

  return reply.send({ success: true, data: { notes: updated.notes } });
});

// ── LAWYER ──────────────────────────────────────────────────────────────────

/** GET /lawyer-dashboard/cases — Lawyer views cases assigned to them */
export const getLawyerCases = asyncHandler(async (req: FastifyRequest, reply: FastifyReply) => {
  const { sub } = req.user as { sub: string };

  // Find lawyer profile for this user
  const lawyer = await prisma.lawyer.findUnique({ where: { userId: sub } });
  if (!lawyer) throw new HttpError(403, "Lawyer profile not found");

  const cases = await prisma.case.findMany({
    where: { lawyerId: lawyer.id },
    include: {
      client: { select: { name: true } },
      documents: { select: { id: true, name: true, sizeLabel: true } },
    },
    orderBy: { updatedAt: "desc" },
  });

  const data = cases.map((c: any) => ({
    id: c.id,
    title: c.title,
    description: c.description,
    practiceArea: c.practiceArea,
    status: mapStatus(c.status),
    priority: c.priority,
    clientName: c.client.name,
    documentCount: c.documents.length,
    createdAt: c.createdAt.toISOString(),
    updatedAt: c.updatedAt.toISOString(),
  }));

  return reply.send({ success: true, data });
});

/** PATCH /lawyer-dashboard/cases/:id/status — Lawyer updates case status */
export const updateLawyerCaseStatus = asyncHandler(async (req: FastifyRequest, reply: FastifyReply) => {
  const { sub } = req.user as { sub: string };
  const { id } = req.params as { id: string };
  const { status } = req.body as { status: string };

  const lawyer = await prisma.lawyer.findUnique({ where: { userId: sub } });
  if (!lawyer) throw new HttpError(403, "Lawyer profile not found");

  const existing = await prisma.case.findFirst({ where: { id, lawyerId: lawyer.id } });
  if (!existing) throw new HttpError(404, "Case not found");

  const prismaStatus = mapStatusToPrisma(status);
  const updated = await prisma.case.update({
    where: { id },
    data: { status: prismaStatus as any },
  });

  return reply.send({ success: true, data: { id: updated.id, status: mapStatus(updated.status) } });
});

// ── ADMIN ────────────────────────────────────────────────────────────────────

/** GET /admin/cases — Admin views all cases */
export const getAllCases = asyncHandler(async (_req: FastifyRequest, reply: FastifyReply) => {
  const cases = await prisma.case.findMany({
    include: {
      client: { select: { name: true } },
      lawyer: { select: { name: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  const data = cases.map((c: any) => ({
    id: c.id,
    title: c.title,
    practiceArea: c.practiceArea,
    status: mapStatus(c.status),
    priority: c.priority,
    client: c.client.name,
    lawyer: c.lawyer?.name ?? "Unassigned",
    createdAt: c.createdAt.toISOString(),
    updatedAt: c.updatedAt.toISOString(),
  }));

  return reply.send({ success: true, data });
});

/** PATCH /admin/cases/:id/status — Admin updates any case status */
export const adminUpdateCaseStatus = asyncHandler(async (req: FastifyRequest, reply: FastifyReply) => {
  const { id } = req.params as { id: string };
  const { status } = req.body as { status: string };

  const existing = await prisma.case.findUnique({ where: { id } });
  if (!existing) throw new HttpError(404, "Case not found");

  const prismaStatus = mapStatusToPrisma(status);
  const updated = await prisma.case.update({
    where: { id },
    data: { status: prismaStatus as any },
  });

  return reply.send({ success: true, data: { id: updated.id, status: mapStatus(updated.status) } });
});
