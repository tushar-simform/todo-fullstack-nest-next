import { Card } from "@/components/ui/card";
import { POINTS_PER_PERFECT_DAY, POINTS_PER_TODO, STREAK_COPY } from "@/constants";
import type { ProgressStats } from "../stats";

/** Encouraging message, motivation points and the current streak. */
export function MotivationCard({ stats }: { stats: ProgressStats }) {
  const { motivation, points, streak, completed, perfectDays } = stats;

  return (
    <Card className="animate-fade-up overflow-hidden bg-gradient-to-br from-primary/10 to-accent/10 p-5">
      <div className="flex items-start gap-4">
        <span className="text-4xl" aria-hidden>
          {motivation.emoji}
        </span>
        <div className="min-w-0">
          <h2 className="text-lg font-bold">{motivation.title}</h2>
          <p className="text-sm text-muted">{motivation.message}</p>
        </div>
      </div>

      <dl className="mt-4 grid grid-cols-2 gap-3">
        <div className="rounded-xl bg-surface p-3">
          <dt className="text-xs text-muted">Motivation points</dt>
          <dd className="bg-gradient-to-br from-primary to-accent bg-clip-text text-2xl font-bold tabular-nums text-transparent">
            {points}
          </dd>
        </div>
        <div className="rounded-xl bg-surface p-3">
          <dt className="text-xs text-muted">Day streak</dt>
          <dd className="text-2xl font-bold tabular-nums">{streak > 0 ? `🔥 ${streak}` : "0"}</dd>
        </div>
      </dl>

      <p className="mt-3 text-xs text-muted">
        {streak > 0 ? STREAK_COPY.some(streak) : STREAK_COPY.none} Earn {POINTS_PER_TODO} points per finished todo and{" "}
        {POINTS_PER_PERFECT_DAY} for each perfect day ({completed} done, {perfectDays} perfect{" "}
        {perfectDays === 1 ? "day" : "days"} here).
      </p>
    </Card>
  );
}
