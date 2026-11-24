import { TEMP_TODO_ID_PREFIX } from "@/constants";
import type { Todo, TodoInput } from "./types";

export type OptimisticAction =
  | { type: "add"; todo: Todo }
  | { type: "toggle"; id: string; isCompleted: boolean }
  | { type: "toggle-occurrence"; id: string; dateKey: string; isCompleted: boolean }
  | { type: "update"; id: string; input: TodoInput }
  | { type: "remove"; id: string };

export const isTempId = (id: string) => id.startsWith(TEMP_TODO_ID_PREFIX);

export function createTempTodo(input: TodoInput): Todo {
  const now = new Date().toISOString();
  return {
    id: `${TEMP_TODO_ID_PREFIX}${crypto.randomUUID()}`,
    title: input.title.trim(),
    description: input.description?.trim() || null,
    isCompleted: false,
    dueAt: input.dueAt ?? null,
    hasDueTime: input.hasDueTime ?? false,
    repeatDays: input.repeatDays ?? [],
    repeatTime: input.repeatTime ?? null,
    repeatStartDate: input.repeatStartDate ?? null,
    completedDates: [],
    createdAt: now,
    updatedAt: now,
  };
}

export function todosReducer(todos: Todo[], action: OptimisticAction): Todo[] {
  switch (action.type) {
    case "add":
      return [action.todo, ...todos];
    case "toggle":
      return todos.map((t) =>
        t.id === action.id ? { ...t, isCompleted: action.isCompleted } : t,
      );
    case "toggle-occurrence":
      return todos.map((t) =>
        t.id === action.id
          ? {
              ...t,
              completedDates: action.isCompleted
                ? [...new Set([...t.completedDates, action.dateKey])]
                : t.completedDates.filter((d) => d !== action.dateKey),
            }
          : t,
      );
    case "update":
      return todos.map((t) =>
        t.id === action.id
          ? {
              ...t,
              title: action.input.title.trim(),
              description: action.input.description?.trim() || null,
              dueAt: action.input.dueAt ?? null,
              hasDueTime: action.input.hasDueTime ?? false,
              repeatDays: action.input.repeatDays ?? [],
              repeatTime: action.input.repeatTime ?? null,
              repeatStartDate: action.input.repeatStartDate ?? null,
            }
          : t,
      );
    case "remove":
      return todos.filter((t) => t.id !== action.id);
  }
}
