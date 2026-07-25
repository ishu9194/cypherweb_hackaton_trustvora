import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import type { ConsultationType, Lawyer, LawyerGender } from "@/types";
import {
  DEFAULT_FILTERS,
  EXPERIENCE_BOUNDS,
  FEE_BOUNDS,
  countActiveFilters,
  filterLawyers,
  type LawyerFilterState,
  type SortOption,
} from "@/lib/lawyerFilters";

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

interface UseLawyerFiltersOptions {
  pageSize?: number;
  /** Fake network latency (ms) to simulate for skeleton loading states. Set to 0 to disable. */
  simulatedLatencyMs?: number;
}

export function useLawyerFilters(lawyers: Lawyer[], options: UseLawyerFiltersOptions = {}) {
  const { pageSize = 6, simulatedLatencyMs = 380 } = options;
  const [searchParams, setSearchParams] = useSearchParams();

  const [filters, setFilters] = useState<LawyerFilterState>(() => readFiltersFromSearchParams(searchParams));
  const [view, setView] = useState<LawyerViewMode>("grid");
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
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

  // Simulate a network round-trip whenever filters change, so the UI can
  // show skeleton loading states the way a real paginated API would.
  useEffect(() => {
    setPage(1);
    if (simulatedLatencyMs <= 0) return;
    setIsLoading(true);
    const timeout = setTimeout(() => setIsLoading(false), simulatedLatencyMs);
    return () => clearTimeout(timeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters]);

  const results = useMemo(() => filterLawyers(lawyers, filters), [lawyers, filters]);
  const totalPages = Math.max(1, Math.ceil(results.length / pageSize));
  const pageResults = useMemo(
    () => results.slice((page - 1) * pageSize, page * pageSize),
    [results, page, pageSize],
  );
  const activeFilterCount = useMemo(() => countActiveFilters(filters), [filters]);

  return {
    filters,
    updateFilter,
    clearAll,
    results,
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
