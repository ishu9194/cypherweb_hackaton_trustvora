import type { FastifyInstance } from "fastify";
import { getLawyerConversations, sendLawyerReply } from "../controllers/lawyerDashboard.controller.js";

export async function lawyerDashboardRoutes(fastify: FastifyInstance) {
  fastify.get("/conversations", { onRequest: [fastify.authenticate] }, getLawyerConversations);
  fastify.post("/conversations/:id/reply", { onRequest: [fastify.authenticate] }, sendLawyerReply);
}
