import type { ReactNode } from "react";
import { motion } from "framer-motion";
import { CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface SuccessStateProps {
  title: string;
  description?: string;
  action?: ReactNode;
  className?: string;
}

export function SuccessState({ title, description, action, className }: SuccessStateProps) {
  return (
    <div className={cn("flex flex-col items-center justify-center rounded-xl border border-accent-200 bg-accent-50 px-6 py-14 text-center dark:border-accent-500/20 dark:bg-accent-500/5", className)}>
      <motion.div
        initial={{ scale: 0.6, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 260, damping: 18 }}
        className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-accent-500 text-white"
      >
        <CheckCircle2 className="h-7 w-7" />
      </motion.div>
      <p className="font-display text-lg font-semibold text-foreground">{title}</p>
      {description && <p className="mt-1.5 max-w-sm text-sm text-muted-foreground">{description}</p>}
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}
