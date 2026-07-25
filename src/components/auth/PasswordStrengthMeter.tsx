import { motion } from "framer-motion";
import { Check, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface PasswordStrengthMeterProps {
  password: string;
}

interface Rule {
  label: string;
  test: (pw: string) => boolean;
}

const RULES: Rule[] = [
  { label: "8+ characters", test: (pw) => pw.length >= 8 },
  { label: "Uppercase letter", test: (pw) => /[A-Z]/.test(pw) },
  { label: "Number", test: (pw) => /[0-9]/.test(pw) },
  { label: "Special character", test: (pw) => /[^A-Za-z0-9]/.test(pw) },
];

const LEVELS = [
  { label: "Very weak", color: "bg-danger" },
  { label: "Weak", color: "bg-danger" },
  { label: "Fair", color: "bg-amber-500" },
  { label: "Good", color: "bg-brand-500" },
  { label: "Strong", color: "bg-accent-500" },
];

export function PasswordStrengthMeter({ password }: PasswordStrengthMeterProps) {
  const passed = RULES.filter((rule) => rule.test(password)).length;
  const score = password.length === 0 ? 0 : passed;
  const level = LEVELS[score];

  return (
    <div className="mt-2">
      <div className="flex gap-1">
        {RULES.map((_, i) => (
          <div key={i} className="h-1.5 flex-1 overflow-hidden rounded-full bg-surface-sunken">
            <motion.div
              className={cn("h-full rounded-full", i < score ? level.color : "bg-transparent")}
              initial={{ width: 0 }}
              animate={{ width: i < score ? "100%" : "0%" }}
              transition={{ duration: 0.25 }}
            />
          </div>
        ))}
      </div>
      {password.length > 0 && (
        <p className={cn("mt-1.5 text-xs font-medium", score <= 1 ? "text-danger" : score <= 2 ? "text-amber-500" : score === 3 ? "text-brand-600" : "text-accent-600")}>
          {level.label}
        </p>
      )}
      <ul className="mt-2 grid grid-cols-2 gap-x-3 gap-y-1">
        {RULES.map((rule) => {
          const ok = rule.test(password);
          return (
            <li key={rule.label} className={cn("flex items-center gap-1.5 text-[11px]", ok ? "text-accent-600" : "text-muted-foreground")}>
              {ok ? <Check className="h-3 w-3" /> : <X className="h-3 w-3" />}
              {rule.label}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
