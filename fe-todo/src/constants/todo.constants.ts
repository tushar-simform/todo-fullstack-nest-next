import type { TodoView } from "@/features/todos/types";
import { ROUTES } from "./routes.constants";

export const TODO_TITLE_MAX_LENGTH = 200;
export const TODO_DESCRIPTION_MAX_LENGTH = 2000;

/** Prefix for client-side ids of todos not yet saved. */
export const TEMP_TODO_ID_PREFIX = "temp-";

/** Keep in sync with --animate-item-out in globals.css. */
export const TODO_EXIT_ANIMATION_MS = 220;

/** How often relative due labels refresh. */
export const NOW_TICK_MS = 30_000;

export const TODO_DIALOG_TITLES = {
  create: "New todo",
  edit: "Edit todo",
} as const;

/** Quick-pick due dates in the todo dialog (offset in days from today). */
export const TODO_QUICK_DATES = [
  { label: "Today", daysFromToday: 0 },
  { label: "Tomorrow", daysFromToday: 1 },
  { label: "Next week", daysFromToday: 7 },
] as const;

/* ---------- Tabs / views ---------- */

export const TODO_TABS: { view: TodoView; label: string; href: string }[] = [
  { view: "today", label: "Today", href: ROUTES.today },
  { view: "all", label: "All", href: ROUTES.all },
  { view: "due", label: "Due", href: ROUTES.due },
  { view: "upcoming", label: "Upcoming", href: ROUTES.upcoming },
  { view: "done", label: "Done", href: ROUTES.done },
];

export const TODO_VIEW_SUBTITLES: Record<TodoView, string> = {
  today: "What's on your plate today.",
  all: "Every todo in one place.",
  due: "Open todos whose time has passed.",
  upcoming: "What's coming up next.",
  done: "Everything you've completed.",
};

export const TODO_EMPTY_COPY: Record<TodoView, { title: string; description: string }> = {
  today: { title: "Nothing planned for today", description: "Enjoy the calm, or add a todo with New todo." },
  all: { title: "Nothing here yet", description: "Add your first todo and start getting things done." },
  due: { title: "Nothing overdue", description: "You're all caught up. Nice work!" },
  upcoming: { title: "Nothing upcoming", description: "Give a todo a future date and it will show up here." },
  done: { title: "Nothing completed yet", description: "Finish a todo and it will show up here." },
};

/* ---------- Recurrence ---------- */

export type RepeatMode = "once" | "repeat";

export const REPEAT_MODE_OPTIONS = [
  { value: "once", label: "One-time" },
  { value: "repeat", label: "Repeating" },
] as const;

/** Weekdays use JS numbering: 0 = Sunday ... 6 = Saturday. Shown Monday-first. */
export const WEEKDAYS = [
  { value: 1, short: "Mon" },
  { value: 2, short: "Tue" },
  { value: 3, short: "Wed" },
  { value: 4, short: "Thu" },
  { value: 5, short: "Fri" },
  { value: 6, short: "Sat" },
  { value: 0, short: "Sun" },
] as const;

export const WEEKDAY_PRESETS = [
  { label: "Every day", days: [0, 1, 2, 3, 4, 5, 6] },
  { label: "Weekdays", days: [1, 2, 3, 4, 5] },
  { label: "Weekends", days: [0, 6] },
] as const;

/** Missed occurrences of repeating todos older than this are not listed as Due. */
export const RECURRING_LOOKBACK_DAYS = 7;
/** How far ahead repeating todos are listed under Upcoming. */
export const RECURRING_LOOKAHEAD_DAYS = 14;
