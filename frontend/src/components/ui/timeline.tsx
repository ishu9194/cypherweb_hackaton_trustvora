import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export interface TimelineStep {
  title: string;
  description?: string;
  timestamp?: string;
  icon?: ReactNode;
  status?: "complete" | "current" | "upcoming";
}

interface TimelineProps {
  steps: TimelineStep[];
  className?: string;
}

export function Timeline({ steps, className }: TimelineProps) {
  return (
    <ol className={cn("relative space-y-6 border-l border-border pl-6", className)}>
      {steps.map((step, index) => (
        <li key={index} className="relative">
          <span
            className={cn(
              "absolute -left-[1.6rem] top-0.5 flex h-4 w-4 items-center justify-center rounded-full border-2 border-surface",
              step.status === "complete" && "bg-accent-500",
              step.status === "current" && "bg-brand-600 ring-4 ring-brand-500/20",
              (!step.status || step.status === "upcoming") && "bg-border-strong",
            )}
          />
          <div className="flex items-baseline justify-between gap-3">
            <p className={cn("text-sm font-semibold", step.status === "upcoming" ? "text-muted-foreground" : "text-foreground")}>
              {step.title}
            </p>
            {step.timestamp && <span className="shrink-0 text-xs text-muted-foreground">{step.timestamp}</span>}
          </div>
          {step.description && <p className="mt-0.5 text-sm text-muted-foreground">{step.description}</p>}
        </li>
      ))}
    </ol>
  );
}
