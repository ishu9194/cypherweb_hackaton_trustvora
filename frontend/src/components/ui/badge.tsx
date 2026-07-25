import type { HTMLAttributes } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva("inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium", {
  variants: {
    variant: {
      neutral: "bg-surface-sunken text-muted-foreground",
      brand: "bg-brand-100 text-brand-700 dark:bg-brand-500/15 dark:text-brand-300",
      accent: "bg-accent-100 text-accent-700 dark:bg-accent-500/15 dark:text-accent-300",
      success: "bg-success/10 text-success",
      warning: "bg-warning/10 text-warning",
      danger: "bg-danger/10 text-danger",
      outline: "border border-border-strong text-foreground",
    },
  },
  defaultVariants: { variant: "neutral" },
});

interface BadgeProps extends HTMLAttributes<HTMLSpanElement>, VariantProps<typeof badgeVariants> {}

export function Badge({ className, variant, ...props }: BadgeProps) {
  return <span className={cn(badgeVariants({ variant }), className)} {...props} />;
}
