import type { Lawyer, LawyerGender } from "@/types";

export type SortOption = "relevance" | "rating" | "experience" | "fee-low" | "fee-high" | "newest";

export interface LawyerFilterState {
  query: string;
  practiceAreas: string[];
  city: string | null;
  state: string | null;
  court: string | null;
  languages: string[];
  experienceRange: [number, number];
  feeRange: [number, number];
  minRating: number;
  gender: LawyerGender | null;
  verifiedOnly: boolean;
  onlineOnly: boolean;
  sort: SortOption;
}

export const EXPERIENCE_BOUNDS: [number, number] = [0, 25];
export const FEE_BOUNDS: [number, number] = [0, 3000];

export const DEFAULT_FILTERS: LawyerFilterState = {
  query: "",
  practiceAreas: [],
  city: null,
  state: null,
  court: null,
  languages: [],
  experienceRange: EXPERIENCE_BOUNDS,
  feeRange: FEE_BOUNDS,
  minRating: 0,
  gender: null,
  verifiedOnly: false,
  onlineOnly: false,
  sort: "relevance",
};

export function filterLawyers(lawyers: Lawyer[], filters: LawyerFilterState): Lawyer[] {
  const query = filters.query.trim().toLowerCase();

  const filtered = lawyers.filter((lawyer) => {
    if (query && !lawyer.name.toLowerCase().includes(query)) return false;
    if (filters.practiceAreas.length && !filters.practiceAreas.some((area) => lawyer.specializations.includes(area))) return false;
    if (filters.city && lawyer.city !== filters.city) return false;
    if (filters.state && lawyer.state !== filters.state) return false;
    if (filters.court && lawyer.court !== filters.court) return false;
    if (filters.languages.length && !filters.languages.some((lang) => lawyer.languages.includes(lang))) return false;
    if (lawyer.experienceYears < filters.experienceRange[0] || lawyer.experienceYears > filters.experienceRange[1]) return false;
    if (lawyer.consultationFee < filters.feeRange[0] || lawyer.consultationFee > filters.feeRange[1]) return false;
    if (filters.minRating && lawyer.rating < filters.minRating) return false;
    if (filters.gender && lawyer.gender !== filters.gender) return false;
    if (filters.verifiedOnly && !lawyer.verified) return false;
    if (filters.onlineOnly && !lawyer.online) return false;
    return true;
  });

  const sorted = [...filtered];
  switch (filters.sort) {
    case "rating":
      sorted.sort((a, b) => b.rating - a.rating);
      break;
    case "experience":
      sorted.sort((a, b) => b.experienceYears - a.experienceYears);
      break;
    case "fee-low":
      sorted.sort((a, b) => a.consultationFee - b.consultationFee);
      break;
    case "fee-high":
      sorted.sort((a, b) => b.consultationFee - a.consultationFee);
      break;
    case "newest":
      sorted.sort((a, b) => new Date(b.joinedAt).getTime() - new Date(a.joinedAt).getTime());
      break;
    default:
      // relevance: verified + online + rating weighted
      sorted.sort((a, b) => {
        const score = (l: Lawyer) => (l.verified ? 2 : 0) + (l.online ? 1 : 0) + l.rating;
        return score(b) - score(a);
      });
  }

  return sorted;
}

export function countActiveFilters(filters: LawyerFilterState): number {
  let count = 0;
  if (filters.practiceAreas.length) count += filters.practiceAreas.length;
  if (filters.city) count += 1;
  if (filters.state) count += 1;
  if (filters.court) count += 1;
  if (filters.languages.length) count += filters.languages.length;
  if (filters.experienceRange[0] !== EXPERIENCE_BOUNDS[0] || filters.experienceRange[1] !== EXPERIENCE_BOUNDS[1]) count += 1;
  if (filters.feeRange[0] !== FEE_BOUNDS[0] || filters.feeRange[1] !== FEE_BOUNDS[1]) count += 1;
  if (filters.minRating) count += 1;
  if (filters.gender) count += 1;
  if (filters.verifiedOnly) count += 1;
  if (filters.onlineOnly) count += 1;
  return count;
}
