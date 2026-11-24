"use client";

import { useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { IconButton } from "@/components/ui/icon-button";
import { PencilIcon, TrashIcon } from "@/components/ui/icons";
import { TODO_EXIT_ANIMATION_MS } from "@/constants";
import { cn } from "@/lib/cn";
import { isTempId } from "../optimistic";
import { isRecurring } from "../occurrences";
import type { Occurrence, Todo } from "../types";
import { DueBadge } from "./due-badge";
import { RepeatBadge } from "./repeat-badge";

type TodoItemProps = {
  occurrence: Occurrence;
  onToggle: (occurrence: Occurrence, isCompleted: boolean) => void;
  onEdit: (todo: Todo) => void;
  onDelete: (id: string) => void;
};

export function TodoItem({ occurrence, onToggle, onEdit, onDelete }: TodoItemProps) {
  const { todo, isCompleted } = occurrence;
  const [leaving, setLeaving] = useState(false);
  const pending = isTempId(todo.id);
  const repeating = isRecurring(todo);

  function handleDelete() {
    setLeaving(true);
    setTimeout(() => onDelete(todo.id), TODO_EXIT_ANIMATION_MS);
  }

  return (
    <li
      className={cn(
        "group flex items-start gap-3 p-3.5 transition-colors sm:gap-4 sm:p-4 hover:bg-surface-muted/50",
        leaving ? "animate-item-out" : "animate-item-in",
        pending && "opacity-60",
      )}
    >
      <div className="pt-0.5">
        <Checkbox
          checked={isCompleted}
          onChange={(checked) => onToggle(occurrence, checked)}
          label={`Mark "${todo.title}" as ${isCompleted ? "active" : "done"}`}
          disabled={pending}
        />
      </div>

      <div className="min-w-0 flex-1">
        <p
          className={cn(
            "break-words font-medium transition-all duration-300",
            isCompleted && "text-muted line-through decoration-primary/60",
          )}
        >
          {todo.title}
        </p>
        {todo.description && (
          <p className="mt-1 whitespace-pre-line break-words text-sm text-muted">
            {todo.description}
          </p>
        )}
        <div className="mt-2 flex flex-wrap gap-2">
          <DueBadge dueAt={occurrence.dueAt} hasTime={occurrence.hasTime} completed={isCompleted} />
          {repeating && <RepeatBadge days={todo.repeatDays} />}
        </div>
      </div>

      <div className="flex shrink-0 gap-0.5 opacity-100 transition-opacity pointer-fine:opacity-0 pointer-fine:group-focus-within:opacity-100 pointer-fine:group-hover:opacity-100">
        <IconButton label="Edit todo" onClick={() => onEdit(todo)} disabled={pending}>
          <PencilIcon />
        </IconButton>
        <IconButton
          label={repeating ? "Delete todo and all its repeats" : "Delete todo"}
          tone="danger"
          onClick={handleDelete}
          disabled={pending}
        >
          <TrashIcon />
        </IconButton>
      </div>
    </li>
  );
}
