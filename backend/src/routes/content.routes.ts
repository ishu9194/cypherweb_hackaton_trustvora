import type { FastifyInstance } from "fastify";
import { getFaqs } from "../controllers/content.controller.js";

export async function contentRoutes(fastify: FastifyInstance) {
  fastify.get("/faqs", getFaqs);
}
