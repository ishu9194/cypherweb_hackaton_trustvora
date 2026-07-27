import type { FastifyInstance } from "fastify";
import { getLawyerById, getPublicStats, listLawyers } from "../controllers/lawyers.controller.js";

export async function lawyersRoutes(fastify: FastifyInstance) {
  fastify.get("/", listLawyers);
  fastify.get("/stats", getPublicStats);
  fastify.get("/:id", getLawyerById);
}
