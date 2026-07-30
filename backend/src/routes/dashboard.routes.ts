import type { FastifyInstance } from "fastify";
import {
  deleteDocument,
  getDocuments,
  getMessages,
  getNotifications,
  getPayments,
  getReviews,
  getSavedLawyers,
  sendMessage,
  toggleSaveLawyer,
  uploadDocument,
} from "../controllers/dashboard.controller.js";
import { clientRespondDeletion, createCase, deleteClientCase, getClientCases, updateCaseNotes } from "../controllers/cases.controller.js";

export async function dashboardRoutes(fastify: FastifyInstance) {
  fastify.get("/cases", { onRequest: [fastify.authenticate] }, getClientCases);
  fastify.post("/cases", { onRequest: [fastify.authenticate] }, createCase);
  fastify.delete("/cases/:id", { onRequest: [fastify.authenticate] }, deleteClientCase);
  fastify.post("/cases/:id/deletion-response", { onRequest: [fastify.authenticate] }, clientRespondDeletion);
  fastify.patch("/cases/:id/notes", { onRequest: [fastify.authenticate] }, updateCaseNotes);
  fastify.get("/documents", { onRequest: [fastify.authenticate] }, getDocuments);
  fastify.post("/documents", { onRequest: [fastify.authenticate] }, uploadDocument);
  fastify.delete("/documents/:id", { onRequest: [fastify.authenticate] }, deleteDocument);
  fastify.get("/saved-lawyers", { onRequest: [fastify.authenticate] }, getSavedLawyers);
  fastify.post("/saved-lawyers/:id/toggle", { onRequest: [fastify.authenticate] }, toggleSaveLawyer);
  fastify.get("/notifications", { onRequest: [fastify.authenticate] }, getNotifications);
  fastify.get("/messages", { onRequest: [fastify.authenticate] }, getMessages);
  fastify.post("/messages/:id", { onRequest: [fastify.authenticate] }, sendMessage);
  fastify.get("/payments", { onRequest: [fastify.authenticate] }, getPayments);
  fastify.get("/reviews", { onRequest: [fastify.authenticate] }, getReviews);
}
