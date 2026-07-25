import { z } from "zod";

// User creation/login schema
// Requires at least one of walletAddress or email — without this, an empty
// body would fall through to an unfiltered lookup in the /users route.
export const CreateUserSchema = z
  .object({
    walletAddress: z.string().optional(),
    email: z.email().optional(),
    name: z.string().min(2).optional(),
  })
  .refine((data) => Boolean(data.walletAddress || data.email), {
    message: "Either walletAddress or email is required",
  });

// Verification submission schema
// userId is a Prisma cuid (User.id uses @default(cuid())), NOT a UUID —
// z.uuid() would reject every real id, so we just require a non-empty string.
export const CreateVerificationSchema = z.object({
  userId: z.string().min(1, "userId is required"),
  claimType: z.string().default("GENERAL_CREDENTIAL"),
  claimData: z.string().min(1),
});

// Verification status update schema (approving or rejecting a claim)
export const UpdateVerificationSchema = z.object({
  status: z.enum(["VERIFIED", "REJECTED"]),
  scoreImpact: z.number().default(10), // Points added/deducted for verification
  reason: z.string().optional(),
});
