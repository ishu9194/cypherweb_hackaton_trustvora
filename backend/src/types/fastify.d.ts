import "fastify";
import "@fastify/jwt";

declare module "fastify" {
  interface FastifyInstance {
    authenticate: (request: FastifyRequest, reply: FastifyReply) => Promise<void>;
  }
}

declare module "@fastify/jwt" {
  interface FastifyJWT {
    payload: { sub: string; role: "CLIENT" | "LAWYER" | "ADMIN" };
    user: { sub: string; role: "CLIENT" | "LAWYER" | "ADMIN" };
  }
}
