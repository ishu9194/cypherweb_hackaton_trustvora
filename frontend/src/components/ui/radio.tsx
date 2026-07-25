import * as RadioGroupPrimitive from "@radix-ui/react-radio-group";
import { useId } from "react";
import { cn } from "@/lib/utils";

interface RadioOption {
  value: string;
  label: string;
  description?: string;
}

interface RadioGroupProps {
  options: RadioOption[];
  value?: string;
  onValueChange?: (value: string) => void;
  className?: string;
  orientation?: "vertical" | "horizontal";
}

export function RadioGroup({ options, value, onValueChange, className, orientation = "vertical" }: RadioGroupProps) {
  const groupId = useId();
  return (
    <RadioGroupPrimitive.Root
      value={value}
      onValueChange={onValueChange}
      className={cn("flex gap-3", orientation === "vertical" ? "flex-col" : "flex-row flex-wrap", className)}
    >
      {options.map((option) => {
        const itemId = `${groupId}-${option.value}`;
        return (
          <div key={option.value} className="flex items-start gap-2.5">
            <RadioGroupPrimitive.Item
              id={itemId}
              value={option.value}
              className="mt-0.5 flex h-4.5 w-4.5 shrink-0 items-center justify-center rounded-full border border-border-strong bg-surface transition-colors data-[state=checked]:border-brand-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500/30"
            >
              <RadioGroupPrimitive.Indicator className="h-2 w-2 rounded-full bg-brand-600" />
            </RadioGroupPrimitive.Item>
            <label htmlFor={itemId} className="cursor-pointer select-none">
              <span className="block text-sm font-medium text-foreground">{option.label}</span>
              {option.description && <span className="block text-xs text-muted-foreground">{option.description}</span>}
            </label>
          </div>
        );
      })}
    </RadioGroupPrimitive.Root>
  );
}
