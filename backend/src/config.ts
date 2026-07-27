import dotenv from "dotenv";
dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  throw new Error("❌ FATAL: JWT_SECRET environment variable is missing in backend/.env.");
}

export const config = {
  jwtSecret: JWT_SECRET,
  port: Number(process.env.PORT) || 3000,
  nodeEnv: process.env.NODE_ENV || "development",
};
