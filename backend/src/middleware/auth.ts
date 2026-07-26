import type { FastifyReply, FastifyRequest } from "fastify";

export async function verifyToken(request: FastifyRequest, reply: FastifyReply) {
  try {
    await request.jwtVerify();
  } catch {
    return reply.status(401).send({ success: false, message: "Missing or invalid authentication token" });
  }
}

export function requireRole(...roles: string[]) {
  return async (request: FastifyRequest, reply: FastifyReply) => {
    const user = request.user as { sub: string; role?: string } | undefined;
    if (!user || !user.role) {
      return reply.status(401).send({ success: false, message: "Unauthorized: authentication required" });
    }
    const userRole = user.role.toLowerCase();
    const allowedRoles = roles.map((r) => r.toLowerCase());
    if (!allowedRoles.includes(userRole)) {
      return reply.status(403).send({ success: false, message: "Forbidden: insufficient permissions" });
    }
  };
}
