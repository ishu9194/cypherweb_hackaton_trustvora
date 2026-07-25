import { X } from "lucide-react";
import { EXPERIENCE_BOUNDS, FEE_BOUNDS, type LawyerFilterState } from "@/lib/lawyerFilters";
import { formatCurrency } from "@/lib/utils";

interface Chip {
  label: string;
  onRemove: () => void;
}

interface ActiveFilterChipsProps {
  filters: LawyerFilterState;
  onChange: <K extends keyof LawyerFilterState>(key: K, value: LawyerFilterState[K]) => void;
  onClearAll: () => void;
}

export function ActiveFilterChips({ filters, onChange, onClearAll }: ActiveFilterChipsProps) {
  const chips: Chip[] = [];

  filters.practiceAreas.forEach((area) =>
    chips.push({ label: area, onRemove: () => onChange("practiceAreas", filters.practiceAreas.filter((a) => a !== area)) }),
  );
  if (filters.city) chips.push({ label: filters.city, onRemove: () => onChange("city", null) });
  if (filters.state) chips.push({ label: filters.state, onRemove: () => onChange("state", null) });
  if (filters.court) chips.push({ label: filters.court, onRemove: () => onChange("court", null) });
  filters.languages.forEach((lang) =>
    chips.push({ label: lang, onRemove: () => onChange("languages", filters.languages.filter((l) => l !== lang)) }),
  );
  if (filters.experienceRange[0] !== EXPERIENCE_BOUNDS[0] || filters.experienceRange[1] !== EXPERIENCE_BOUNDS[1]) {
    chips.push({
      label: `${filters.experienceRange[0]}–${filters.experienceRange[1]} yrs`,
      onRemove: () => onChange("experienceRange", EXPERIENCE_BOUNDS),
    });
  }
  if (filters.feeRange[0] !== FEE_BOUNDS[0] || filters.feeRange[1] !== FEE_BOUNDS[1]) {
    chips.push({
      label: `${formatCurrency(filters.feeRange[0])}–${formatCurrency(filters.feeRange[1])}`,
      onRemove: () => onChange("feeRange", FEE_BOUNDS),
    });
  }
  if (filters.minRating) chips.push({ label: `${filters.minRating}+ rating`, onRemove: () => onChange("minRating", 0) });
  if (filters.gender) chips.push({ label: filters.gender === "female" ? "Female" : "Male", onRemove: () => onChange("gender", null) });
  if (filters.verifiedOnly) chips.push({ label: "Verified only", onRemove: () => onChange("verifiedOnly", false) });
  if (filters.onlineOnly) chips.push({ label: "Online now", onRemove: () => onChange("onlineOnly", false) });

  if (chips.length === 0) return null;

  return (
    <div className="flex flex-wrap items-center gap-2">
      {chips.map((chip) => (
        <button
          key={chip.label}
          type="button"
          onClick={chip.onRemove}
          className="flex items-center gap-1.5 rounded-full border border-brand-200 bg-brand-50 px-3 py-1 text-xs font-medium text-brand-700 transition-colors hover:bg-brand-100 dark:border-brand-500/30 dark:bg-brand-500/10 dark:text-brand-300"
        >
          {chip.label}
          <X className="h-3 w-3" />
        </button>
      ))}
      <button type="button" onClick={onClearAll} className="text-xs font-medium text-muted-foreground underline-offset-2 hover:text-foreground hover:underline">
        Clear all
      </button>
    </div>
  );
}
