import type { ConsultationType, Lawyer, Review } from "@/types";
import type { SortOption } from "@/lib/lawyerFilters";
import { apiClient } from "./client";
import { ENDPOINTS } from "./endpoints";

const SORT_MAP: Record<SortOption, string> = {
  relevance: "rating",
  rating: "rating",
  experience: "experience",
  "fee-low": "priceAsc",
  "fee-high": "priceDesc",
  newest: "rating",
  reviews: "rating",
};

export interface LawyerListParams {
  search?: string;
  practiceArea?: string;
  minRating?: number;
  maxPrice?: number;
  consultationType?: ConsultationType;
  sort?: SortOption;
  page?: number;
  pageSize?: number;
}

export interface LawyerListMeta {
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
}

export interface LawyerListResult {
  lawyers: Lawyer[];
  meta: LawyerListMeta;
}

function buildQuery(params: LawyerListParams): string {
  const search = new URLSearchParams();
  if (params.search) search.set("search", params.search);
  if (params.practiceArea) search.set("practiceArea", params.practiceArea);
  if (params.minRating) search.set("minRating", String(params.minRating));
  if (params.maxPrice) search.set("maxPrice", String(params.maxPrice));
  if (params.consultationType) search.set("consultationType", params.consultationType);
  if (params.sort) search.set("sort", SORT_MAP[params.sort] ?? "rating");
  if (params.page) search.set("page", String(params.page));
  if (params.pageSize) search.set("pageSize", String(params.pageSize));
  const qs = search.toString();
  return qs ? `?${qs}` : "";
}

export const lawyersService = {
  /** Calls GET /api/v1/lawyers with the active filters as query params. */
  async list(params: LawyerListParams = {}): Promise<LawyerListResult> {
    try {
      const envelope = await apiClient.get<{ data: Lawyer[]; meta: LawyerListMeta }>(
        `${ENDPOINTS.lawyers.list}${buildQuery(params)}`,
        { raw: true },
      );
      return { lawyers: envelope.data ?? [], meta: envelope.meta ?? { page: 1, pageSize: 12, total: 0, totalPages: 1 } };
    } catch {
      return { lawyers: [], meta: { page: 1, pageSize: 12, total: 0, totalPages: 1 } };
    }
  },

  /** Calls GET /api/v1/lawyers/:id dynamically */
  async getById(id: string): Promise<Lawyer | null> {
    try {
      return await apiClient.get<Lawyer>(ENDPOINTS.lawyers.detail(id));
    } catch {
      return null;
    }
  },

  async getReviews(id: string): Promise<Review[]> {
    try {
      return await apiClient.get<Review[]>(ENDPOINTS.lawyers.reviews(id));
    } catch {
      return [];
    }
  },
};
