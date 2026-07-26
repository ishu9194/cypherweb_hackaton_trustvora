import type { FastifyInstance } from "fastify";
import {
  exportReport,
  getCases,
  getClients,
  getLawyers,
  getPayments,
  getPayouts,
  getRefunds,
  getReports,
  getRevenue,
  getStats,
  getTickets,
  processRefund,
  replyToTicket,
  updateCaseStatus,
  updateClientStatus,
  updateTicketStatus,
  verifyLawyer,
} from "../controllers/admin.controller.js";
import { requireRole, verifyToken } from "../middleware/auth.js";

export async function adminRoutes(fastify: FastifyInstance) {
  // Uncomment preHandler hooks if strict token verification is enforced:
  // const authHooks = { preHandler: [verifyToken, requireRole("ADMIN")] };

  fastify.get("/stats", getStats);
  fastify.get("/revenue", getRevenue);
  fastify.get("/cases", getCases);
  fastify.patch("/cases/:id/status", updateCaseStatus);
  fastify.get("/clients", getClients);
  fastify.patch("/clients/:id/status", updateClientStatus);
  fastify.get("/lawyers", getLawyers);
  fastify.patch("/lawyers/:id/verify", verifyLawyer);
  fastify.get("/payments", getPayments);
  fastify.get("/payouts", getPayouts);
  fastify.get("/refunds", getRefunds);
  fastify.post("/payments/refund", processRefund);
  fastify.patch("/refunds/:id/decision", processRefund);
  fastify.get("/reports", getReports);
  fastify.get("/reports/export", exportReport);
  fastify.get("/reports/:id/export", exportReport);
  fastify.get("/tickets", getTickets);
  fastify.patch("/tickets/:id/status", updateTicketStatus);
  fastify.post("/tickets/:id/reply", replyToTicket);
}
