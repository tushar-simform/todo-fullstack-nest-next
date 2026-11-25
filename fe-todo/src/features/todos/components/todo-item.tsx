"use client";

import { useState } from "react";
import { IconButton } from "@/components/ui/icon-button";
import { CheckIcon, PencilIcon, TrashIcon, UndoIcon } from "@/components/ui/icons";
import { TODO_EXIT_ANIMATION_MS } from "@/constants";
import { cn } from "@/lib/cn";
import { isTempId } from "../optimistic";
import { isRecurring } from "../occurrences";
import type { Occurrence, Todo } from "../types";
import { DueBadge } from "./due-badge";
import { ConfirmDialog } from "./confirm-dialog";
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
  const [confirm, setConfirm] = useState<"toggle" | "delete" | null>(null);
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
      <div className="pt-0.5" aria-hidden="true">
        <span
          className={cn(
            "grid size-6 shrink-0 place-items-center rounded-full border-2 transition-all duration-300",
            isCompleted
              ? "border-transparent bg-gradient-to-br from-primary to-accent text-primary-foreground"
              : "border-border",
          )}
        >
          <CheckIcon
            strokeWidth={3}
            className={cn("size-3.5 transition-all duration-300", isCompleted ? "scale-100 opacity-100" : "scale-0 opacity-0")}
          />
        </span>
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
        <IconButton
          label={isCompleted ? "Mark as not done" : "Mark as completed"}
          onClick={() => setConfirm("toggle")}
          disabled={pending}
          className={isCompleted ? undefined : "hover:text-primary"}
        >
          {isCompleted ? <UndoIcon /> : <CheckIcon />}
        </IconButton>
        <IconButton label="Edit todo" onClick={() => onEdit(todo)} disabled={pending}>
          <PencilIcon />
        </IconButton>
        <IconButton
          label={repeating ? "Delete todo and all its repeats" : "Delete todo"}
          tone="danger"
          onClick={() => setConfirm("delete")}
          disabled={pending}
        >
          <TrashIcon />
        </IconButton>
      </div>

      <ConfirmDialog
        open={confirm === "toggle"}
        title={isCompleted ? "Mark as not done?" : "Mark as completed?"}
        message={
          isCompleted
            ? `Move "${todo.title}" back to your active tasks?`
            : `Do you want to mark "${todo.title}" as completed?`
        }
        confirmLabel={isCompleted ? "Mark not done" : "Mark completed"}
        onConfirm={() => onToggle(occurrence, !isCompleted)}
        onClose={() => setConfirm(null)}
      />
      <ConfirmDialog
        open={confirm === "delete"}
        title="Delete todo?"
        message={
          repeating
            ? `"${todo.title}" and all its repeats will be permanently deleted.`
            : `"${todo.title}" will be permanently deleted.`
        }
        confirmLabel="Delete"
        tone="danger"
        onConfirm={handleDelete}
        onClose={() => setConfirm(null)}
      />
    </li>
  );
}
