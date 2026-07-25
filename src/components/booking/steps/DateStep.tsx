import { Calendar } from "@/components/ui/calendar";

interface DateStepProps {
  value: Date | undefined;
  onChange: (date: Date) => void;
}

export function DateStep({ value, onChange }: DateStepProps) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return (
    <div>
      <h2 className="font-display text-lg font-semibold text-foreground">Pick a date</h2>
      <p className="mt-1 text-sm text-muted-foreground">Sundays are unavailable. Slots typically open up to 30 days ahead.</p>

      <div className="mt-6 max-w-sm">
        <Calendar
          selected={value}
          onSelect={onChange}
          disabledDates={(date) => date < today || date.getDay() === 0}
        />
      </div>
    </div>
  );
}
