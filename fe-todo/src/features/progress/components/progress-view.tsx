"use client";

import { useState } from "react";
import { SegmentedControl } from "@/components/ui/segmented-control";
import { Card } from "@/components/ui/card";
import { DEFAULT_PROGRESS_RANGE, PROGRESS_RANGES, type ProgressRange } from "@/constants";
import { useNow } from "@/features/todos/use-now";
import { TodosSkeleton } from "@/features/todos/components/todos-skeleton";
import type { Todo } from "@/features/todos/types";
import { selectProgress } from "../stats";
import { MotivationCard } from "./motivation-card";
import { ProgressChart } from "./progress-chart";
import { ProgressRing } from "./progress-ring";

const RANGE_OPTIONS = PROGRESS_RANGES.map(({ value, label }) => ({ value, label }));

/** The Progress page: range filter, completion ring, chart and motivation. */
export function ProgressView({ todos }: { todos: Todo[] }) {
  const now = useNow();
  const [range, setRange] = useState<ProgressRange>(DEFAULT_PROGRESS_RANGE);
  if (now === null) return <TodosSkeleton />;

  const stats = selectProgress(todos, range, new Date(now));

  return (
    <div className="flex flex-col gap-4">
      <SegmentedControl label="Time range" options={RANGE_OPTIONS} value={range} onChange={setRange} />

      <Card className="animate-fade-up flex items-center gap-5 p-5">
        <ProgressRing percent={stats.rate} />
        <div className="min-w-0">
          <p className="text-sm text-muted">You completed</p>
          <p className="text-2xl font-bold tabular-nums">
            {stats.completed}
            <span className="text-base font-medium text-muted"> of {stats.planned} planned</span>
          </p>
          <p className="text-sm text-muted">
            {stats.remaining === 0 ? "Nothing left" : `${stats.remaining} still to go`}
          </p>
        </div>
      </Card>

      <ProgressChart buckets={stats.buckets} />
      <MotivationCard stats={stats} />
    </div>
  );
}
