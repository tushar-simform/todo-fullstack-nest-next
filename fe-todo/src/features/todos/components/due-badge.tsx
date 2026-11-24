"use client";

import { AlertIcon, CalendarIcon, ClockIcon } from "@/components/ui/icons";
import { cn } from "@/lib/cn";
import { describeDue } from "../due";
import type { DueBucket } from "../types";
import { useNow } from "../use-now";

const tone: Record<DueBucket, string> = {
  overdue: "bg-danger/10 text-danger",
  today: "bg-warning/15 text-warning",
  tomorrow: "bg-primary/10 text-primary",
  upcoming: "bg-surface-muted text-muted",
};

type DueBadgeProps = { dueAt: Date | null; hasTime: boolean; completed: boolean };

/** Due date pill. Renders nothing until mounted (time/locale are client-only). */
export function DueBadge({ dueAt, hasTime, completed }: DueBadgeProps) {
  const now = useNow();
  if (now === null || !dueAt) return null;

  const due = describeDue(dueAt, hasTime, new Date(now), completed);
  // Finished items keep their date but never look overdue.
  const bucket = completed ? "upcoming" : due.bucket;
  const Icon = bucket === "overdue" ? AlertIcon : hasTime ? ClockIcon : CalendarIcon;

  return (
    <span
      className={cn(
        "animate-fade-in inline-flex items-center gap-1.5 whitespace-nowrap rounded-full px-2.5 py-1 text-xs font-medium",
        tone[bucket],
      )}
    >
      <Icon />
      {due.label}
    </span>
  );
}
