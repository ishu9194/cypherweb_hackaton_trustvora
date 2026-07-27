import type { FastifyInstance } from "fastify";
import { getCases, getDocuments, getMessages, getNotifications, getPayments, getReviews, sendMessage } from "../controllers/dashboard.controller.js";

export async function dashboardRoutes(fastify: FastifyInstance) {
  fastify.get("/cases", { onRequest: [fastify.authenticate] }, getCases);
  fastify.get("/documents", { onRequest: [fastify.authenticate] }, getDocuments);
  fastify.get("/notifications", { onRequest: [fastify.authenticate] }, getNotifications);
  fastify.get("/messages", { onRequest: [fastify.authenticate] }, getMessages);
  fastify.post("/messages/:id", { onRequest: [fastify.authenticate] }, sendMessage);
  fastify.get("/payments", { onRequest: [fastify.authenticate] }, getPayments);
  fastify.get("/reviews", { onRequest: [fastify.authenticate] }, getReviews);
}
