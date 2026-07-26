import type { FastifyReply, FastifyRequest } from "fastify";
import { prisma } from "../lib/prisma.js";
import { CreateAppointmentSchema, UpdateAppointmentStatusSchema } from "../schemas/appointment.schema.js";
import { asyncHandler, HttpError } from "../utils/asyncHandler.js";

/**
 * Appointments are scoped by the authenticated user, never by a query param —
 * a client only ever sees rows where they're the client, a lawyer only ever
 * sees rows where they're the lawyer. Resolves the caller's Lawyer.id when
 * role is LAWYER, since Appointment.lawyerId points at Lawyer.id, not User.id.
 */
async function resolveScope(sub: string, role: "CLIENT" | "LAWYER" | "ADMIN") {
  if (role === "LAWYER") {
    const lawyer = await prisma.lawyer.findUnique({ where: { userId: sub }, select: { id: true } });
    if (!lawyer) {
      throw new HttpError(404, "Lawyer profile not found for this account");
    }
    return { lawyerId: lawyer.id };
  }
  return { clientId: sub };
}

export const listAppointments = asyncHandler(async (request: FastifyRequest, reply: FastifyReply) => {
  const { sub, role } = request.user;
  const where = await resolveScope(sub, role);

  const appointments = await prisma.appointment.findMany({
    where,
    orderBy: { date: "desc" },
  });

  return reply.status(200).send({ success: true, data: appointments });
});

export const createAppointment = asyncHandler(async (request: FastifyRequest, reply: FastifyReply) => {
  const { sub, role } = request.user;
  if (role !== "CLIENT") {
    throw new HttpError(403, "Only clients can book appointments");
  }
  const body = CreateAppointmentSchema.parse(request.body);

  const user = await prisma.user.findUnique({ where: { id: sub }, select: { name: true } });
  if (!user) {
    throw new HttpError(404, "User not found");
  }

  const lawyer = await prisma.lawyer.findUnique({ where: { id: body.lawyerId }, select: { id: true } });
  if (!lawyer) {
    throw new HttpError(404, "Lawyer not found");
  }

  const appointment = await prisma.appointment.create({
    data: {
      clientId: sub,
      clientName: user.name,
      lawyerId: body.lawyerId,
      lawyerName: body.lawyerName,
      lawyerAvatarUrl: body.lawyerAvatarUrl,
      date: new Date(body.date),
      type: body.type,
      fee: body.fee,
    },
  });

  return reply.status(201).send({ success: true, data: appointment });
});

export const updateAppointmentStatus = asyncHandler(async (request: FastifyRequest, reply: FastifyReply) => {
  const { sub, role } = request.user;
  const { id } = request.params as { id: string };
  const { status } = UpdateAppointmentStatusSchema.parse(request.body);

  const appointment = await prisma.appointment.findUnique({ where: { id } });
  if (!appointment) {
    throw new HttpError(404, "Appointment not found");
  }

  const scope = await resolveScope(sub, role);
  const owns = ("clientId" in scope && scope.clientId === appointment.clientId)
    || ("lawyerId" in scope && scope.lawyerId === appointment.lawyerId);
  if (!owns) {
    throw new HttpError(403, "You don't have permission to update this appointment");
  }

  const updated = await prisma.appointment.update({
    where: { id },
    data: { status },
  });

  return reply.status(200).send({ success: true, data: updated });
});
