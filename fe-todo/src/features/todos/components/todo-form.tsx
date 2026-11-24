"use client";

import { useId, useState, type FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Chip } from "@/components/ui/chip";
import { Field } from "@/components/ui/field";
import { SegmentedControl } from "@/components/ui/segmented-control";
import { TextArea, TextField } from "@/components/ui/text-field";
import {
  REPEAT_MODE_OPTIONS,
  TODO_DESCRIPTION_MAX_LENGTH,
  TODO_QUICK_DATES,
  TODO_TITLE_MAX_LENGTH,
  WEEKDAY_PRESETS,
  WEEKDAYS,
  type RepeatMode,
} from "@/constants";
import { addDays, buildDueAt, toDateInput, toDateKey, toTimeInput } from "@/lib/date";
import { isRecurring } from "../occurrences";
import { sameDays } from "../repeat";
import type { Todo, TodoInput } from "../types";

type TodoFormProps = {
  /** Present when editing; omitted when creating. */
  todo?: Todo;
  onSubmit: (input: TodoInput) => void;
  onCancel: () => void;
};

function initialSchedule(todo?: Todo) {
  const today = toDateKey(new Date());
  if (todo && isRecurring(todo)) {
    return { mode: "repeat" as RepeatMode, date: todo.repeatStartDate ?? today, time: todo.repeatTime ?? "" };
  }
  if (todo?.dueAt) {
    const due = new Date(todo.dueAt);
    return { mode: "once" as RepeatMode, date: toDateInput(due), time: todo.hasDueTime ? toTimeInput(due) : "" };
  }
  return { mode: "once" as RepeatMode, date: "", time: "" };
}

/** Create / edit form: title, details, and a one-time or repeating schedule. */
export function TodoForm({ todo, onSubmit, onCancel }: TodoFormProps) {
  const id = useId();
  const initial = initialSchedule(todo);
  const [title, setTitle] = useState(todo?.title ?? "");
  const [description, setDescription] = useState(todo?.description ?? "");
  const [mode, setMode] = useState<RepeatMode>(initial.mode);
  const [date, setDate] = useState(initial.date);
  const [time, setTime] = useState(initial.time);
  const [days, setDays] = useState<number[]>(todo?.repeatDays ?? []);

  const repeating = mode === "repeat";
  const canSubmit = title.trim() !== "" && (!repeating || days.length > 0);

  function handleModeChange(next: RepeatMode) {
    setMode(next);
    // A repeating todo always has a start date; default to today.
    if (next === "repeat" && !date) setDate(toDateInput(new Date()));
  }

  function toggleDay(day: number) {
    setDays((current) =>
      current.includes(day) ? current.filter((d) => d !== day) : [...current, day],
    );
  }

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    if (!canSubmit) return;
    const base = { title, description };
    onSubmit(
      repeating
        ? {
            ...base,
            dueAt: null,
            hasDueTime: false,
            repeatDays: [...days].sort((a, b) => a - b),
            repeatTime: time || null,
            repeatStartDate: date || toDateKey(new Date()),
          }
        : {
            ...base,
            dueAt: buildDueAt(date, time || null),
            hasDueTime: Boolean(date && time),
            repeatDays: [],
            repeatTime: null,
            repeatStartDate: null,
          },
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <Field label="Title" htmlFor={`${id}-title`}>
        <TextField
          id={`${id}-title`}
          autoFocus
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="What needs to be done?"
          maxLength={TODO_TITLE_MAX_LENGTH}
          autoComplete="off"
        />
      </Field>

      <Field label="Details (optional)" htmlFor={`${id}-description`}>
        <TextArea
          id={`${id}-description`}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={3}
          maxLength={TODO_DESCRIPTION_MAX_LENGTH}
        />
      </Field>

      <SegmentedControl
        label="Schedule type"
        options={[...REPEAT_MODE_OPTIONS]}
        value={mode}
        onChange={handleModeChange}
      />

      {repeating && (
        <div className="animate-fade-in flex flex-col gap-2">
          <span className="text-sm font-medium text-muted">Repeat on</span>
          <div className="flex flex-wrap gap-2" role="group" aria-label="Repeat on weekdays">
            {WEEKDAYS.map(({ value, short }) => (
              <Chip key={value} active={days.includes(value)} onClick={() => toggleDay(value)}>
                {short}
              </Chip>
            ))}
          </div>
          <div className="flex flex-wrap gap-2">
            {WEEKDAY_PRESETS.map(({ label, days: presetDays }) => (
              <Chip
                key={label}
                active={sameDays(days, presetDays)}
                onClick={() => setDays([...presetDays])}
                className="border-dashed"
              >
                {label}
              </Chip>
            ))}
          </div>
        </div>
      )}

      <div className="flex flex-col gap-2">
        <div className="grid grid-cols-2 gap-3">
          <Field label={repeating ? "Starts on" : "Due date"} htmlFor={`${id}-date`}>
            <TextField
              id={`${id}-date`}
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </Field>
          <Field label={repeating ? "Time of day" : "Time"} htmlFor={`${id}-time`}>
            <TextField
              id={`${id}-time`}
              type="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              disabled={!date}
              className="disabled:opacity-40"
            />
          </Field>
        </div>
        {!repeating && (
          <div className="flex flex-wrap gap-2">
            {TODO_QUICK_DATES.map(({ label, daysFromToday }) => (
              <Chip
                key={label}
                active={date === toDateInput(addDays(new Date(), daysFromToday))}
                onClick={() => setDate(toDateInput(addDays(new Date(), daysFromToday)))}
              >
                {label}
              </Chip>
            ))}
            {(date || time) && (
              <Chip
                onClick={() => {
                  setDate("");
                  setTime("");
                }}
              >
                Clear
              </Chip>
            )}
          </div>
        )}
      </div>

      <div className="mt-2 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="min-h-4 text-xs text-muted" aria-live="polite">
          {repeating && days.length === 0 ? "Pick at least one weekday." : ""}
        </p>
        <div className="flex gap-2 *:flex-1 sm:*:flex-none">
          <Button variant="ghost" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit" disabled={!canSubmit}>
            {todo ? "Save changes" : "Add todo"}
          </Button>
        </div>
      </div>
    </form>
  );
}
