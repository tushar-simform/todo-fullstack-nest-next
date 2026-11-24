/** Local-time date helpers. `YYYY-MM-DD` / `HH:mm` match <input type="date|time">. */

const pad = (n: number) => String(n).padStart(2, "0");

export function toDateInput(d: Date): string {
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

export function toTimeInput(d: Date): string {
  return `${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

export function addDays(d: Date, days: number): Date {
  const next = new Date(d);
  next.setDate(next.getDate() + days);
  return next;
}

export function startOfDay(d: Date): Date {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate());
}

/**
 * Build the ISO instant stored by the API. With a time it is that moment in
 * the user's timezone; date-only means "due by the end of that local day".
 */
export function buildDueAt(date: string, time: string | null): string | null {
  return date ? dateAt(date, time).toISOString() : null;
}

export function formatTime(d: Date): string {
  return new Intl.DateTimeFormat(undefined, { timeStyle: "short" }).format(d);
}

export function formatDay(d: Date, now: Date): string {
  return new Intl.DateTimeFormat(undefined, {
    weekday: "short",
    month: "short",
    day: "numeric",
    ...(d.getFullYear() !== now.getFullYear() && { year: "numeric" }),
  }).format(d);
}

/** "2 hours ago" / "in 3 days" in the user's locale. */
export function formatRelative(from: Date, now: Date): string {
  const rtf = new Intl.RelativeTimeFormat(undefined, { numeric: "auto" });
  const diffMin = Math.round((from.getTime() - now.getTime()) / 60_000);
  const abs = Math.abs(diffMin);
  if (abs < 60) return rtf.format(diffMin, "minute");
  if (abs < 60 * 24) return rtf.format(Math.round(diffMin / 60), "hour");
  return rtf.format(Math.round(diffMin / (60 * 24)), "day");
}

/** `YYYY-MM-DD` key for a local calendar day. */
export const toDateKey = toDateInput;

/** Moment a todo is due on a day: that time, or end of the day when no time. */
export function dateAt(dateKey: string, time: string | null): Date {
  const [y, m, d] = dateKey.split("-").map(Number);
  if (time) {
    const [h, min] = time.split(":").map(Number);
    return new Date(y, m - 1, d, h, min);
  }
  return new Date(y, m - 1, d, 23, 59, 59, 999);
}

export function parseDateKey(dateKey: string): Date {
  const [y, m, d] = dateKey.split("-").map(Number);
  return new Date(y, m - 1, d);
}

/** "Today" / "Tomorrow" / "Wed, Nov 25" */
export function formatDayHeading(d: Date, now: Date): string {
  const today = startOfDay(now);
  const day = startOfDay(d);
  if (day.getTime() === today.getTime()) return "Today";
  if (day.getTime() === addDays(today, 1).getTime()) return "Tomorrow";
  return formatDay(d, now);
}
