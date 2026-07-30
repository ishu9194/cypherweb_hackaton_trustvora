import type { FastifyInstance } from "fastify";
import { getLawyerConversations, sendLawyerReply } from "../controllers/lawyerDashboard.controller.js";
import { getLawyerCases, updateLawyerCaseStatus } from "../controllers/cases.controller.js";

export async function lawyerDashboardRoutes(fastify: FastifyInstance) {
  fastify.get("/conversations", { onRequest: [fastify.authenticate] }, getLawyerConversations);
  fastify.post("/conversations/:id/reply", { onRequest: [fastify.authenticate] }, sendLawyerReply);
  fastify.get("/cases", { onRequest: [fastify.authenticate] }, getLawyerCases);
  fastify.patch("/cases/:id/status", { onRequest: [fastify.authenticate] }, updateLawyerCaseStatus);
}
