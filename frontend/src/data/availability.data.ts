import type { TimeSlot } from "@/types";

const ALL_SLOTS = [
  "09:00 AM", "10:00 AM", "11:00 AM", "12:00 PM",
  "02:00 PM", "03:00 PM", "04:00 PM", "05:00 PM", "06:00 PM",
];

/**
 * Deterministically generates a day's slots from the date + lawyer id so the
 * same inputs always render the same availability (no flicker on re-render).
 */
export function getSlotsForDate(date: Date, lawyerId: string): TimeSlot[] {
  const seed = date.getDate() + date.getMonth() * 31 + lawyerId.charCodeAt(lawyerId.length - 1);
  const isSunday = date.getDay() === 0;

  if (isSunday) return ALL_SLOTS.map((time) => ({ time, available: false }));

  return ALL_SLOTS.map((time, index) => ({
    time,
    available: (seed + index) % 3 !== 0,
  }));
}
