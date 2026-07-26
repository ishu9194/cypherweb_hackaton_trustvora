import type { FastifyInstance } from "fastify";
import { getCases, getDocuments, getNotifications, getPayments, getReviews } from "../controllers/dashboard.controller.js";

export async function dashboardRoutes(fastify: FastifyInstance) {
  fastify.get("/cases", getCases);
  fastify.get("/documents", getDocuments);
  fastify.get("/notifications", getNotifications);
  fastify.get("/payments", getPayments);
  fastify.get("/reviews", getReviews);
}
