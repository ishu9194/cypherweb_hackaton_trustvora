import { z } from "zod";

export const RegisterSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("A valid email is required"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  role: z.enum(["CLIENT", "LAWYER", "ADMIN"]).default("CLIENT"),
});
export type RegisterInput = z.infer<typeof RegisterSchema>;

export const LoginSchema = z.object({
  email: z.string().email("A valid email is required"),
  password: z.string().min(1, "Password is required"),
});
export type LoginInput = z.infer<typeof LoginSchema>;

export const GoogleAuthSchema = z.object({
  idToken: z.string().optional(),
  credential: z.string().optional(),
  email: z.string().email().optional(),
  name: z.string().optional(),
});
export type GoogleAuthInput = z.infer<typeof GoogleAuthSchema>;
