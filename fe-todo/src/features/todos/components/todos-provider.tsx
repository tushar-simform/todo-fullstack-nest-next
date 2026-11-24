"use client";

import { createContext, useContext, type ReactNode } from "react";
import { PlusIcon } from "@/components/ui/icons";
import type { Occurrence, Todo } from "../types";
import { useTodoActions } from "../use-todo-actions";
import { useTodoEditor } from "../use-todo-editor";
import { TodoDialog } from "./todo-dialog";
import { TodoErrorBanner } from "./todo-error-banner";

type TodosContextValue = {
  todos: Todo[];
  toggle: (occurrence: Occurrence, isCompleted: boolean) => void;
  remove: (id: string) => void;
  openEdit: (todo: Todo) => void;
};

const TodosContext = createContext<TodosContextValue | null>(null);

export function useTodos() {
  const value = useContext(TodosContext);
  if (!value) throw new Error("useTodos must be used inside <TodosProvider>");
  return value;
}

/**
 * Single source of truth for all todo tabs: optimistic state, mutations and the
 * create/edit dialog. Lives in the shared layout, so switching tabs is instant.
 */
export function TodosProvider({ todos, children }: { todos: Todo[]; children: ReactNode }) {
  const actions = useTodoActions(todos);
  const editor = useTodoEditor(actions);

  return (
    <TodosContext
      value={{
        todos: actions.todos,
        toggle: actions.toggle,
        remove: actions.remove,
        openEdit: editor.openEdit,
      }}
    >
      {children}
      <TodoErrorBanner message={actions.error} onDismiss={actions.clearError} />

      <button
        type="button"
        onClick={editor.openCreate}
        aria-label="New todo"
        title="New todo"
        className="fixed bottom-[max(1.5rem,env(safe-area-inset-bottom))] right-[max(1.5rem,env(safe-area-inset-right))] z-30 grid size-14 place-items-center rounded-full bg-gradient-to-br from-primary to-accent text-2xl text-white shadow-lg shadow-primary/40 transition-all duration-200 hover:scale-110 hover:shadow-xl active:scale-95 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
      >
        <PlusIcon strokeWidth={2.5} />
      </button>

      <TodoDialog editor={editor.editor} onClose={editor.close} onSubmit={editor.submit} />
    </TodosContext>
  );
}
