import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import { LAWYERS } from "@/data/lawyers.data";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { SearchBox } from "@/components/ui/search-box";
import { Button } from "@/components/ui/button";
import { Pagination } from "@/components/ui/pagination";
import { FilterSidebar } from "@/components/lawyers/FilterSidebar";
import { AdvancedFiltersDrawer } from "@/components/lawyers/AdvancedFiltersDrawer";
import { ActiveFilterChips } from "@/components/lawyers/ActiveFilterChips";
import { ResultsToolbar, type ViewMode } from "@/components/lawyers/ResultsToolbar";
import { LawyerCard } from "@/components/lawyers/LawyerCard";
import { LawyerListItem } from "@/components/lawyers/LawyerListItem";
import { LawyerCardSkeleton, LawyerListItemSkeleton } from "@/components/lawyers/LawyerCardSkeleton";
import { NoResultsState } from "@/components/lawyers/NoResultsState";
import { CompareBar } from "@/components/lawyers/CompareBar";
import { useDisclosure } from "@/hooks/useDisclosure";
import { DEFAULT_FILTERS, filterLawyers, countActiveFilters, type LawyerFilterState } from "@/lib/lawyerFilters";

const PAGE_SIZE = 6;

export function FindLawyersPage() {
  const [searchParams] = useSearchParams();
  const [filters, setFilters] = useState<LawyerFilterState>(() => {
    const area = searchParams.get("area");
    const city = searchParams.get("city");
    return {
      ...DEFAULT_FILTERS,
      practiceAreas: area ? [area] : [],
      city: city ?? null,
      onlineOnly: searchParams.get("availability") === "today",
    };
  });
  const [view, setView] = useState<ViewMode>("grid");
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const advanced = useDisclosure();

  const updateFilter = <K extends keyof LawyerFilterState>(key: K, value: LawyerFilterState[K]) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const clearAll = () => setFilters(DEFAULT_FILTERS);

  const results = useMemo(() => filterLawyers(LAWYERS, filters), [filters]);
  const totalPages = Math.max(1, Math.ceil(results.length / PAGE_SIZE));
  const pageResults = results.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  // Simulate a network round-trip whenever filters change, to demonstrate skeleton loading.
  useEffect(() => {
    setIsLoading(true);
    setPage(1);
    const timeout = setTimeout(() => setIsLoading(false), 380);
    return () => clearTimeout(timeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <Breadcrumb items={[{ label: "Find Lawyers" }]} />

      <div className="mt-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-foreground sm:text-3xl">Find Your Lawyer</h1>
          <p className="mt-1 text-sm text-muted-foreground">Search {LAWYERS.length}+ verified advocates across India.</p>
        </div>
        <SearchBox
          placeholder="Search by lawyer name…"
          onSearch={(q) => updateFilter("query", q)}
          className="sm:w-72"
        />
      </div>

      <div className="mt-8 flex flex-col gap-8 lg:flex-row">
        <FilterSidebar filters={filters} onChange={updateFilter} onClearAll={clearAll} />

        <div className="min-w-0 flex-1 space-y-5">
          <ResultsToolbar
            resultCount={results.length}
            sort={filters.sort}
            onSortChange={(v) => updateFilter("sort", v)}
            view={view}
            onViewChange={setView}
            onOpenAdvanced={advanced.open}
            activeFilterCount={countActiveFilters(filters)}
          />

          <ActiveFilterChips filters={filters} onChange={updateFilter} onClearAll={clearAll} />

          {isLoading ? (
            <div className={view === "grid" ? "grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3" : "space-y-4"}>
              {Array.from({ length: PAGE_SIZE }).map((_, i) =>
                view === "grid" ? <LawyerCardSkeleton key={i} /> : <LawyerListItemSkeleton key={i} />,
              )}
            </div>
          ) : pageResults.length === 0 ? (
            <NoResultsState
              onClearAll={clearAll}
              onTryPracticeArea={(area) => updateFilter("practiceAreas", [area])}
            />
          ) : (
            <AnimatePresence mode="wait">
              <motion.div
                key={`${view}-${page}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.25 }}
                className={view === "grid" ? "grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3" : "space-y-4"}
              >
                {pageResults.map((lawyer) =>
                  view === "grid" ? <LawyerCard key={lawyer.id} lawyer={lawyer} /> : <LawyerListItem key={lawyer.id} lawyer={lawyer} />,
                )}
              </motion.div>
            </AnimatePresence>
          )}

          {!isLoading && pageResults.length > 0 && (
            <Pagination page={page} totalPages={totalPages} onPageChange={setPage} className="pt-4" />
          )}

          {!isLoading && results.length > 0 && results.length < LAWYERS.length && (
            <div className="flex items-center justify-center gap-2 rounded-xl border border-dashed border-border py-4 text-xs text-muted-foreground">
              <Sparkles className="h-3.5 w-3.5 text-brand-500" />
              Showing {results.length} of {LAWYERS.length} lawyers matching your filters
              <Button variant="link" size="sm" onClick={clearAll} className="h-auto p-0 text-xs">Reset</Button>
            </div>
          )}
        </div>
      </div>

      <AdvancedFiltersDrawer
        open={advanced.isOpen}
        onOpenChange={advanced.close}
        filters={filters}
        onChange={updateFilter}
        onClearAll={clearAll}
        resultCount={results.length}
      />

      <CompareBar />
    </div>
  );
}
