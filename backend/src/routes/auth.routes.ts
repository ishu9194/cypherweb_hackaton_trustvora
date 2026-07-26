import type { FastifyInstance } from "fastify";
import { googleAuth, login, me, register } from "../controllers/auth.controller.js";

export async function authRoutes(fastify: FastifyInstance) {
  fastify.post("/register", register);
  fastify.post("/login", login);
  fastify.post("/google", googleAuth);
  fastify.get("/me", { preHandler: [fastify.authenticate] }, me);
}
