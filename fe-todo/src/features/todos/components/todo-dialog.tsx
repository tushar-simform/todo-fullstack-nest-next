"use client";

import { Dialog } from "@/components/ui/dialog";
import { TODO_DIALOG_TITLES } from "@/constants";
import type { Todo, TodoInput } from "../types";
import { TodoForm } from "./todo-form";

export type EditorState = { mode: "create" } | { mode: "edit"; todo: Todo } | null;

type TodoDialogProps = {
  editor: EditorState;
  onClose: () => void;
  onSubmit: (input: TodoInput) => void;
};

/** One dialog for both creating and editing a todo. */
export function TodoDialog({ editor, onClose, onSubmit }: TodoDialogProps) {
  const mode = editor?.mode ?? "create";
  return (
    <Dialog open={editor !== null} onClose={onClose} title={TODO_DIALOG_TITLES[mode]}>
      {editor && (
        <TodoForm
          // Remount per todo so edit state never leaks between todos.
          key={editor.mode === "edit" ? editor.todo.id : "create"}
          todo={editor.mode === "edit" ? editor.todo : undefined}
          onSubmit={onSubmit}
          onCancel={onClose}
        />
      )}
    </Dialog>
  );
}
