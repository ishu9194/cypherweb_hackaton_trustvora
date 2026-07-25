import type { FastifyInstance } from "fastify";
import { getLawyerById, listLawyers } from "../controllers/lawyers.controller.js";

export async function lawyersRoutes(fastify: FastifyInstance) {
  fastify.get("/", listLawyers);
  fastify.get("/:id", getLawyerById);
}
