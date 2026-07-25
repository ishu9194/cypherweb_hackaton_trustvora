import { LAWYERS } from "@/data/lawyers.data";
import { REVIEWS } from "@/data/testimonials.data";
import type { Lawyer, Review } from "@/types";
import { sleep } from "@/lib/utils";
import { apiClient } from "./client";
import { ENDPOINTS } from "./endpoints";
import { USE_MOCK_DATA } from "./client";

export interface LawyerFilters {
  practiceArea?: string;
  city?: string;
  language?: string;
  verifiedOnly?: boolean;
  onlineOnly?: boolean;
  minRating?: number;
}

export const lawyersService = {
  async list(filters: LawyerFilters = {}): Promise<Lawyer[]> {
    if (USE_MOCK_DATA) {
      await sleep(400);
      return LAWYERS.filter((lawyer) => {
        if (filters.practiceArea && !lawyer.specializations.includes(filters.practiceArea)) return false;
        if (filters.city && lawyer.city !== filters.city) return false;
        if (filters.language && !lawyer.languages.includes(filters.language)) return false;
        if (filters.verifiedOnly && !lawyer.verified) return false;
        if (filters.onlineOnly && !lawyer.online) return false;
        if (filters.minRating && lawyer.rating < filters.minRating) return false;
        return true;
      });
    }
    return apiClient.get<Lawyer[]>(ENDPOINTS.lawyers.list);
  },

  async getById(id: string): Promise<Lawyer | null> {
    if (USE_MOCK_DATA) {
      await sleep(300);
      return LAWYERS.find((lawyer) => lawyer.id === id) ?? null;
    }
    return apiClient.get<Lawyer>(ENDPOINTS.lawyers.detail(id));
  },

  async getReviews(id: string): Promise<Review[]> {
    if (USE_MOCK_DATA) {
      await sleep(300);
      void id; // dummy data isn't per-lawyer yet; real API will filter server-side
      return REVIEWS;
    }
    return apiClient.get<Review[]>(ENDPOINTS.lawyers.reviews(id));
  },
};
