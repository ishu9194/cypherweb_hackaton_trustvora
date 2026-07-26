import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import type { ConsultationType, Lawyer, LawyerGender } from "@/types";
import {
  DEFAULT_FILTERS,
  EXPERIENCE_BOUNDS,
  FEE_BOUNDS,
  countActiveFilters,
  type LawyerFilterState,
  type SortOption,
} from "@/lib/lawyerFilters";
import { lawyersService } from "@/services/api/lawyers.service";

export type LawyerViewMode = "grid" | "list";

const CSV_KEYS = ["practiceAreas", "languages", "consultationTypes"] as const;
const RANGE_KEYS = ["experienceRange", "feeRange"] as const;

/**
 * Reads the initial filter state from the current URL query string.
 * Runs once (as a lazy useState initializer) so it never fights with
 * the write-back effect below.
 */
function readFiltersFromSearchParams(params: URLSearchParams): LawyerFilterState {
  const getCsv = (key: string): string[] => {
    const raw = params.get(key);
    return raw ? raw.split(",").filter(Boolean) : [];
  };

  const getRange = (key: string, bounds: [number, number]): [number, number] => {
    const raw = params.get(key);
    if (!raw) return bounds;
    const [min, max] = raw.split("-").map(Number);
    if (Number.isNaN(min) || Number.isNaN(max)) return bounds;
    return [min, max];
  };

  return {
    ...DEFAULT_FILTERS,
    query: params.get("q") ?? params.get("query") ?? "",
    // "area" is kept for backwards-compatibility with the homepage search widget.
    practiceAreas: params.get("area") ? [params.get("area") as string] : getCsv("practiceAreas"),
    city: params.get("city"),
    state: params.get("state"),
    court: params.get("court"),
    languages: getCsv("languages"),
    consultationTypes: getCsv("consultationTypes") as ConsultationType[],
    experienceRange: getRange("experienceRange", EXPERIENCE_BOUNDS),
    feeRange: getRange("feeRange", FEE_BOUNDS),
    minRating: Number(params.get("minRating")) || 0,
    gender: (params.get("gender") as LawyerGender | null) ?? null,
    verifiedOnly: params.get("verifiedOnly") === "1",
    onlineOnly: params.get("onlineOnly") === "1" || params.get("availability") === "today",
    sort: (params.get("sort") as SortOption | null) ?? DEFAULT_FILTERS.sort,
  };
}

/** Serializes filter state into a URLSearchParams, omitting anything at its default value. */
function filtersToSearchParams(filters: LawyerFilterState): URLSearchParams {
  const params = new URLSearchParams();

  if (filters.query) params.set("q", filters.query);
  CSV_KEYS.forEach((key) => {
    const value = filters[key];
    if (value.length) params.set(key, value.join(","));
  });
  if (filters.city) params.set("city", filters.city);
  if (filters.state) params.set("state", filters.state);
  if (filters.court) params.set("court", filters.court);
  if (filters.minRating) params.set("minRating", String(filters.minRating));
  if (filters.gender) params.set("gender", filters.gender);
  if (filters.verifiedOnly) params.set("verifiedOnly", "1");
  if (filters.onlineOnly) params.set("onlineOnly", "1");
  if (filters.sort !== DEFAULT_FILTERS.sort) params.set("sort", filters.sort);

  const bounds: Record<(typeof RANGE_KEYS)[number], [number, number]> = {
    experienceRange: EXPERIENCE_BOUNDS,
    feeRange: FEE_BOUNDS,
  };
  RANGE_KEYS.forEach((key) => {
    const [min, max] = filters[key];
    const [boundMin, boundMax] = bounds[key];
    if (min !== boundMin || max !== boundMax) params.set(key, `${min}-${max}`);
  });

  return params;
}

/**
 * The live backend (GET /api/v1/lawyers) only understands a subset of the
 * filters this UI exposes: search, practiceArea, minRating, maxPrice,
 * consultationType, sort, and page. Everything else (city, state, court,
 * languages, experience range, gender, verifiedOnly, onlineOnly, and
 * multi-select practice areas/consultation types beyond the first) is
 * applied client-side as a refinement on top of the fetched page. That
 * means the "results found" count and pagination reflect the *server-side*
 * filters only — the extra client-side filters narrow what's displayed
 * without a matching round-trip to adjust total/pageCount. Once the API
 * supports these fields natively, this refinement step can be deleted.
 */
