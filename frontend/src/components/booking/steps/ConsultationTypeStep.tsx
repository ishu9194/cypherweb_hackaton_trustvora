import { Building2, MessageSquare, Phone, Video } from "lucide-react";
import type { ConsultationType } from "@/types";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

const OPTIONS: { value: ConsultationType; label: string; description: string; icon: typeof Video }[] = [
  { value: "video", label: "Video Call", description: "Face-to-face over a secure video link", icon: Video },
  { value: "voice", label: "Voice Call", description: "A phone consultation, no video needed", icon: Phone },
  { value: "chat", label: "Chat", description: "Written consultation at your own pace", icon: MessageSquare },
  { value: "office", label: "Office Visit", description: "Meet in person at the lawyer's office", icon: Building2 },
];

interface ConsultationTypeStepProps {
  value: ConsultationType | null;
  onChange: (value: ConsultationType) => void;
}

export function ConsultationTypeStep({ value, onChange }: ConsultationTypeStepProps) {
  return (
    <div>
      <h2 className="font-display text-lg font-semibold text-foreground">How would you like to consult?</h2>
      <p className="mt-1 text-sm text-muted-foreground">Choose the format that works best for you.</p>

      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
        {OPTIONS.map((option) => {
          const isActive = value === option.value;
          return (
            <motion.button
              key={option.value}
              type="button"
              whileTap={{ scale: 0.98 }}
              onClick={() => onChange(option.value)}
              className={cn(
                "flex items-start gap-4 rounded-xl border-2 p-5 text-left transition-colors",
                isActive ? "border-brand-600 bg-brand-50 dark:bg-brand-500/10" : "border-border bg-surface hover:border-brand-300",
              )}
            >
              <span className={cn("flex h-11 w-11 shrink-0 items-center justify-center rounded-xl", isActive ? "bg-brand-600 text-white" : "bg-surface-sunken text-muted-foreground")}>
                <option.icon className="h-5 w-5" />
              </span>
              <div>
                <p className="text-sm font-semibold text-foreground">{option.label}</p>
                <p className="mt-0.5 text-xs text-muted-foreground">{option.description}</p>
              </div>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
