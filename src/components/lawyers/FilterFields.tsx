import { PRACTICE_AREAS } from "@/data/practiceAreas.data";
import { CITIES, STATES, COURTS, LANGUAGES } from "@/data/locations.data";
import { Select } from "@/components/ui/select";
import { RadioGroup } from "@/components/ui/radio";
import { RangeSlider } from "@/components/ui/range-slider";
import { Switch } from "@/components/ui/switch";
import { Star } from "lucide-react";
import { EXPERIENCE_BOUNDS, FEE_BOUNDS, type LawyerFilterState } from "@/lib/lawyerFilters";
import { formatCurrency, cn } from "@/lib/utils";

interface FilterFieldsProps {
  filters: LawyerFilterState;
  onChange: <K extends keyof LawyerFilterState>(key: K, value: LawyerFilterState[K]) => void;
}

function toggleInArray(list: string[], value: string): string[] {
  return list.includes(value) ? list.filter((item) => item !== value) : [...list, value];
}

export function FilterFields({ filters, onChange }: FilterFieldsProps) {
  return (
    <div className="space-y-7">
      <div>
        <p className="mb-3 text-sm font-semibold text-foreground">Practice Area</p>
        <div className="flex flex-wrap gap-2">
          {PRACTICE_AREAS.slice(0, 10).map((area) => {
            const active = filters.practiceAreas.includes(area.name);
            return (
              <button
                key={area.id}
                type="button"
                onClick={() => onChange("practiceAreas", toggleInArray(filters.practiceAreas, area.name))}
                className={cn(
                  "rounded-full border px-3 py-1.5 text-xs font-medium transition-colors",
                  active ? "border-brand-600 bg-brand-600 text-white" : "border-border text-muted-foreground hover:border-brand-300 hover:text-foreground",
                )}
              >
                {area.name}
              </button>
            );
          })}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Select
          label="City"
          placeholder="Any city"
          options={CITIES.map((c) => ({ value: c, label: c }))}
          value={filters.city ?? undefined}
          onValueChange={(v) => onChange("city", v)}
        />
        <Select
          label="State"
          placeholder="Any state"
          options={STATES.map((s) => ({ value: s, label: s }))}
          value={filters.state ?? undefined}
          onValueChange={(v) => onChange("state", v)}
        />
      </div>

      <Select
        label="Court"
        placeholder="Any court"
        options={COURTS.map((c) => ({ value: c, label: c }))}
        value={filters.court ?? undefined}
        onValueChange={(v) => onChange("court", v)}
      />

      <div>
        <p className="mb-3 text-sm font-semibold text-foreground">Languages</p>
        <div className="flex flex-wrap gap-2">
          {LANGUAGES.map((lang) => {
            const active = filters.languages.includes(lang);
            return (
              <button
                key={lang}
                type="button"
                onClick={() => onChange("languages", toggleInArray(filters.languages, lang))}
                className={cn(
                  "rounded-full border px-3 py-1.5 text-xs font-medium transition-colors",
                  active ? "border-accent-600 bg-accent-600 text-white" : "border-border text-muted-foreground hover:border-accent-300 hover:text-foreground",
                )}
              >
                {lang}
              </button>
            );
          })}
        </div>
      </div>

      <RangeSlider
        label="Experience (years)"
        min={EXPERIENCE_BOUNDS[0]}
        max={EXPERIENCE_BOUNDS[1]}
        value={filters.experienceRange}
        onValueChange={(v) => onChange("experienceRange", v)}
        formatValue={(v) => `${v}y`}
      />

      <RangeSlider
        label="Consultation Fee"
        min={FEE_BOUNDS[0]}
        max={FEE_BOUNDS[1]}
        step={100}
        value={filters.feeRange}
        onValueChange={(v) => onChange("feeRange", v)}
        formatValue={(v) => formatCurrency(v)}
      />

      <div>
        <p className="mb-3 text-sm font-semibold text-foreground">Minimum Rating</p>
        <div className="flex gap-2">
          {[0, 3, 4, 4.5].map((rating) => (
            <button
              key={rating}
              type="button"
              onClick={() => onChange("minRating", rating)}
              className={cn(
                "flex items-center gap-1 rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors",
                filters.minRating === rating ? "border-amber-500 bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-300" : "border-border text-muted-foreground hover:border-amber-300",
              )}
            >
              {rating === 0 ? "Any" : (
                <>
                  <Star className="h-3 w-3 fill-current" /> {rating}+
                </>
              )}
            </button>
          ))}
        </div>
      </div>

      <div>
        <p className="mb-3 text-sm font-semibold text-foreground">Gender</p>
        <RadioGroup
          orientation="horizontal"
          options={[
            { value: "any", label: "Any" },
            { value: "female", label: "Female" },
            { value: "male", label: "Male" },
          ]}
          value={filters.gender ?? "any"}
          onValueChange={(v) => onChange("gender", v === "any" ? null : (v as LawyerFilterState["gender"]))}
        />
      </div>

      <div className="space-y-4 border-t border-border pt-5">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-foreground">Verified only</p>
            <p className="text-xs text-muted-foreground">Bar Council verified profiles</p>
          </div>
          <Switch checked={filters.verifiedOnly} onCheckedChange={(v) => onChange("verifiedOnly", v)} />
        </div>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-foreground">Online now</p>
            <p className="text-xs text-muted-foreground">Available for an immediate chat</p>
          </div>
          <Switch checked={filters.onlineOnly} onCheckedChange={(v) => onChange("onlineOnly", v)} />
        </div>
      </div>
    </div>
  );
}
