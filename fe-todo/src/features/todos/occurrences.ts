import { RECURRING_LOOKAHEAD_DAYS, RECURRING_LOOKBACK_DAYS } from "@/constants";
import { addDays, dateAt, parseDateKey, startOfDay, toDateKey } from "@/lib/date";
import type { Occurrence, Todo, TodoView } from "./types";

export const isRecurring = (todo: Todo) => todo.repeatDays.length > 0;

/* ---------- building occurrences ---------- */

function occursOn(todo: Todo, day: Date): boolean {
  if (!todo.repeatDays.includes(day.getDay())) return false;
  return !todo.repeatStartDate || toDateKey(day) >= todo.repeatStartDate;
}

function repeatOccurrence(todo: Todo, day: Date): Occurrence {
  const dateKey = toDateKey(day);
  const dueAt = dateAt(dateKey, todo.repeatTime);
  return {
    key: `${todo.id}:${dateKey}`,
    todo,
    dateKey,
    dueAt,
    hasTime: todo.repeatTime !== null,
    isCompleted: todo.completedDates.includes(dateKey),
    sortAt: dueAt,
  };
}

function onceOccurrence(todo: Todo): Occurrence {
  const dueAt = todo.dueAt ? new Date(todo.dueAt) : null;
  return {
    key: todo.id,
    todo,
    dateKey: dueAt ? toDateKey(dueAt) : null,
    dueAt,
    hasTime: todo.hasDueTime,
    isCompleted: todo.isCompleted,
    sortAt: todo.isCompleted ? new Date(todo.updatedAt) : (dueAt ?? new Date(todo.createdAt)),
  };
}

/** Occurrences of a repeating todo on each day in [from, to] (inclusive). */
function repeatBetween(todo: Todo, from: Date, to: Date): Occurrence[] {
  const result: Occurrence[] = [];
  for (let day = from; day <= to; day = addDays(day, 1)) {
    if (occursOn(todo, day)) result.push(repeatOccurrence(todo, day));
  }
  return result;
}

/** The occurrence a todo shows as in "All": today's, else its next one. */
function currentOccurrence(todo: Todo, today: Date): Occurrence {
  if (!isRecurring(todo)) return onceOccurrence(todo);
  const startKey = todo.repeatStartDate;
  const from = startKey && startKey > toDateKey(today) ? parseDateKey(startKey) : today;
  return repeatBetween(todo, from, addDays(from, 6))[0] ?? onceOccurrence(todo);
}

/* ---------- views ---------- */

const byDueAt = (a: Occurrence, b: Occurrence) =>
  (a.dueAt?.getTime() ?? 0) - (b.dueAt?.getTime() ?? 0);

export function selectOccurrences(view: TodoView, todos: Todo[], now: Date): Occurrence[] {
  const today = startOfDay(now);
  const todayKey = toDateKey(today);
  const once = todos.filter((t) => !isRecurring(t));
  const repeating = todos.filter(isRecurring);

  switch (view) {
    case "today": {
      const items = [
        ...once.filter((t) => t.dueAt && toDateKey(new Date(t.dueAt)) === todayKey).map(onceOccurrence),
        ...repeating.flatMap((t) => repeatBetween(t, today, today)),
      ];
      return items.sort((a, b) => Number(a.isCompleted) - Number(b.isCompleted) || byDueAt(a, b));
    }
    case "all":
      return todos.map((t) => currentOccurrence(t, today));
    case "due": {
      const lookback = addDays(today, -RECURRING_LOOKBACK_DAYS);
      return [
        ...once.map(onceOccurrence),
        ...repeating.flatMap((t) => repeatBetween(t, lookback, today)),
      ]
        .filter((o) => !o.isCompleted && o.dueAt !== null && o.dueAt < now)
        .sort(byDueAt);
    }
    case "upcoming": {
      const tomorrow = addDays(today, 1);
      return [
        ...once.map(onceOccurrence).filter((o) => o.dateKey !== null && o.dateKey > todayKey),
        ...repeating.flatMap((t) =>
          repeatBetween(t, tomorrow, addDays(today, RECURRING_LOOKAHEAD_DAYS)),
        ),
      ]
        .filter((o) => !o.isCompleted)
        .sort(byDueAt);
    }
    case "done":
      return [
        ...once.filter((t) => t.isCompleted).map(onceOccurrence),
        ...repeating.flatMap((t) =>
          t.completedDates.map((key) => repeatOccurrence(t, parseDateKey(key))),
        ),
      ].sort((a, b) => b.sortAt.getTime() - a.sortAt.getTime());
  }
}

/** Every dated occurrence whose day falls in [from, to] (inclusive); undated todos are skipped. */
export function selectOccurrencesBetween(todos: Todo[], from: Date, to: Date): Occurrence[] {
  const fromKey = toDateKey(from);
  const toKey = toDateKey(to);
  return todos.flatMap((todo) =>
    isRecurring(todo)
      ? repeatBetween(todo, from, to)
      : [onceOccurrence(todo)].filter((o) => o.dateKey !== null && o.dateKey >= fromKey && o.dateKey <= toKey),
  );
}

/** Counts for the tab badges. */
export function selectCounts(todos: Todo[], now: Date) {
  return {
    today: selectOccurrences("today", todos, now).filter((o) => !o.isCompleted).length,
    due: selectOccurrences("due", todos, now).length,
    upcoming: selectOccurrences("upcoming", todos, now).length,
  };
}
