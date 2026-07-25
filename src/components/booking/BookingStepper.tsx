import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

export interface BookingStep {
  label: string;
}

interface BookingStepperProps {
  steps: BookingStep[];
  currentStep: number;
}

export function BookingStepper({ steps, currentStep }: BookingStepperProps) {
  return (
    <ol className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:gap-2">
      {steps.map((step, index) => {
        const stepNumber = index + 1;
        const isComplete = stepNumber < currentStep;
        const isCurrent = stepNumber === currentStep;

        return (
          <li key={step.label} className="flex shrink-0 items-center gap-1.5 sm:gap-2">
            <div className="flex items-center gap-2">
              <span
                className={cn(
                  "flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-semibold transition-colors",
                  isComplete && "bg-accent-500 text-white",
                  isCurrent && "bg-brand-600 text-white ring-4 ring-brand-500/20",
                  !isComplete && !isCurrent && "bg-surface-sunken text-muted-foreground",
                )}
              >
                {isComplete ? <Check className="h-3.5 w-3.5" /> : stepNumber}
              </span>
              <span className={cn("hidden text-xs font-medium sm:block", isCurrent ? "text-foreground" : "text-muted-foreground")}>
                {step.label}
              </span>
            </div>
            {stepNumber < steps.length && <span className={cn("h-px w-4 shrink-0 sm:w-8", isComplete ? "bg-accent-500" : "bg-border")} />}
          </li>
        );
      })}
    </ol>
  );
}
