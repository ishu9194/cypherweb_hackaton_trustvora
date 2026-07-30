import type { FastifyInstance } from "fastify";
import {
  exportReport,
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
  updateClientStatus,
  updateTicketStatus,
  verifyLawyer,
} from "../controllers/admin.controller.js";
import { adminAssignCase, adminUpdateCaseStatus, getAllCases } from "../controllers/cases.controller.js";

export async function adminRoutes(fastify: FastifyInstance) {
  const authOpt = { onRequest: [(fastify as any).authorizeAdmin || fastify.authenticate] };


  fastify.get("/stats", authOpt, getStats);
  fastify.get("/revenue", authOpt, getRevenue);
  fastify.get("/cases", authOpt, getAllCases);
  fastify.patch("/cases/:id/assign", authOpt, adminAssignCase);
  fastify.patch("/cases/:id/status", authOpt, adminUpdateCaseStatus);
  fastify.get("/clients", authOpt, getClients);
  fastify.patch("/clients/:id/status", authOpt, updateClientStatus);
  fastify.get("/lawyers", authOpt, getLawyers);
  fastify.patch("/lawyers/:id/verify", authOpt, verifyLawyer);
  fastify.get("/payments", authOpt, getPayments);
  fastify.get("/payouts", authOpt, getPayouts);
  fastify.get("/refunds", authOpt, getRefunds);
  fastify.post("/payments/refund", authOpt, processRefund);
  fastify.patch("/refunds/:id/decision", authOpt, processRefund);
  fastify.get("/reports", authOpt, getReports);
  fastify.get("/reports/export", authOpt, exportReport);
  fastify.get("/reports/:id/export", authOpt, exportReport);
  fastify.get("/tickets", authOpt, getTickets);
  fastify.patch("/tickets/:id/status", authOpt, updateTicketStatus);
  fastify.post("/tickets/:id/reply", authOpt, replyToTicket);
}
