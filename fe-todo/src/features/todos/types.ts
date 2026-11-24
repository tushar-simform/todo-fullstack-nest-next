/** Mirrors the `Todo` entity returned by the be-todo API. */
export type Todo = {
  id: string;
  title: string;
  description: string | null;
  isCompleted: boolean;
  /** ISO instant, or null when the todo has no due date. */
  dueAt: string | null;
  /** false = date-only (due by end of that local day). */
  hasDueTime: boolean;
  /** Weekdays (0 = Sun ... 6 = Sat) a repeating todo occurs on. Empty = one-time. */
  repeatDays: number[];
  /** Local time of day `HH:mm` for repeating todos (null = all day). */
  repeatTime: string | null;
  /** First day (`YYYY-MM-DD`) a repeating todo applies. */
  repeatStartDate: string | null;
  /** Days (`YYYY-MM-DD`) a repeating todo was completed on. */
  completedDates: string[];
  createdAt: string;
  updatedAt: string;
};

export type TodoInput = {
  title: string;
  description?: string;
  dueAt?: string | null;
  hasDueTime?: boolean;
  repeatDays?: number[];
  repeatTime?: string | null;
  repeatStartDate?: string | null;
};

export type DueBucket = "overdue" | "today" | "tomorrow" | "upcoming";

export type TodoView = "today" | "all" | "due" | "upcoming" | "done";

/** One displayable instance of a todo: a one-time todo, or one day of a repeating one. */
export type Occurrence = {
  key: string;
  todo: Todo;
  /** Local calendar day `YYYY-MM-DD`; null for todos without a date. */
  dateKey: string | null;
  dueAt: Date | null;
  hasTime: boolean;
  isCompleted: boolean;
  /** Used to order the Done list. */
  sortAt: Date;
};

export type ActionResult = { ok: true } | { ok: false; error: string };
