"use client";

import { useState } from "react";
import type { EditorState } from "./components/todo-dialog";
import type { Todo, TodoInput } from "./types";

type Actions = {
  add: (input: TodoInput) => void;
  update: (id: string, input: TodoInput) => void;
};

/** Open/close state for the create/edit dialog and what submit should do. */
export function useTodoEditor({ add, update }: Actions) {
  const [editor, setEditor] = useState<EditorState>(null);

  return {
    editor,
    openCreate: () => setEditor({ mode: "create" }),
    openEdit: (todo: Todo) => setEditor({ mode: "edit", todo }),
    close: () => setEditor(null),
    submit: (input: TodoInput) => {
      if (editor?.mode === "edit") update(editor.todo.id, input);
      else add(input);
      setEditor(null);
    },
  };
}
