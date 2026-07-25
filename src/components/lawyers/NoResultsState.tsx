import { SearchX } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PRACTICE_AREAS } from "@/data/practiceAreas.data";

interface NoResultsStateProps {
  onClearAll: () => void;
  onTryPracticeArea: (area: string) => void;
}

export function NoResultsState({ onClearAll, onTryPracticeArea }: NoResultsStateProps) {
  const suggestions = PRACTICE_AREAS.slice(0, 5);

  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border px-6 py-16 text-center">
      <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-surface-sunken text-muted-foreground">
        <SearchX className="h-6 w-6" />
      </div>
      <p className="font-display text-lg font-semibold text-foreground">No lawyers match your filters</p>
      <p className="mt-1.5 max-w-sm text-sm text-muted-foreground">
        Try widening your search — remove a filter or two, or start from a popular practice area below.
      </p>

      <div className="mt-6 flex flex-wrap justify-center gap-2">
        {suggestions.map((area) => (
          <button
            key={area.id}
            type="button"
            onClick={() => onTryPracticeArea(area.name)}
            className="rounded-full border border-border px-3.5 py-1.5 text-xs font-medium text-foreground transition-colors hover:border-brand-500 hover:text-brand-600"
          >
            {area.name}
          </button>
        ))}
      </div>

      <Button variant="outline" className="mt-6" onClick={onClearAll}>
        Clear all filters
      </Button>
    </div>
  );
}
