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
  const userPayload = req.user as any;
  const userId = userPayload?.sub || userPayload?.id;
  if (!userId) throw new HttpError(401, "Unauthorized");

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

  if (lawyerId) {
    const lawyer = await prisma.lawyer.findUnique({ where: { id: lawyerId } });
    if (!lawyer) throw new HttpError(404, "Lawyer not found");
  }

  const newCase = await prisma.case.create({
    data: {
      clientId: userId,
      lawyerId: lawyerId || null,
      title: title.trim(),
      description: description.trim(),
      practiceArea: practiceArea.trim(),
      priority: (priority as any) || "medium",
      status: lawyerId ? "in_progress" : "open",
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
      progress: lawyerId ? 30 : 10,
      lawyerName: newCase.lawyer?.name ?? null,
      lawyerAvatarUrl: newCase.lawyer?.avatarUrl ?? null,
      deletionRequestedBy: null,
      createdAt: newCase.createdAt.toISOString(),
      updatedAt: newCase.updatedAt.toISOString(),
    },
  });
});

/** GET /dashboard/cases — Client views their cases */
export const getClientCases = asyncHandler(async (req: FastifyRequest, reply: FastifyReply) => {
  const userPayload = req.user as any;
  const userId = userPayload?.sub || userPayload?.id;
  if (!userId) throw new HttpError(401, "Unauthorized");

  const cases = await prisma.case.findMany({
    where: { clientId: userId },
    include: {
      lawyer: { select: { id: true, name: true, avatarUrl: true } },
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
    lawyerId: c.lawyerId,
    lawyerName: c.lawyer?.name ?? null,
    lawyerAvatarUrl: c.lawyer?.avatarUrl ?? null,
    notes: c.notes ?? "",
    deletionRequestedBy: c.deletionRequestedBy ?? null,
    documents: c.documents,
    createdAt: c.createdAt.toISOString(),
    updatedAt: c.updatedAt.toISOString(),
  }));

  return reply.send({ success: true, data });
});

/** DELETE /dashboard/cases/:id — Client deletes or requests deletion of a case */
export const deleteClientCase = asyncHandler(async (req: FastifyRequest, reply: FastifyReply) => {
  const userPayload = req.user as any;
  const userId = userPayload?.sub || userPayload?.id;
  if (!userId) throw new HttpError(401, "Unauthorized");

  const { id } = req.params as { id: string };

  const existing = await prisma.case.findFirst({ where: { id, clientId: userId } });
  if (!existing) throw new HttpError(404, "Case not found");

  // Rule 1: If no lawyer is assigned, client can delete directly
  if (!existing.lawyerId) {
    await prisma.case.delete({ where: { id } });
    return reply.send({ success: true, data: { deleted: true, message: "Case deleted successfully" } });
  }

  // Rule 2: If lawyer is assigned, deletion requires mutual acceptance
  if (existing.deletionRequestedBy === "lawyer") {
    // Lawyer had already requested deletion -> Mutual agreement reached -> Delete now!
    await prisma.case.delete({ where: { id } });
    return reply.send({ success: true, data: { deleted: true, message: "Case deletion approved and removed permanently" } });
  }

  // Set deletionRequestedBy = "client"
  await prisma.case.update({
    where: { id },
    data: { deletionRequestedBy: "client" },
  });

  return reply.send({
    success: true,
    data: {
      deleted: false,
      message: "Deletion request submitted. Awaiting assigned lawyer approval.",
    },
  });
});

