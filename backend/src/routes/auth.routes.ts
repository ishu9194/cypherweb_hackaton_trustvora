import type { FastifyInstance } from "fastify";
import { login, me, register } from "../controllers/auth.controller.js";

export async function authRoutes(fastify: FastifyInstance) {
  fastify.post("/register", register);
  fastify.post("/login", login);
  fastify.get("/me", { preHandler: [fastify.authenticate] }, me);
}
