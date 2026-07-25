import { useRef, useState } from "react";
import { cn } from "@/lib/utils";

interface OtpInputProps {
  length?: number;
  onComplete: (code: string) => void;
  error?: boolean;
}

export function OtpInput({ length = 6, onComplete, error }: OtpInputProps) {
  const [values, setValues] = useState<string[]>(Array(length).fill(""));
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const updateValue = (index: number, digit: string) => {
    const next = [...values];
    next[index] = digit;
    setValues(next);

    if (digit && index < length - 1) {
      inputRefs.current[index + 1]?.focus();
    }
    if (next.every((v) => v !== "")) {
      onComplete(next.join(""));
    }
  };

  const handleChange = (index: number, raw: string) => {
    const digit = raw.replace(/[^0-9]/g, "").slice(-1);
    updateValue(index, digit);
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !values[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/[^0-9]/g, "").slice(0, length);
    if (!pasted) return;
    const next = Array(length).fill("");
    pasted.split("").forEach((digit, i) => (next[i] = digit));
    setValues(next);
    const lastIndex = Math.min(pasted.length, length) - 1;
    inputRefs.current[lastIndex]?.focus();
    if (pasted.length === length) onComplete(pasted);
  };

  return (
    <div className="flex justify-center gap-2.5">
      {values.map((value, index) => (
        <input
          key={index}
          ref={(el) => { inputRefs.current[index] = el; }}
          type="text"
          inputMode="numeric"
          maxLength={1}
          value={value}
          onChange={(e) => handleChange(index, e.target.value)}
          onKeyDown={(e) => handleKeyDown(index, e)}
          onPaste={handlePaste}
          aria-label={`Digit ${index + 1}`}
          className={cn(
            "h-13 w-11 rounded-lg border text-center text-lg font-semibold text-foreground transition-colors focus:outline-none focus:ring-2 focus:ring-brand-500/20",
            error ? "border-danger" : "border-border focus:border-brand-500",
          )}
        />
      ))}
    </div>
  );
}
