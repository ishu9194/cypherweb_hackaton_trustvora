import type { FastifyInstance } from "fastify";
import { createReview } from "../controllers/reviews.controller.js";

export async function reviewsRoutes(fastify: FastifyInstance) {
  fastify.addHook("preHandler", fastify.authenticate);

  fastify.post("/", createReview);
}