/** POST /dashboard/cases/:id/deletion-response — Client approves or rejects lawyer's deletion request */
export const clientRespondDeletion = asyncHandler(async (req: FastifyRequest, reply: FastifyReply) => {
  const userPayload = req.user as any;
  const userId = userPayload?.sub || userPayload?.id;
  if (!userId) throw new HttpError(401, "Unauthorized");

  const { id } = req.params as { id: string };
  const { action } = req.body as { action: "approve" | "reject" };

  const existing = await prisma.case.findFirst({ where: { id, clientId: userId } });
  if (!existing) throw new HttpError(404, "Case not found");

  if (action === "approve") {
    await prisma.case.delete({ where: { id } });
    return reply.send({ success: true, data: { deleted: true, message: "Case deleted permanently upon mutual approval." } });
  }

  await prisma.case.update({
    where: { id },
    data: { deletionRequestedBy: null },
  });

  return reply.send({ success: true, data: { deleted: false, message: "Case deletion request rejected." } });
});

/** PATCH /dashboard/cases/:id/notes — Client saves notes for a case */
export const updateCaseNotes = asyncHandler(async (req: FastifyRequest, reply: FastifyReply) => {
  const userPayload = req.user as any;
  const userId = userPayload?.sub || userPayload?.id;
  if (!userId) throw new HttpError(401, "Unauthorized");

  const { id } = req.params as { id: string };
  const { notes } = req.body as { notes: string };

  const existing = await prisma.case.findFirst({ where: { id, clientId: userId } });
  if (!existing) throw new HttpError(404, "Case not found");

  const updated = await prisma.case.update({ where: { id }, data: { notes } });

  return reply.send({ success: true, data: { notes: updated.notes } });
});

// ── LAWYER ──────────────────────────────────────────────────────────────────

/** GET /lawyer-dashboard/cases — Lawyer views cases assigned to them */
export const getLawyerCases = asyncHandler(async (req: FastifyRequest, reply: FastifyReply) => {
  const userPayload = req.user as any;
  const userId = userPayload?.sub || userPayload?.id;
  if (!userId) throw new HttpError(401, "Unauthorized");

  const lawyer = await prisma.lawyer.findUnique({ where: { userId } });
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
    deletionRequestedBy: c.deletionRequestedBy ?? null,
    documentCount: c.documents.length,
    createdAt: c.createdAt.toISOString(),
    updatedAt: c.updatedAt.toISOString(),
  }));

  return reply.send({ success: true, data });
});

/** DELETE /lawyer-dashboard/cases/:id — Lawyer requests or approves case deletion */
export const deleteLawyerCase = asyncHandler(async (req: FastifyRequest, reply: FastifyReply) => {
  const userPayload = req.user as any;
  const userId = userPayload?.sub || userPayload?.id;
  if (!userId) throw new HttpError(401, "Unauthorized");

  const { id } = req.params as { id: string };

  const lawyer = await prisma.lawyer.findUnique({ where: { userId } });
  if (!lawyer) throw new HttpError(403, "Lawyer profile not found");

  const existing = await prisma.case.findFirst({ where: { id, lawyerId: lawyer.id } });
  if (!existing) throw new HttpError(404, "Case not found");

  if (existing.deletionRequestedBy === "client") {
    // Client had already requested deletion -> Mutual agreement reached -> Delete now!
    await prisma.case.delete({ where: { id } });
    return reply.send({ success: true, data: { deleted: true, message: "Case deletion approved and removed permanently" } });
  }

  // Set deletionRequestedBy = "lawyer"
  await prisma.case.update({
    where: { id },
    data: { deletionRequestedBy: "lawyer" },
  });

  return reply.send({
    success: true,
    data: {
      deleted: false,
      message: "Deletion request submitted. Awaiting client approval.",
    },
  });
});

