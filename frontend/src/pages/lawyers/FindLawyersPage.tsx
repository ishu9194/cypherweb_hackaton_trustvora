import { Sparkles } from "lucide-react";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { SearchBox } from "@/components/ui/search-box";
import { Button } from "@/components/ui/button";
import { Pagination } from "@/components/ui/pagination";
import { FilterSidebar } from "@/components/lawyers/FilterSidebar";
import { AdvancedFiltersDrawer } from "@/components/lawyers/AdvancedFiltersDrawer";
import { ActiveFilterChips } from "@/components/lawyers/ActiveFilterChips";
import { ResultsToolbar } from "@/components/lawyers/ResultsToolbar";
import { LawyerCard } from "@/components/lawyers/LawyerCard";
import { LawyerListItem } from "@/components/lawyers/LawyerListItem";
import { LawyerCardSkeleton, LawyerListItemSkeleton } from "@/components/lawyers/LawyerCardSkeleton";
import { NoResultsState } from "@/components/lawyers/NoResultsState";
import { CompareBar } from "@/components/lawyers/CompareBar";
import { useDisclosure } from "@/hooks/useDisclosure";
import { useLawyerFilters } from "@/hooks/useLawyerFilters";
import { AnimatePresence, motion } from "framer-motion";

export function FindLawyersPage() {
  const {
    filters, updateFilter, clearAll, resultCount, pageResults, page, setPage,
    totalPages, isLoading, view, setView, activeFilterCount,
  } = useLawyerFilters();
  const advanced = useDisclosure();

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <Breadcrumb items={[{ label: "Find Lawyers" }]} />

      <div className="mt-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-foreground sm:text-3xl">Find Your Lawyer</h1>
          <p className="mt-1 text-sm text-muted-foreground">Search verified advocates across India.</p>
        </div>
        <SearchBox
          placeholder="Search by lawyer name…"
          defaultValue={filters.query}
          onSearch={(q) => updateFilter("query", q)}
          className="sm:w-72"
        />
      </div>

      <div className="mt-8 flex flex-col gap-8 lg:flex-row">
        <FilterSidebar filters={filters} onChange={updateFilter} onClearAll={clearAll} />

        <div className="min-w-0 flex-1 space-y-5">
          <ResultsToolbar
            resultCount={resultCount}
            sort={filters.sort}
            onSortChange={(v) => updateFilter("sort", v)}
            view={view}
            onViewChange={setView}
            onOpenAdvanced={advanced.open}
            activeFilterCount={activeFilterCount}
          />

          <ActiveFilterChips filters={filters} onChange={updateFilter} onClearAll={clearAll} />

          {isLoading ? (
            <div className={view === "grid" ? "grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3" : "space-y-4"}>
              {Array.from({ length: pageResults.length || 6 }).map((_, i) =>
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

          {!isLoading && pageResults.length > 0 && pageResults.length < resultCount && (
            <div className="flex items-center justify-center gap-2 rounded-xl border border-dashed border-border py-4 text-xs text-muted-foreground">
              <Sparkles className="h-3.5 w-3.5 text-brand-500" />
              Showing {pageResults.length} of {resultCount} lawyers matching your filters
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
        resultCount={resultCount}
      />

      <CompareBar />
    </div>
  );
}
