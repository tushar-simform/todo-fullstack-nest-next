import { Card } from "@/components/ui/card";

type TodoProgressProps = { total: number; completed: number };

export function TodoProgress({ total, completed }: TodoProgressProps) {
  const percent = total === 0 ? 0 : Math.round((completed / total) * 100);

  return (
    <Card className="animate-fade-up p-5">
      <div className="mb-3 flex items-end justify-between">
        <div>
          <p className="text-sm text-muted">Your progress</p>
          <p className="text-2xl font-bold tabular-nums">
            {completed}
            <span className="text-base font-medium text-muted"> / {total} done</span>
          </p>
        </div>
        <span className="bg-gradient-to-br from-primary to-accent bg-clip-text text-3xl font-bold tabular-nums text-transparent">
          {percent}%
        </span>
      </div>
      <div
        role="progressbar"
        aria-valuenow={percent}
        aria-valuemin={0}
        aria-valuemax={100}
        className="h-2 overflow-hidden rounded-full bg-surface-muted"
      >
        <div
          className="h-full rounded-full bg-gradient-to-r from-primary to-accent transition-[width] duration-700 ease-out"
          style={{ width: `${percent}%` }}
        />
      </div>
    </Card>
  );
}
