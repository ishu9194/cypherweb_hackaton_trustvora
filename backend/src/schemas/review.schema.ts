import { z } from "zod";

export const CreateReviewSchema = z.object({
  lawyerId: z.string().min(1),
  rating: z.number().int().min(1).max(5),
  comment: z.string().trim().min(1, "Please share a few words about your experience"),
});
export type CreateReviewInput = z.infer<typeof CreateReviewSchema>;
