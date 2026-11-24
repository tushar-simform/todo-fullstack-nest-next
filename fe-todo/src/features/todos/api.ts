import "server-only";
import { API_PATHS } from "@/constants";
import { apiRequest as request } from "@/lib/api/client";
import type { Todo, TodoInput } from "./types";

/**
 * Intentionally uncached: the list changes often and must never be baked into
 * the build. It is read inside <Suspense>, so it streams in at request time.
 */
export async function getTodos(): Promise<Todo[]> {
  const res = await request(API_PATHS.todos);
  return res.json();
}

export async function createTodo(input: TodoInput) {
  await request(API_PATHS.todos, { method: "POST", body: JSON.stringify(input) });
}

export async function patchTodo(
  id: string,
  patch: Partial<
    Pick<
      Todo,
      | "title"
      | "description"
      | "isCompleted"
      | "dueAt"
      | "hasDueTime"
      | "repeatDays"
      | "repeatTime"
      | "repeatStartDate"
    >
  >,
) {
  await request(API_PATHS.todo(id), { method: "PATCH", body: JSON.stringify(patch) });
}

/** Mark one day of a repeating todo done (`true`) or not done (`false`). */
export async function setCompletion(id: string, dateKey: string, isCompleted: boolean) {
  await request(API_PATHS.completion(id, dateKey), {
    method: isCompleted ? "PUT" : "DELETE",
  });
}

export async function removeTodo(id: string) {
  await request(API_PATHS.todo(id), { method: "DELETE" });
}