function refineClientSide(lawyers: Lawyer[], filters: LawyerFilterState): Lawyer[] {
  return lawyers.filter((lawyer) => {
    if (filters.practiceAreas.length > 1 && !filters.practiceAreas.some((area) => lawyer.specializations.includes(area))) return false;
    if (filters.city && lawyer.city !== filters.city) return false;
    if (filters.state && lawyer.state !== filters.state) return false;
    if (filters.court && lawyer.court !== filters.court) return false;
    if (filters.languages.length && !filters.languages.some((lang) => lawyer.languages.includes(lang))) return false;
    if (filters.consultationTypes.length > 1 && !filters.consultationTypes.some((type) => lawyer.consultationTypes.includes(type))) return false;
    if (lawyer.experienceYears < filters.experienceRange[0] || lawyer.experienceYears > filters.experienceRange[1]) return false;
    if (lawyer.consultationFee < filters.feeRange[0]) return false;
    if (filters.gender && lawyer.gender !== filters.gender) return false;
    if (filters.verifiedOnly && !lawyer.verified) return false;
    if (filters.onlineOnly && !lawyer.online) return false;
    return true;
  });
}

interface UseLawyerFiltersOptions {
  pageSize?: number;
}

export function useLawyerFilters(options: UseLawyerFiltersOptions = {}) {
  const { pageSize = 6 } = options;
  const [searchParams, setSearchParams] = useSearchParams();

  const [filters, setFilters] = useState<LawyerFilterState>(() => readFiltersFromSearchParams(searchParams));
  const [view, setView] = useState<LawyerViewMode>("grid");
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [rawResults, setRawResults] = useState<Lawyer[]>([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const isFirstRun = useRef(true);

  const updateFilter = useCallback(
    <K extends keyof LawyerFilterState>(key: K, value: LawyerFilterState[K]) => {
      setFilters((prev) => ({ ...prev, [key]: value }));
    },
    [],
  );

  const clearAll = useCallback(() => setFilters(DEFAULT_FILTERS), []);

  // Keep the URL query string in sync so results are bookmarkable and
  // survive a refresh. Skipped on first render since the URL already
  // matches (it's where we just read `filters` from).
  useEffect(() => {
    if (isFirstRun.current) {
      isFirstRun.current = false;
      return;
    }
    setSearchParams(filtersToSearchParams(filters), { replace: true });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters]);

  // Reset to page 1 whenever the filters change.
  useEffect(() => {
    setPage(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters]);

  // Fetch from the live backend whenever the server-supported filters or page change.
  useEffect(() => {
    let cancelled = false;
    setIsLoading(true);

    lawyersService
      .list({
        search: filters.query || undefined,
        practiceArea: filters.practiceAreas[0],
        minRating: filters.minRating || undefined,
        maxPrice: filters.feeRange[1] !== FEE_BOUNDS[1] ? filters.feeRange[1] : undefined,
        consultationType: filters.consultationTypes[0],
        sort: filters.sort,
        page,
        pageSize,
      })
      .then(({ lawyers, meta }) => {
        if (cancelled) return;
        setRawResults(lawyers);
        setTotal(meta.total);
        setTotalPages(meta.totalPages);
      })
      .catch(() => {
        if (cancelled) return;
        setRawResults([]);
        setTotal(0);
        setTotalPages(1);
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [
    filters.query,
    filters.practiceAreas,
    filters.minRating,
    filters.feeRange,
    filters.consultationTypes,
    filters.sort,
    filters.city,
    filters.state,
    filters.court,
    filters.languages,
    filters.experienceRange,
    filters.gender,
    filters.verifiedOnly,
    filters.onlineOnly,
    page,
    pageSize,
  ]);

  const pageResults = useMemo(() => refineClientSide(rawResults, filters), [rawResults, filters]);
  const activeFilterCount = useMemo(() => countActiveFilters(filters), [filters]);

  return {
    filters,
    updateFilter,
    clearAll,
    results: pageResults,
    resultCount: total,
    pageResults,
    page,
    setPage,
    totalPages,
    isLoading,
    view,
    setView,
    activeFilterCount,
  };
}