/** POST /lawyer-dashboard/cases/:id/deletion-response — Lawyer approves or rejects client's deletion request */
export const lawyerRespondDeletion = asyncHandler(async (req: FastifyRequest, reply: FastifyReply) => {
  const userPayload = req.user as any;
  const userId = userPayload?.sub || userPayload?.id;
  if (!userId) throw new HttpError(401, "Unauthorized");

  const { id } = req.params as { id: string };
  const { action } = req.body as { action: "approve" | "reject" };

  const lawyer = await prisma.lawyer.findUnique({ where: { userId } });
  if (!lawyer) throw new HttpError(403, "Lawyer profile not found");

  const existing = await prisma.case.findFirst({ where: { id, lawyerId: lawyer.id } });
  if (!existing) throw new HttpError(404, "Case not found");

  if (action === "approve") {
    await prisma.case.delete({ where: { id } });
    return reply.send({ success: true, data: { deleted: true, message: "Case deleted permanently upon mutual approval." } });
  }

  await prisma.case.update({
    where: { id },
    data: { deletionRequestedBy: null },
  });

  return reply.send({ success: true, data: { deleted: false, message: "Case deletion request rejected." } });
});

/** GET /lawyer-dashboard/cases/unassigned — Lawyer views open cases pool to claim */
export const getUnassignedCases = asyncHandler(async (_req: FastifyRequest, reply: FastifyReply) => {
  const cases = await prisma.case.findMany({
    where: { lawyerId: null, status: "open" },
    include: {
      client: { select: { name: true } },
      documents: { select: { id: true, name: true, sizeLabel: true } },
    },
    orderBy: { createdAt: "desc" },
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

/** PATCH /lawyer-dashboard/cases/:id/claim — Lawyer claims an unassigned case */
export const claimCase = asyncHandler(async (req: FastifyRequest, reply: FastifyReply) => {
  const userPayload = req.user as any;
  const userId = userPayload?.sub || userPayload?.id;
  if (!userId) throw new HttpError(401, "Unauthorized");

  const { id } = req.params as { id: string };

  const lawyer = await prisma.lawyer.findUnique({ where: { userId } });
  if (!lawyer) throw new HttpError(403, "Lawyer profile not found");

  const existing = await prisma.case.findFirst({ where: { id, lawyerId: null } });
  if (!existing) throw new HttpError(404, "Case is either already claimed or not found");

  const updated = await prisma.case.update({
    where: { id },
    data: { lawyerId: lawyer.id, status: "in_progress" },
  });

  return reply.send({ success: true, data: { id: updated.id, status: mapStatus(updated.status) } });
});

/** PATCH /lawyer-dashboard/cases/:id/status — Lawyer updates case status */
export const updateLawyerCaseStatus = asyncHandler(async (req: FastifyRequest, reply: FastifyReply) => {
  const userPayload = req.user as any;
  const userId = userPayload?.sub || userPayload?.id;
  if (!userId) throw new HttpError(401, "Unauthorized");

  const { id } = req.params as { id: string };
  const { status } = req.body as { status: string };

  const lawyer = await prisma.lawyer.findUnique({ where: { userId } });
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
    lawyerId: c.lawyerId ?? null,
    deletionRequestedBy: c.deletionRequestedBy ?? null,
    createdAt: c.createdAt.toISOString(),
    updatedAt: c.updatedAt.toISOString(),
  }));

  return reply.send({ success: true, data });
});

/** PATCH /admin/cases/:id/assign — Admin assigns a case to a lawyer */
export const adminAssignCase = asyncHandler(async (req: FastifyRequest, reply: FastifyReply) => {
  const { id } = req.params as { id: string };
  const { lawyerId } = req.body as { lawyerId: string };

  const existing = await prisma.case.findUnique({ where: { id } });
  if (!existing) throw new HttpError(404, "Case not found");

  if (lawyerId) {
    const lawyer = await prisma.lawyer.findUnique({ where: { id: lawyerId } });
    if (!lawyer) throw new HttpError(404, "Lawyer not found");
  }

  const updated = await prisma.case.update({
    where: { id },
    data: {
      lawyerId: lawyerId || null,
      ...(lawyerId && existing.status === "open" ? { status: "in_progress" } : {}),
    },
  });

  return reply.send({ success: true, data: { id: updated.id, lawyerId: updated.lawyerId, status: mapStatus(updated.status) } });
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
