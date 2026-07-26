import type { Review } from "@/types";
import { apiClient } from "./client";
import { ENDPOINTS } from "./endpoints";

export interface CreateReviewInput {
  lawyerId: string;
  rating: number;
  comment: string;
}

export const reviewsService = {
  /** Calls POST /api/v1/reviews */
  async create(input: CreateReviewInput): Promise<Review> {
    return apiClient.post<Review>(ENDPOINTS.reviews.create, input);
  },
};
