import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import dotenv from "dotenv";

// Ensure environment variables are loaded before initializing the adapter
dotenv.config();

// Initialize the Prisma 7 Postgres Driver Adapter
const adapter = new PrismaPg({ 
  connectionString: process.env.DATABASE_URL as string 
});

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    adapter,
    log: ["query", "error", "warn"],
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;