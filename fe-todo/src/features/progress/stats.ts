import {
  MOTIVATION_EMPTY,
  MOTIVATION_TIERS,
  POINTS_PER_PERFECT_DAY,
  POINTS_PER_TODO,
  STREAK_LOOKBACK_DAYS,
  type ProgressRange,
} from "@/constants";
import { addDays, startOfDay, toDateKey } from "@/lib/date";
import { selectOccurrencesBetween } from "@/features/todos/occurrences";
import type { Occurrence, Todo } from "@/features/todos/types";

export type ProgressBucket = {
  key: string;
  label: string;
  planned: number;
  completed: number;
  isFuture: boolean;
  isCurrent: boolean;
};

export type Motivation = { emoji: string; title: string; message: string };

export type ProgressStats = {
  buckets: ProgressBucket[];
  planned: number;
  completed: number;
  remaining: number;
  /** Percent of planned todos finished, 0-100. */
  rate: number;
  perfectDays: number;
  points: number;
  streak: number;
  motivation: Motivation;
};

/** Monday-first week start. */
const startOfWeek = (d: Date) => addDays(startOfDay(d), -((d.getDay() + 6) % 7));

function rangeBounds(range: ProgressRange, today: Date): { from: Date; to: Date } {
  const weekStart = startOfWeek(today);
  switch (range) {
    case "week":
      return { from: weekStart, to: addDays(weekStart, 6) };
    case "fortnight":
      return { from: addDays(weekStart, -7), to: addDays(weekStart, 6) };
    case "month":
      return {
        from: new Date(today.getFullYear(), today.getMonth(), 1),
        to: new Date(today.getFullYear(), today.getMonth() + 1, 0),
      };
    case "year":
      return { from: new Date(today.getFullYear(), 0, 1), to: new Date(today.getFullYear(), 11, 31) };
  }
}

const monthKey = (d: Date) => toDateKey(d).slice(0, 7);

function emptyBuckets(range: ProgressRange, from: Date, to: Date, today: Date): ProgressBucket[] {
  const weekday = new Intl.DateTimeFormat(undefined, { weekday: "short" });
  const monthName = new Intl.DateTimeFormat(undefined, { month: "short" });
  const buckets: ProgressBucket[] = [];

  if (range === "year") {
    for (let m = 0; m < 12; m++) {
      const start = new Date(from.getFullYear(), m, 1);
      buckets.push({
        key: monthKey(start),
        label: monthName.format(start),
        planned: 0,
        completed: 0,
        isFuture: start > today,
        isCurrent: monthKey(start) === monthKey(today),
      });
    }
    return buckets;
  }

  for (let day = from; day <= to; day = addDays(day, 1)) {
    buckets.push({
      key: toDateKey(day),
      label: range === "month" ? String(day.getDate()) : weekday.format(day),
      planned: 0,
      completed: 0,
      isFuture: day > today,
      isCurrent: toDateKey(day) === toDateKey(today),
    });
  }
  return buckets;
}

function countByDay(occurrences: Occurrence[]) {
  const days = new Map<string, { planned: number; completed: number }>();
  for (const o of occurrences) {
    if (!o.dateKey) continue;
    const day = days.get(o.dateKey) ?? { planned: 0, completed: 0 };
    day.planned += 1;
    if (o.isCompleted) day.completed += 1;
    days.set(o.dateKey, day);
  }
  return days;
}

/**
 * Consecutive days (ending today) on which every planned todo was done.
 * Days with nothing planned neither extend nor break it, and today only
 * counts once it is fully done (an unfinished today doesn't break it yet).
 */
function currentStreak(todos: Todo[], today: Date): number {
  const from = addDays(today, -STREAK_LOOKBACK_DAYS);
  const days = countByDay(selectOccurrencesBetween(todos, from, today));
  const todayKey = toDateKey(today);
  let streak = 0;
  for (let day = today; day >= from; day = addDays(day, -1)) {
    const counts = days.get(toDateKey(day));
    if (!counts) continue;
    if (counts.completed === counts.planned) streak += 1;
    else if (toDateKey(day) !== todayKey) break;
  }
  return streak;
}

function motivationFor(planned: number, rate: number): Motivation {
  if (planned === 0) return MOTIVATION_EMPTY;
  return MOTIVATION_TIERS.find((tier) => rate >= tier.minRate) ?? MOTIVATION_TIERS[MOTIVATION_TIERS.length - 1];
}

/** Everything the Progress tab shows, for one range. Planned = todos dated inside the range. */
export function selectProgress(todos: Todo[], range: ProgressRange, now: Date): ProgressStats {
  const today = startOfDay(now);
  const { from, to } = rangeBounds(range, today);
  const days = countByDay(selectOccurrencesBetween(todos, from, to));
  const buckets = emptyBuckets(range, from, to, today);
  const index = new Map(buckets.map((b) => [b.key, b]));

  let perfectDays = 0;
  for (const [dateKey, counts] of days) {
    const bucket = index.get(range === "year" ? dateKey.slice(0, 7) : dateKey);
    if (!bucket) continue;
    bucket.planned += counts.planned;
    bucket.completed += counts.completed;
    if (counts.completed === counts.planned && dateKey <= toDateKey(today)) perfectDays += 1;
  }

  const planned = buckets.reduce((sum, b) => sum + b.planned, 0);
  const completed = buckets.reduce((sum, b) => sum + b.completed, 0);
  const rate = planned === 0 ? 0 : Math.round((completed / planned) * 100);

  return {
    buckets,
    planned,
    completed,
    remaining: planned - completed,
    rate,
    perfectDays,
    points: completed * POINTS_PER_TODO + perfectDays * POINTS_PER_PERFECT_DAY,
    streak: currentStreak(todos, today),
    motivation: motivationFor(planned, planned === 0 ? 0 : (completed / planned) * 100),
  };
}
