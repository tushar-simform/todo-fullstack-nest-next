import { Card } from "@/components/ui/card";
import { CHART_LABEL_STEP_DAYS, CHART_LABEL_STEP_THRESHOLD } from "@/constants";
import { cn } from "@/lib/cn";
import type { ProgressBucket } from "../stats";

const MIN_BAR_PERCENT = 4;

function Legend() {
  return (
    <ul className="flex items-center gap-4 text-xs text-muted">
      <li className="flex items-center gap-1.5">
        <span className="size-2.5 rounded-sm border border-border bg-surface-muted" /> Planned
      </li>
      <li className="flex items-center gap-1.5">
        <span className="size-2.5 rounded-sm bg-gradient-to-t from-primary to-accent" /> Completed
      </li>
    </ul>
  );
}

/** One column per day (or month): the grey bar is what was planned, the gradient fill what got done. */
export function ProgressChart({ buckets }: { buckets: ProgressBucket[] }) {
  const max = Math.max(1, ...buckets.map((b) => b.planned));
  const labelStep = buckets.length > CHART_LABEL_STEP_THRESHOLD ? CHART_LABEL_STEP_DAYS : 1;
  const dense = buckets.length > CHART_LABEL_STEP_THRESHOLD;

  return (
    <Card className="animate-fade-up p-5">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
        <h2 className="font-semibold">Planned vs completed</h2>
        <Legend />
      </div>
      <div className="flex gap-2">
        <span className="w-5 shrink-0 text-right text-xs tabular-nums text-muted" aria-hidden>
          {max}
        </span>
        <ol className={cn("flex h-44 min-w-0 flex-1 items-end border-b border-border", dense ? "gap-0.5" : "gap-1.5")}>
          {buckets.map((bucket) => {
            const height = bucket.planned === 0 ? 0 : Math.max(MIN_BAR_PERCENT, (bucket.planned / max) * 100);
            const fill = bucket.planned === 0 ? 0 : (bucket.completed / bucket.planned) * 100;
            return (
              <li
                key={bucket.key}
                title={`${bucket.label}: ${bucket.completed} of ${bucket.planned} done`}
                className="relative flex h-full min-w-0 flex-1 flex-col justify-end"
              >
                <span className="sr-only">
                  {bucket.label}: {bucket.completed} of {bucket.planned} done
                </span>
                <div
                  aria-hidden
                  className={cn(
                    "flex w-full flex-col justify-end overflow-hidden rounded-t-md bg-surface-muted",
                    bucket.isFuture && "opacity-60",
                    bucket.isCurrent && "ring-2 ring-primary/40",
                  )}
                  style={{ height: `${height}%` }}
                >
                  <div
                    className="w-full bg-gradient-to-t from-primary to-accent transition-[height] duration-700 ease-out"
                    style={{ height: `${fill}%` }}
                  />
                </div>
              </li>
            );
          })}
        </ol>
      </div>
      <ol aria-hidden className={cn("mt-1.5 flex pl-7", dense ? "gap-0.5" : "gap-1.5")}>
        {buckets.map((bucket, i) => (
          <li
            key={bucket.key}
            className={cn(
              "min-w-0 flex-1 text-center text-[11px] text-muted",
              bucket.isCurrent && "font-semibold text-primary",
            )}
          >
            {i % labelStep === 0 || (bucket.isCurrent && !dense) ? bucket.label : ""}
          </li>
        ))}
      </ol>
    </Card>
  );
}
