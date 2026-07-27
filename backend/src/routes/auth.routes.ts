import type { FastifyInstance } from "fastify";
import { googleAuth, login, me, register, updateProfile } from "../controllers/auth.controller.js";

export async function authRoutes(fastify: FastifyInstance) {
  fastify.post("/register", register);
  fastify.post("/login", login);
  fastify.post("/google", googleAuth);
  fastify.get("/me", { preHandler: [fastify.authenticate] }, me);
  fastify.patch("/profile", { preHandler: [fastify.authenticate] }, updateProfile);
  fastify.patch("/me", { preHandler: [fastify.authenticate] }, updateProfile);
}
