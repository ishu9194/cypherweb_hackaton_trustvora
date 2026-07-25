import { z } from "zod";

export const LawyerQuerySchema = z.object({
  search: z.string().trim().optional(),
  practiceArea: z.string().trim().optional(),
  minRating: z.coerce.number().min(0).max(5).optional(),
  maxPrice: z.coerce.number().positive().optional(),
  consultationType: z.enum(["video", "voice", "office", "chat"]).optional(),
  sort: z.enum(["rating", "priceAsc", "priceDesc", "experience", "responseTime"]).default("rating"),
  page: z.coerce.number().int().positive().default(1),
  pageSize: z.coerce.number().int().positive().max(50).default(12),
});
export type LawyerQuery = z.infer<typeof LawyerQuerySchema>;
