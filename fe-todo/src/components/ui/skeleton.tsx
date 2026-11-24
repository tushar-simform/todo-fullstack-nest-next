import { cn } from "@/lib/cn";

/** Shimmering placeholder block. Size it with className. */
export function Skeleton({ className }: { className?: string }) {
  return (
    <div
      aria-hidden="true"
      className={cn(
        "animate-shimmer rounded-xl bg-[linear-gradient(90deg,var(--surface-muted)_25%,var(--border)_50%,var(--surface-muted)_75%)] bg-[length:200%_100%]",
        className,
      )}
    />
  );
}
