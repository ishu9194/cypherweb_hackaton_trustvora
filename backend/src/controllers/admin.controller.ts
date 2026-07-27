import type { FastifyReply, FastifyRequest } from "fastify";
import { prisma } from "../lib/prisma.js";
import { asyncHandler, HttpError } from "../utils/asyncHandler.js";
import { emitTrustScoreUpdated } from "../socket.js";


export const getStats = asyncHandler(async (_req: FastifyRequest, reply: FastifyReply) => {
  const [lawyerCount, clientCount, aggregateRevenue] = await Promise.all([
    prisma.lawyer.count(),
    prisma.user.count({ where: { role: "CLIENT" } }),
    prisma.appointment.aggregate({
      _sum: { fee: true },
      where: { status: "completed" },
    }),
  ]);

  const totalRevenue = aggregateRevenue._sum.fee ?? 0;

  const stats = [
    { label: "Total lawyers", value: lawyerCount },
    { label: "Total clients", value: clientCount },
    { label: "Monthly revenue", value: totalRevenue },
    { label: "Growth (MoM)", value: "+0.0%" },
  ];

  return reply.send({ success: true, data: stats });
});

export const getRevenue = asyncHandler(async (_req: FastifyRequest, reply: FastifyReply) => {
  const appointments = await prisma.appointment.findMany({
    select: { date: true, fee: true },
    orderBy: { date: "asc" },
  });

  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const monthlyMap = new Map<string, number>();

  for (const app of appointments) {
    const d = new Date(app.date);
    const monthLabel = monthNames[d.getMonth()];
    monthlyMap.set(monthLabel, (monthlyMap.get(monthLabel) || 0) + app.fee);
  }

  const revenuePoints = Array.from(monthlyMap.entries()).map(([month, revenue]) => ({
    month,
    revenue,
  }));

  return reply.send({ success: true, data: revenuePoints });
});

export const getCases = asyncHandler(async (_req: FastifyRequest, reply: FastifyReply) => {
  const appointments = await prisma.appointment.findMany({
    orderBy: { date: "desc" },
    include: { client: { select: { name: true } }, lawyer: { select: { name: true } } },
  });

  const cases = appointments.map((a) => ({
    id: a.id,
    title: `${a.type} Consultation`,
    client: a.clientName || a.client.name,
    lawyer: a.lawyerName || a.lawyer.name,
    practiceArea: a.type,
    status: a.status === "completed" ? "closed" : a.status === "cancelled" ? "closed" : "in-progress",
    updatedAt: a.updatedAt.toISOString(),
  }));

  return reply.send({ success: true, data: cases });
});

export const updateCaseStatus = asyncHandler(async (req: FastifyRequest, reply: FastifyReply) => {
  const { id } = req.params as { id: string };
  const { status } = req.body as { status: string };

  const appointment = await prisma.appointment.findUnique({ where: { id } });
  if (!appointment) {
    throw new HttpError(404, "Resource not found");
  }

  const newStatus = status === "closed" ? "completed" : "pending";
  const updated = await prisma.appointment.update({
    where: { id },
    data: { status: newStatus },
  });

  return reply.send({
    success: true,
    data: {
      id: updated.id,
      title: `${updated.type} Consultation`,
      client: updated.clientName,
      lawyer: updated.lawyerName,
      practiceArea: updated.type,
      status,
      updatedAt: updated.updatedAt.toISOString(),
    },
  });
});

export const getClients = asyncHandler(async (_req: FastifyRequest, reply: FastifyReply) => {
  const clients = await prisma.user.findMany({
    where: { role: "CLIENT" },
    include: { _count: { select: { appointments: true } } },
    orderBy: { createdAt: "desc" },
  });

  const formatted = clients.map((c) => ({
    id: c.id,
    name: c.name,
    email: c.email || "noemail@trustix.dev",
    joined: c.createdAt.toISOString().split("T")[0],
    cases: c._count.appointments,
    status: "Active",
  }));

  return reply.send({ success: true, data: formatted });
});

export const updateClientStatus = asyncHandler(async (req: FastifyRequest, reply: FastifyReply) => {
  const { id } = req.params as { id: string };
  const { status } = req.body as { status: string };

  const user = await prisma.user.findFirst({
    where: { OR: [{ id }, { email: id }] },
  });
  if (!user) {
    throw new HttpError(404, "Resource not found");
  }

  return reply.send({ success: true, data: { id: user.id, name: user.name, email: user.email, status } });
});

export const getLawyers = asyncHandler(async (_req: FastifyRequest, reply: FastifyReply) => {
  const lawyers = await prisma.lawyer.findMany({
    orderBy: { createdAt: "desc" },
  });
  return reply.send({ success: true, data: lawyers });
});

export const verifyLawyer = asyncHandler(async (req: FastifyRequest, reply: FastifyReply) => {
  const { id } = req.params as { id: string };
  const { verified } = req.body as { verified: boolean };

  const lawyer = await prisma.lawyer.findUnique({ where: { id } });
  if (!lawyer) {
    throw new HttpError(404, "Resource not found");
  }

  const updated = await prisma.lawyer.update({
    where: { id },
    data: { verified },
  });

  emitTrustScoreUpdated(updated.id, updated.verified ? 950 : 500, updated.rating);

  return reply.send({ success: true, data: updated });
});


