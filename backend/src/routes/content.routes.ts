import type { FastifyInstance } from "fastify";
import { getBlogPosts, getFaqs } from "../controllers/content.controller.js";

export async function contentRoutes(fastify: FastifyInstance) {
  fastify.get("/blog", getBlogPosts);
  fastify.get("/faqs", getFaqs);
}
