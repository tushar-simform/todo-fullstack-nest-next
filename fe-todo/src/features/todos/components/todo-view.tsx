"use client";

import { TODO_EMPTY_COPY } from "@/constants";
import { formatDayHeading, parseDateKey } from "@/lib/date";
import { selectOccurrences } from "../occurrences";
import type { Occurrence, TodoView } from "../types";
import { useNow } from "../use-now";
import { TodoList } from "./todo-list";
import { TodoProgress } from "./todo-progress";
import { useTodos } from "./todos-provider";
import { TodosSkeleton } from "./todos-skeleton";

/** Group occurrences by calendar day, keeping order. */
function groupByDay(items: Occurrence[]) {
  const groups = new Map<string, Occurrence[]>();
  for (const item of items) {
    const key = item.dateKey ?? "none";
    groups.set(key, [...(groups.get(key) ?? []), item]);
  }
  return [...groups];
}

/** One tab's content, derived from the shared todo list. */
export function TodoView({ view }: { view: TodoView }) {
  const { todos, toggle, remove, openEdit } = useTodos();
  const now = useNow();
  if (now === null) return <TodosSkeleton />;

  const current = new Date(now);
  const items = selectOccurrences(view, todos, current);
  const list = { onToggle: toggle, onEdit: openEdit, onDelete: remove, empty: TODO_EMPTY_COPY[view] };

  if (view === "upcoming" && items.length > 0) {
    return (
      <div className="flex flex-col gap-6">
        {groupByDay(items).map(([dateKey, group]) => (
          <section key={dateKey} className="animate-fade-up flex flex-col gap-3">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-muted">
              {dateKey === "none" ? "No date" : formatDayHeading(parseDateKey(dateKey), current)}
            </h2>
            <TodoList occurrences={group} {...list} />
          </section>
        ))}
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {view === "today" && items.length > 0 && (
        <TodoProgress total={items.length} completed={items.filter((i) => i.isCompleted).length} />
      )}
      <TodoList occurrences={items} {...list} />
    </div>
  );
}
