import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Scale, ShieldCheck, User, UserX, Wrench, X } from "lucide-react";
import { useAuth, DEV_PERSONAS, type DevPersonaKey } from "@/context/AuthContext";
import { toast } from "@/components/ui/toaster";
import { cn } from "@/lib/utils";

const PERSONA_OPTIONS: { key: DevPersonaKey; label: string; icon: typeof User }[] = [
  { key: "client", label: "Client", icon: User },
  { key: "lawyer", label: "Lawyer", icon: Scale },
  { key: "admin", label: "Admin", icon: ShieldCheck },
  { key: "guest", label: "Guest", icon: UserX },
];

/**
 * A subtle floating widget, dev/preview builds only, for instantly swapping
 * the active session between preset personas. Never rendered in production —
 * gated on Vite's `import.meta.env.DEV`.
 */
export function DevRoleSwitcher() {
  const { user, switchPersona } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  if (!import.meta.env.DEV) return null;

  const activeKey: DevPersonaKey = user?.role ?? "guest";

  const handleSelect = (persona: DevPersonaKey) => {
    switchPersona(persona);
    const option = PERSONA_OPTIONS.find((o) => o.key === persona)!;
    if (persona === "guest") {
      toast.success("Switched persona to: Guest (signed out)");
    } else {
      toast.success(`Switched persona to: ${option.label} (${DEV_PERSONAS[persona].name})`);
    }
    setIsOpen(false);
  };

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col items-end gap-2">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 12, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="w-56 rounded-2xl border border-border bg-surface p-3 shadow-lifted"
          >
            <div className="mb-2 flex items-center justify-between px-1">
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Dev role switcher</p>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                aria-label="Close dev role switcher"
                className="rounded-full p-0.5 text-muted-foreground hover:bg-surface-sunken hover:text-foreground"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
            <div className="space-y-1">
              {PERSONA_OPTIONS.map((option) => {
                const active = activeKey === option.key;
                return (
                  <button
                    key={option.key}
                    type="button"
                    onClick={() => handleSelect(option.key)}
                    aria-pressed={active}
                    className={cn(
                      "flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-left text-sm font-medium transition-colors",
                      active ? "bg-brand-600 text-white" : "text-foreground hover:bg-surface-sunken",
                    )}
                  >
                    <option.icon className="h-4 w-4 shrink-0" />
                    <span className="min-w-0 flex-1 truncate">
                      {option.label}
                      {option.key !== "guest" && (
                        <span className={cn("block truncate text-xs font-normal", active ? "text-white/80" : "text-muted-foreground")}>
                          {DEV_PERSONAS[option.key].name}
                        </span>
                      )}
                    </span>
                  </button>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        aria-label="Toggle dev role switcher"
        className="flex h-11 w-11 items-center justify-center rounded-full border border-border bg-surface text-muted-foreground shadow-medium transition-colors hover:border-brand-400 hover:text-brand-600"
      >
        <Wrench className="h-4.5 w-4.5" />
      </button>
    </div>
  );
}
