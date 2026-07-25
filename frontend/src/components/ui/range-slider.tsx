import * as SliderPrimitive from "@radix-ui/react-slider";
import { cn } from "@/lib/utils";

interface RangeSliderProps {
  label?: string;
  value: [number, number];
  onValueChange: (value: [number, number]) => void;
  min: number;
  max: number;
  step?: number;
  formatValue?: (value: number) => string;
  className?: string;
}

export function RangeSlider({ label, value, onValueChange, min, max, step = 1, formatValue, className }: RangeSliderProps) {
  const format = formatValue ?? ((v: number) => `${v}`);

  return (
    <div className={cn("w-full", className)}>
      {label && (
        <div className="mb-3 flex items-center justify-between">
          <label className="text-sm font-medium text-foreground">{label}</label>
          <span className="text-xs font-medium text-muted-foreground">
            {format(value[0])} – {format(value[1])}
          </span>
        </div>
      )}
      <SliderPrimitive.Root
        className="relative flex h-4.5 w-full touch-none select-none items-center"
        min={min}
        max={max}
        step={step}
        value={value}
        onValueChange={(v) => onValueChange([v[0], v[1]] as [number, number])}
        minStepsBetweenThumbs={1}
      >
        <SliderPrimitive.Track className="relative h-1.5 w-full grow rounded-full bg-surface-sunken">
          <SliderPrimitive.Range className="absolute h-full rounded-full bg-brand-600" />
        </SliderPrimitive.Track>
        <SliderPrimitive.Thumb
          aria-label="Minimum"
          className="block h-4.5 w-4.5 rounded-full border-2 border-brand-600 bg-white shadow-soft transition-transform hover:scale-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500/30"
        />
        <SliderPrimitive.Thumb
          aria-label="Maximum"
          className="block h-4.5 w-4.5 rounded-full border-2 border-brand-600 bg-white shadow-soft transition-transform hover:scale-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500/30"
        />
      </SliderPrimitive.Root>
    </div>
  );
}
