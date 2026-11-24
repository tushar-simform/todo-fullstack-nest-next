import { addDays, formatDay, formatRelative, formatTime, startOfDay } from "@/lib/date";
import type { DueBucket } from "./types";

export function getDueBucket(due: Date, now: Date): DueBucket {
  if (due < now) return "overdue";
  const today = startOfDay(now);
  if (due < addDays(today, 1)) return "today";
  if (due < addDays(today, 2)) return "tomorrow";
  return "upcoming";
}

/** Human label for a due moment, e.g. "Tomorrow, 5:00 PM" or "Overdue · 2 hours ago". */
export function describeDue(
  due: Date,
  hasTime: boolean,
  now: Date,
  completed = false,
): { label: string; bucket: DueBucket } {
  const bucket = getDueBucket(due, now);
  const time = hasTime ? `, ${formatTime(due)}` : "";

  // Finished items are never "overdue": just show when they were due.
  if (completed) return { bucket, label: `${formatDay(due, now)}${time}` };

  switch (bucket) {
    case "overdue":
      return {
        bucket,
        label: hasTime
          ? `Overdue · ${formatRelative(due, now)}`
          : `Overdue · ${formatDay(due, now)}`,
      };
    case "today":
      return { bucket, label: `Today${time}` };
    case "tomorrow":
      return { bucket, label: `Tomorrow${time}` };
    default:
      return { bucket, label: `${formatDay(due, now)}${time}` };
  }
}
