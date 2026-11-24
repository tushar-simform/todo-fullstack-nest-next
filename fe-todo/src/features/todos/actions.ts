"use server";

import { refresh } from "next/cache";
import { unstable_rethrow } from "next/navigation";
import {
  MESSAGES,
  TODO_DESCRIPTION_MAX_LENGTH,
  TODO_TITLE_MAX_LENGTH,
} from "@/constants";
import { createTodo, patchTodo, removeTodo, setCompletion } from "./api";
import type { ActionResult, TodoInput } from "./types";

/** Run a mutation, then refresh the router so the page re-reads the list. */
async function mutate(fn: () => Promise<void>): Promise<ActionResult> {
  try {
    await fn();
    refresh();
    return { ok: true };
  } catch (error) {
    // Let redirect() (e.g. expired session -> /login) pass through.
    unstable_rethrow(error);
    return { ok: false, error: MESSAGES.genericError };
  }
}

function validate(input: TodoInput): string | null {
  const { title, description, dueAt } = input;
  if (dueAt && Number.isNaN(Date.parse(dueAt))) return MESSAGES.invalidDueDate;
  if (input.repeatDays && input.repeatDays.some((d) => !Number.isInteger(d) || d < 0 || d > 6)) {
    return MESSAGES.invalidRepeat;
  }
  if (!title.trim()) return MESSAGES.titleRequired;
  if (title.trim().length > TODO_TITLE_MAX_LENGTH) return MESSAGES.titleTooLong;
  if (description && description.trim().length > TODO_DESCRIPTION_MAX_LENGTH) {
    return MESSAGES.descriptionTooLong;
  }
  return null;
}

export async function createTodoAction(input: TodoInput): Promise<ActionResult> {
  const error = validate(input);
  if (error) return { ok: false, error };
  return mutate(() =>
    createTodo({
      title: input.title.trim(),
      ...(input.description?.trim() && { description: input.description.trim() }),
      ...(input.dueAt && { dueAt: input.dueAt, hasDueTime: input.hasDueTime ?? false }),
      ...(input.repeatDays?.length && {
        repeatDays: input.repeatDays,
        repeatTime: input.repeatTime ?? null,
        repeatStartDate: input.repeatStartDate ?? null,
      }),
    }),
  );
}

export async function toggleTodoAction(
  id: string,
  isCompleted: boolean,
): Promise<ActionResult> {
  return mutate(() => patchTodo(id, { isCompleted }));
}

export async function updateTodoAction(
  id: string,
  input: TodoInput,
): Promise<ActionResult> {
  const error = validate(input);
  if (error) return { ok: false, error };
  return mutate(() =>
    patchTodo(id, {
      title: input.title.trim(),
      description: input.description?.trim() || null,
      dueAt: input.dueAt ?? null,
      hasDueTime: input.dueAt ? (input.hasDueTime ?? false) : false,
      repeatDays: input.repeatDays ?? [],
      repeatTime: input.repeatDays?.length ? (input.repeatTime ?? null) : null,
      repeatStartDate: input.repeatDays?.length ? (input.repeatStartDate ?? null) : null,
    }),
  );
}

/** Complete / un-complete a single day of a repeating todo. */
export async function toggleOccurrenceAction(
  id: string,
  dateKey: string,
  isCompleted: boolean,
): Promise<ActionResult> {
  return mutate(() => setCompletion(id, dateKey, isCompleted));
}

export async function deleteTodoAction(id: string): Promise<ActionResult> {
  return mutate(() => removeTodo(id));
}
