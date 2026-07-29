import { apiClient } from "./client";
import type {
  Lawyer,
  LawyerEducationDB,
  LawyerTimelineDB,
  LawyerCourtMembershipDB,
  LawyerFAQDB,
  LawyerOfficeDB,
  LawyerGalleryImageDB,
} from "@/types";

const BASE = "/lawyer/profile";

// ─── My Profile ───────────────────────────────────────────────────────────────
export const lawyerProfileService = {
  getMyProfile: () => apiClient.get<Lawyer>(BASE),
  updateProfile: (data: Partial<Lawyer>) => apiClient.patch<Lawyer>(BASE, data),

  // Education
  addEducation: (data: Omit<LawyerEducationDB, "id" | "lawyerId" | "order">) =>
    apiClient.post<LawyerEducationDB>(`${BASE}/education`, data),
  updateEducation: (id: string, data: Partial<Omit<LawyerEducationDB, "id" | "lawyerId">>) =>
    apiClient.patch<void>(`${BASE}/education/${id}`, data),
  deleteEducation: (id: string) => apiClient.delete<void>(`${BASE}/education/${id}`),

  // Timeline
  addTimeline: (data: Omit<LawyerTimelineDB, "id" | "lawyerId" | "order">) =>
    apiClient.post<LawyerTimelineDB>(`${BASE}/timeline`, data),
  updateTimeline: (id: string, data: Partial<Omit<LawyerTimelineDB, "id" | "lawyerId">>) =>
    apiClient.patch<void>(`${BASE}/timeline/${id}`, data),
  deleteTimeline: (id: string) => apiClient.delete<void>(`${BASE}/timeline/${id}`),

  // Court Memberships
  addCourtMembership: (data: Omit<LawyerCourtMembershipDB, "id" | "lawyerId" | "order">) =>
    apiClient.post<LawyerCourtMembershipDB>(`${BASE}/court-memberships`, data),
  updateCourtMembership: (id: string, data: Partial<Omit<LawyerCourtMembershipDB, "id" | "lawyerId">>) =>
    apiClient.patch<void>(`${BASE}/court-memberships/${id}`, data),
  deleteCourtMembership: (id: string) => apiClient.delete<void>(`${BASE}/court-memberships/${id}`),

  // FAQs
  addFAQ: (data: Omit<LawyerFAQDB, "id" | "lawyerId" | "order">) =>
    apiClient.post<LawyerFAQDB>(`${BASE}/faqs`, data),
  updateFAQ: (id: string, data: Partial<Omit<LawyerFAQDB, "id" | "lawyerId">>) =>
    apiClient.patch<void>(`${BASE}/faqs/${id}`, data),
  deleteFAQ: (id: string) => apiClient.delete<void>(`${BASE}/faqs/${id}`),

  // Office Locations
  addOffice: (data: Omit<LawyerOfficeDB, "id" | "lawyerId" | "order">) =>
    apiClient.post<LawyerOfficeDB>(`${BASE}/offices`, data),
  updateOffice: (id: string, data: Partial<Omit<LawyerOfficeDB, "id" | "lawyerId">>) =>
    apiClient.patch<void>(`${BASE}/offices/${id}`, data),
  deleteOffice: (id: string) => apiClient.delete<void>(`${BASE}/offices/${id}`),

  // Gallery
  addGalleryImage: (data: Omit<LawyerGalleryImageDB, "id" | "lawyerId" | "order">) =>
    apiClient.post<LawyerGalleryImageDB>(`${BASE}/gallery`, data),
  deleteGalleryImage: (id: string) => apiClient.delete<void>(`${BASE}/gallery/${id}`),
};
