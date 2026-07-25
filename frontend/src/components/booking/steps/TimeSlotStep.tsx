import { getSlotsForDate } from "@/data/availability.data";
import { formatDate } from "@/lib/utils";
import { cn } from "@/lib/utils";

interface TimeSlotStepProps {
  date: Date;
  lawyerId: string;
  value: string | null;
  onChange: (time: string) => void;
}

export function TimeSlotStep({ date, lawyerId, value, onChange }: TimeSlotStepProps) {
  const slots = getSlotsForDate(date, lawyerId);

  return (
    <div>
      <h2 className="font-display text-lg font-semibold text-foreground">Choose a time slot</h2>
      <p className="mt-1 text-sm text-muted-foreground">Available times for {formatDate(date.toISOString())}, in your local time zone.</p>

      <div className="mt-6 grid grid-cols-3 gap-3 sm:grid-cols-4">
        {slots.map((slot) => (
          <button
            key={slot.time}
            type="button"
            disabled={!slot.available}
            onClick={() => onChange(slot.time)}
            className={cn(
              "rounded-lg border px-3 py-2.5 text-sm font-medium transition-colors",
              !slot.available && "cursor-not-allowed border-border text-muted-foreground opacity-40 line-through",
              slot.available && value === slot.time && "border-brand-600 bg-brand-600 text-white",
              slot.available && value !== slot.time && "border-border text-foreground hover:border-brand-400",
            )}
          >
            {slot.time}
          </button>
        ))}
      </div>
    </div>
  );
}
