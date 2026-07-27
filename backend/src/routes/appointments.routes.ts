import type { FastifyInstance } from "fastify";
import { createAppointment, listAppointments, rescheduleAppointment, updateAppointmentStatus } from "../controllers/appointments.controller.js";

export async function appointmentsRoutes(fastify: FastifyInstance) {
  fastify.addHook("preHandler", fastify.authenticate);

  fastify.get("/", listAppointments);
  fastify.post("/", createAppointment);
  fastify.patch("/:id/status", updateAppointmentStatus);
  fastify.patch("/:id/reschedule", rescheduleAppointment);
}
