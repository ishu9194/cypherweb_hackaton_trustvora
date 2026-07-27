import type { FastifyReply, FastifyRequest } from "fastify";
import { prisma } from "../lib/prisma.js";
import { CreateAppointmentSchema, UpdateAppointmentStatusSchema } from "../schemas/appointment.schema.js";
import { asyncHandler, HttpError } from "../utils/asyncHandler.js";
import { emitAppointmentStatusChanged, emitNewAppointment } from "../socket.js";

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

  // Normalize date to minute boundary for timezone consistency
  const bookingDate = new Date(body.date);
  bookingDate.setSeconds(0, 0);

  // Concurrency guard via interactive Prisma transaction against double booking
  const appointment = await prisma.$transaction(async (tx) => {
    const existing = await tx.appointment.findFirst({
      where: {
        lawyerId: body.lawyerId,
        date: bookingDate,
        status: { in: ["pending", "upcoming", "completed"] },
      },
    });

    if (existing) {
      throw new HttpError(409, "This lawyer already has an active consultation booked at the selected date and time.");
    }

    return await tx.appointment.create({
      data: {
        clientId: sub,
        clientName: user.name,
        lawyerId: body.lawyerId,
        lawyerName: body.lawyerName,
        lawyerAvatarUrl: body.lawyerAvatarUrl,
        date: bookingDate,
        type: body.type,
        fee: body.fee,
      },
    });
  });

  // Real-Time Socket event emission
  emitNewAppointment(appointment);

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

  // Real-Time Socket status change emission
  emitAppointmentStatusChanged(updated);

  return reply.status(200).send({ success: true, data: updated });
});