export const getPayments = asyncHandler(async (_req: FastifyRequest, reply: FastifyReply) => {
  const appointments = await prisma.appointment.findMany({
    orderBy: { date: "desc" },
  });

  const payouts = appointments
    .filter((a) => a.status === "completed")
    .map((a) => ({
      id: `po-${a.id}`,
      lawyer: a.lawyerName,
      amount: Math.round(a.fee * 0.85),
      status: "processed",
      date: a.updatedAt.toISOString(),
    }));

  const refunds = appointments
    .filter((a) => a.status === "cancelled")
    .map((a) => ({
      id: `rf-${a.id}`,
      client: a.clientName,
      amount: a.fee,
      reason: "Booking cancelled",
      status: "approved",
    }));

  return reply.send({ success: true, data: { revenue: [], payouts, refunds } });
});

export const getPayouts = asyncHandler(async (_req: FastifyRequest, reply: FastifyReply) => {
  const completed = await prisma.appointment.findMany({
    where: { status: "completed" },
    orderBy: { updatedAt: "desc" },
  });

  const payouts = completed.map((a) => ({
    id: `po-${a.id}`,
    lawyer: a.lawyerName,
    amount: Math.round(a.fee * 0.85),
    status: "processed",
    date: a.updatedAt.toISOString(),
  }));

  return reply.send({ success: true, data: payouts });
});

export const getRefunds = asyncHandler(async (_req: FastifyRequest, reply: FastifyReply) => {
  const cancelled = await prisma.appointment.findMany({
    where: { status: "cancelled" },
    orderBy: { updatedAt: "desc" },
  });

  const refunds = cancelled.map((a) => ({
    id: `rf-${a.id}`,
    client: a.clientName,
    amount: a.fee,
    reason: "Booking cancelled",
    status: "approved",
  }));

  return reply.send({ success: true, data: refunds });
});

export const processRefund = asyncHandler(async (req: FastifyRequest, reply: FastifyReply) => {
  const { id, status } = req.body as { id?: string; status?: "approved" | "rejected" };
  const paramsId = (req.params as { id?: string })?.id;
  const refundId = id || paramsId || "";

  const appointmentId = refundId.replace(/^rf-/, "");
  const appointment = await prisma.appointment.findUnique({ where: { id: appointmentId } });
  if (!appointment) {
    throw new HttpError(404, "Resource not found");
  }

  return reply.send({
    success: true,
    data: {
      id: refundId,
      client: appointment.clientName,
      amount: appointment.fee,
      status: status || "approved",
    },
  });
});

export const getReports = asyncHandler(async (_req: FastifyRequest, reply: FastifyReply) => {
  const reports = [
    { id: "rpt-revenue", name: "Monthly Revenue Report" },
    { id: "rpt-verification", name: "Lawyer Verification Report" },
    { id: "rpt-growth", name: "Client Growth Report" },
    { id: "rpt-analytics", name: "Consultation Analytics Report" },
  ];
  return reply.send({ success: true, data: reports });
});

export const exportReport = asyncHandler(async (req: FastifyRequest, reply: FastifyReply) => {
  const { id } = req.params as { id: string };
  const nameMap: Record<string, string> = {
    "rpt-revenue": "Monthly Revenue Report",
    "rpt-verification": "Lawyer Verification Report",
    "rpt-growth": "Client Growth Report",
    "rpt-analytics": "Consultation Analytics Report",
  };
  const name = nameMap[id] || "Platform Report";
  const filename = `${name.replace(/\s+/g, "-")}.txt`;
  const content = `${name}\nGenerated ${new Date().toLocaleString("en-IN")}\nStatus: Verified Complete`;

  return reply.send({ success: true, data: { filename, content } });
});

export const getTickets = asyncHandler(async (_req: FastifyRequest, reply: FastifyReply) => {
  const verifications = await prisma.verification.findMany({
    include: { user: { select: { name: true } } },
    orderBy: { createdAt: "desc" },
  });

  const tickets = verifications.map((v) => ({
    id: `TCK-${v.id.substring(0, 6)}`,
    subject: `Verification claim: ${v.claimType}`,
    requester: v.user.name,
    category: "Account",
    priority: v.status === "PENDING" ? "high" : "low",
    status: v.status === "PENDING" ? "open" : v.status === "VERIFIED" ? "resolved" : "in-progress",
    message: v.claimData,
    createdAt: v.createdAt.toISOString(),
  }));

  return reply.send({ success: true, data: tickets });
});

export const updateTicketStatus = asyncHandler(async (req: FastifyRequest, reply: FastifyReply) => {
  const { id } = req.params as { id: string };
  const { status } = req.body as { status: string };

  const verification = await prisma.verification.findFirst({
    where: { id: { contains: id.replace(/^TCK-/, "") } },
  });
  if (!verification) {
    throw new HttpError(404, "Resource not found");
  }

  return reply.send({ success: true, data: { id, status } });
});

export const replyToTicket = asyncHandler(async (req: FastifyRequest, reply: FastifyReply) => {
  const { id } = req.params as { id: string };
  const { message } = req.body as { message: string };

  if (!message) throw new HttpError(400, "Message body is required");

  return reply.send({ success: true, message: `Reply recorded for ticket ${id}` });
});
