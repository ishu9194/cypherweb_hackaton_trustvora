import type { FastifyReply, FastifyRequest } from "fastify";

/** Thrown deliberately by controllers to produce a specific status + message. */
export class HttpError extends Error {
  constructor(public statusCode: number, message: string) {
    super(message);
    this.name = "HttpError";
  }
}

type Handler<T = unknown> = (request: FastifyRequest, reply: FastifyReply) => Promise<T>;

/**
 * Wraps a route handler so thrown errors become consistent
 * `{ success: false, message: string }` JSON responses instead of raw 500s.
 * Zod errors are still caught by the global error handler in app.ts (they
 * throw before reaching here in most cases, but we guard anyway).
 */
export function asyncHandler<T>(handler: Handler<T>) {
  return async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      return await handler(request, reply);
    } catch (error) {
      if (error instanceof HttpError) {
        return reply.status(error.statusCode).send({ success: false, message: error.message });
      }
      if (error instanceof Error && error.name === "ZodError") {
        return reply.status(400).send({ success: false, message: error.message });
      }
      request.log.error(error);
      return reply.status(500).send({ success: false, message: "Internal server error" });
    }
  };
}
