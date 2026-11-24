import { WEEKDAY_PRESETS, WEEKDAYS } from "@/constants";

const sameDays = (a: number[], b: readonly number[]) =>
  a.length === b.length && b.every((d) => a.includes(d));

/** "Every day" / "Weekdays" / "Weekends" / "Mon, Wed, Fri" */
export function formatRepeatDays(days: number[]): string {
  const preset = WEEKDAY_PRESETS.find((p) => sameDays(days, p.days));
  if (preset) return preset.label;
  return WEEKDAYS.filter((d) => days.includes(d.value))
    .map((d) => d.short)
    .join(", ");
}

export { sameDays };
