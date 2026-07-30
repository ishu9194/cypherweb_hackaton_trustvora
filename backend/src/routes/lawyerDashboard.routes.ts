import type { FastifyInstance } from "fastify";
import { getLawyerConversations, getLawyerClients, sendLawyerReply } from "../controllers/lawyerDashboard.controller.js";
import { claimCase, getLawyerCases, getUnassignedCases, updateLawyerCaseStatus } from "../controllers/cases.controller.js";

export async function lawyerDashboardRoutes(fastify: FastifyInstance) {
  fastify.get("/conversations", { onRequest: [fastify.authenticate] }, getLawyerConversations);
  fastify.get("/clients", { onRequest: [fastify.authenticate] }, getLawyerClients);
  fastify.post("/conversations/:id/reply", { onRequest: [fastify.authenticate] }, sendLawyerReply);
  fastify.get("/cases", { onRequest: [fastify.authenticate] }, getLawyerCases);
  fastify.get("/cases/unassigned", { onRequest: [fastify.authenticate] }, getUnassignedCases);
  fastify.patch("/cases/:id/claim", { onRequest: [fastify.authenticate] }, claimCase);
  fastify.patch("/cases/:id/status", { onRequest: [fastify.authenticate] }, updateLawyerCaseStatus);
}
