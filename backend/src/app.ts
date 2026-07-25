import Fastify from "fastify";
import cors from "@fastify/cors";
import helmet from "@fastify/helmet";
import dotenv from "dotenv";
import { apiRoutes } from "./routes/api.js";

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

// Global error handler — Zod throws on invalid request bodies, and without
// this it surfaces as an opaque 500 instead of a clean 400.
fastify.setErrorHandler((error, request, reply) => {
  if (error.name === "ZodError") {
    return reply.status(400).send({ success: false, error: error.message });
  }

  fastify.log.error(error);
  return reply.status(500).send({ success: false, error: "Internal server error" });
});

// Register API Routes under /api namespace
await fastify.register(apiRoutes, { prefix: "/api" });

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
