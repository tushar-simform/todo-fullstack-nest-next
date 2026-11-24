"use client";

import { useOptimistic, useState, useTransition } from "react";
import {
  createTodoAction,
  deleteTodoAction,
  toggleOccurrenceAction,
  toggleTodoAction,
  updateTodoAction,
} from "./actions";
import { createTempTodo, todosReducer, type OptimisticAction } from "./optimistic";
import { isRecurring } from "./occurrences";
import type { ActionResult, Occurrence, Todo, TodoInput } from "./types";

/**
 * Optimistic todo mutations. The UI updates immediately; React rolls back
 * automatically when the Server Action fails and `error` is set.
 */
export function useTodoActions(todos: Todo[]) {
  const [optimisticTodos, dispatch] = useOptimistic(todos, todosReducer);
  const [error, setError] = useState<string | null>(null);
  const [, startTransition] = useTransition();

  function mutate(action: OptimisticAction, perform: () => Promise<ActionResult>) {
    setError(null);
    startTransition(async () => {
      dispatch(action);
      const result = await perform();
      if (!result.ok) setError(result.error);
    });
  }

  return {
    todos: optimisticTodos,
    error,
    clearError: () => setError(null),
    add: (input: TodoInput) =>
      mutate({ type: "add", todo: createTempTodo(input) }, () => createTodoAction(input)),
    /** Complete / un-complete one occurrence (a single day for repeating todos). */
    toggle: ({ todo, dateKey }: Occurrence, isCompleted: boolean) => {
      if (isRecurring(todo) && dateKey) {
        mutate({ type: "toggle-occurrence", id: todo.id, dateKey, isCompleted }, () =>
          toggleOccurrenceAction(todo.id, dateKey, isCompleted),
        );
      } else {
        mutate({ type: "toggle", id: todo.id, isCompleted }, () =>
          toggleTodoAction(todo.id, isCompleted),
        );
      }
    },
    update: (id: string, input: TodoInput) =>
      mutate({ type: "update", id, input }, () => updateTodoAction(id, input)),
    remove: (id: string) => mutate({ type: "remove", id }, () => deleteTodoAction(id)),
  };
}
