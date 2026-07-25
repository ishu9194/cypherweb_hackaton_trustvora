import { SlidersHorizontal, X } from "lucide-react";
import { FilterFields } from "./FilterFields";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { countActiveFilters, type LawyerFilterState } from "@/lib/lawyerFilters";

interface FilterSidebarProps {
  filters: LawyerFilterState;
  onChange: <K extends keyof LawyerFilterState>(key: K, value: LawyerFilterState[K]) => void;
  onClearAll: () => void;
}

export function FilterSidebar({ filters, onChange, onClearAll }: FilterSidebarProps) {
  const activeCount = countActiveFilters(filters);

  return (
    <aside className="hidden w-80 shrink-0 lg:block">
      <div className="sticky top-24 max-h-[calc(100vh-7rem)] overflow-y-auto rounded-2xl border border-border bg-surface p-6">
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="h-4.5 w-4.5 text-brand-600" />
            <h2 className="font-display text-base font-semibold text-foreground">Filters</h2>
            {activeCount > 0 && <Badge variant="brand">{activeCount}</Badge>}
          </div>
          {activeCount > 0 && (
            <Button variant="ghost" size="sm" onClick={onClearAll} className="h-auto p-0 text-xs text-brand-600">
              <X className="h-3 w-3" /> Clear all
            </Button>
          )}
        </div>
        <FilterFields filters={filters} onChange={onChange} />
      </div>
    </aside>
  );
}
