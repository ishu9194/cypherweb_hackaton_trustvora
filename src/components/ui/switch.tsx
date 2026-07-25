import * as SwitchPrimitive from "@radix-ui/react-switch";
import { useId } from "react";
import { cn } from "@/lib/utils";

interface SwitchProps {
  checked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  label?: string;
  disabled?: boolean;
  className?: string;
}

export function Switch({ checked, onCheckedChange, label, disabled, className }: SwitchProps) {
  const id = useId();
  return (
    <div className={cn("flex items-center gap-2.5", className)}>
      <SwitchPrimitive.Root
        id={id}
        checked={checked}
        onCheckedChange={onCheckedChange}
        disabled={disabled}
        className="relative h-6 w-11 shrink-0 rounded-full bg-border-strong transition-colors data-[state=checked]:bg-brand-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500/30 disabled:cursor-not-allowed disabled:opacity-50"
      >
        <SwitchPrimitive.Thumb className="block h-5 w-5 translate-x-0.5 rounded-full bg-white shadow-soft transition-transform duration-150 will-change-transform data-[state=checked]:translate-x-[22px]" />
      </SwitchPrimitive.Root>
      {label && (
        <label htmlFor={id} className="cursor-pointer select-none text-sm font-medium text-foreground">
          {label}
        </label>
      )}
    </div>
  );
}
