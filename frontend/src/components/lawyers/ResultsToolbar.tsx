import { LayoutGrid, List, SlidersHorizontal } from "lucide-react";
import { Select } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { SortOption } from "@/lib/lawyerFilters";
import { cn } from "@/lib/utils";

export type ViewMode = "grid" | "list";

interface ResultsToolbarProps {
  resultCount: number;
  sort: SortOption;
  onSortChange: (sort: SortOption) => void;
  view: ViewMode;
  onViewChange: (view: ViewMode) => void;
  onOpenAdvanced: () => void;
  activeFilterCount: number;
}

const SORT_OPTIONS: { value: SortOption; label: string }[] = [
  { value: "relevance", label: "Relevance" },
  { value: "rating", label: "Highest Rated" },
  { value: "experience", label: "Most Experienced" },
  { value: "fee-low", label: "Fee: Low to High" },
  { value: "fee-high", label: "Fee: High to Low" },
  { value: "newest", label: "Newest" },
];

export function ResultsToolbar({ resultCount, sort, onSortChange, view, onViewChange, onOpenAdvanced, activeFilterCount }: ResultsToolbarProps) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <p className="text-sm text-muted-foreground">
        <span className="font-semibold text-foreground">{resultCount}</span> lawyers found
      </p>

      <div className="flex flex-wrap items-center gap-2">
        <Button variant="outline" size="sm" onClick={onOpenAdvanced} className="lg:hidden">
          <SlidersHorizontal className="h-3.5 w-3.5" />
          Advanced Search
          {activeFilterCount > 0 && <Badge variant="brand" className="ml-1">{activeFilterCount}</Badge>}
        </Button>

        <Select
          options={SORT_OPTIONS}
          value={sort}
          onValueChange={(v) => onSortChange(v as SortOption)}
          className="w-44"
        />

        <div className="flex items-center rounded-lg border border-border p-0.5">
          <button
            type="button"
            aria-label="Grid view"
            aria-pressed={view === "grid"}
            onClick={() => onViewChange("grid")}
            className={cn("flex h-8 w-8 items-center justify-center rounded-md transition-colors", view === "grid" ? "bg-brand-600 text-white" : "text-muted-foreground hover:text-foreground")}
          >
            <LayoutGrid className="h-4 w-4" />
          </button>
          <button
            type="button"
            aria-label="List view"
            aria-pressed={view === "list"}
            onClick={() => onViewChange("list")}
            className={cn("flex h-8 w-8 items-center justify-center rounded-md transition-colors", view === "list" ? "bg-brand-600 text-white" : "text-muted-foreground hover:text-foreground")}
          >
            <List className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
