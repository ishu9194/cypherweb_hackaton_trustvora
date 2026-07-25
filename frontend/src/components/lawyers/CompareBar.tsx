import { AnimatePresence, motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Scale as ScaleIcon, X } from "lucide-react";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { MAX_COMPARE, useCompareStore } from "@/hooks/useCompareStore";
import { LAWYERS } from "@/data/lawyers.data";
import { ROUTES } from "@/constants/routes.constants";

/** Sticky bottom bar showing lawyers queued for comparison. "Compare Now" routes to the full comparison page. */
export function CompareBar() {
  const navigate = useNavigate();
  const { compareList, clearCompare } = useCompareStore();
  const lawyers = LAWYERS.filter((lawyer) => compareList.includes(lawyer.id));

  return (
    <AnimatePresence>
      {lawyers.length > 0 && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="glass fixed inset-x-4 bottom-4 z-30 mx-auto flex max-w-2xl items-center justify-between gap-4 rounded-2xl px-5 py-3 shadow-lifted sm:inset-x-auto sm:left-1/2 sm:-translate-x-1/2"
        >
          <div className="flex items-center gap-3">
            <div className="flex -space-x-2">
              {lawyers.map((lawyer) => (
                <Avatar key={lawyer.id} src={lawyer.avatarUrl} name={lawyer.name} size="sm" className="ring-2 ring-background" />
              ))}
              {Array.from({ length: MAX_COMPARE - lawyers.length }).map((_, i) => (
                <div
                  key={`empty-${i}`}
                  className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-dashed border-border bg-surface text-[10px] text-muted-foreground ring-2 ring-background"
                >
                  +
                </div>
              ))}
            </div>
            <span className="text-sm font-medium text-foreground">
              {lawyers.length} of {MAX_COMPARE} selected to compare
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Button size="sm" variant="ghost" onClick={clearCompare} aria-label="Clear comparison">
              <X className="h-3.5 w-3.5" />
            </Button>
            <Button
              size="sm"
              onClick={() => navigate(ROUTES.clientCompareLawyers)}
              disabled={lawyers.length < 1}
            >
              <ScaleIcon className="h-3.5 w-3.5" />
              Compare Now
            </Button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

