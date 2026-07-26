import Fastify, { type FastifyReply, type FastifyRequest } from "fastify";
import cors from "@fastify/cors";
import helmet from "@fastify/helmet";
import jwt from "@fastify/jwt";
import dotenv from "dotenv";
import { apiRoutes } from "./routes/api.js";
import { authRoutes } from "./routes/auth.routes.js";
import { lawyersRoutes } from "./routes/lawyers.routes.js";
import { appointmentsRoutes } from "./routes/appointments.routes.js";
import { reviewsRoutes } from "./routes/reviews.routes.js";
import { adminRoutes } from "./routes/admin.routes.js";
import { dashboardRoutes } from "./routes/dashboard.routes.js";
import { contentRoutes } from "./routes/content.routes.js";
import { setupSocketIO } from "./socket.js";


dotenv.config();

const fastify = Fastify({
  logger: true,
});

// Security & CORS Config
await fastify.register(helmet, { global: true });
await fastify.register(cors, {
  origin: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
});

// JWT auth
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

// Global error handler
fastify.setErrorHandler((error: any, request, reply) => {
  if (error.name === "ZodError") {
    return reply.status(400).send({ success: false, error: error.message });
  }

  fastify.log.error(error);
  return reply.status(500).send({ success: false, error: "Internal server error" });
});

// Register API Routes for both /api and /api/v1 prefixes
for (const prefix of ["/api", "/api/v1"]) {
  await fastify.register(apiRoutes, { prefix });
  await fastify.register(authRoutes, { prefix: `${prefix}/auth` });
  await fastify.register(lawyersRoutes, { prefix: `${prefix}/lawyers` });
  await fastify.register(appointmentsRoutes, { prefix: `${prefix}/appointments` });
  await fastify.register(reviewsRoutes, { prefix: `${prefix}/reviews` });
  await fastify.register(adminRoutes, { prefix: `${prefix}/admin` });
  await fastify.register(dashboardRoutes, { prefix: `${prefix}/dashboard` });
  await fastify.register(contentRoutes, { prefix: `${prefix}/content` });
}

// Health check endpoint
fastify.get("/health", async () => {
  return { status: "ok", service: "Trustix API", timestamp: new Date() };
});

// Setup Socket.io Real-Time Messaging Server
setupSocketIO(fastify);

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
