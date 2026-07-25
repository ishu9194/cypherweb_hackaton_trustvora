import Fastify, { type FastifyReply, type FastifyRequest } from "fastify";
import cors from "@fastify/cors";
import helmet from "@fastify/helmet";
import jwt from "@fastify/jwt";
import dotenv from "dotenv";
import { apiRoutes } from "./routes/api.js";
import { authRoutes } from "./routes/auth.routes.js";
import { lawyersRoutes } from "./routes/lawyers.routes.js";

dotenv.config();

const fastify = Fastify({
  logger: true,
});

// Security & CORS Config
await fastify.register(helmet, { global: true });
await fastify.register(cors, {
  origin: true, // Allows requests from your frontend SPA
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
});

// JWT auth — issues/verifies tokens for register/login/me
await fastify.register(jwt, {
  secret: process.env.JWT_SECRET || "dev-only-change-me-before-deploying",
});

fastify.decorate("authenticate", async (request: FastifyRequest, reply: FastifyReply) => {
  try {
    await request.jwtVerify();
  } catch {
    return reply.status(401).send({ success: false, message: "Missing or invalid authentication token" });
  }
});

// Global error handler — Zod throws on invalid request bodies, and without
// this it surfaces as an opaque 500 instead of a clean 400.
fastify.setErrorHandler((error, request, reply) => {
  if (error.name === "ZodError") {
    return reply.status(400).send({ success: false, error: error.message });
  }

  fastify.log.error(error);
  return reply.status(500).send({ success: false, error: "Internal server error" });
});

// Register API Routes. `apiRoutes` holds the existing trust-engine endpoints;
// authRoutes/lawyersRoutes are the new v1 marketplace endpoints. Both prefixes
// point at the same handlers so /api/v1/... works today without breaking any
// existing /api/... consumers.
for (const prefix of ["/api", "/api/v1"]) {
  await fastify.register(apiRoutes, { prefix });
  await fastify.register(authRoutes, { prefix: `${prefix}/auth` });
  await fastify.register(lawyersRoutes, { prefix: `${prefix}/lawyers` });
}

// Health check endpoint
fastify.get("/health", async () => {
  return { status: "ok", service: "Trustix API", timestamp: new Date() };
});

const start = async () => {
  try {
    const port = Number(process.env.PORT) || 3000;
    await fastify.listen({ port, host: "0.0.0.0" });
    console.log(`🚀 Trustix Server live at http://localhost:${port}`);
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();
