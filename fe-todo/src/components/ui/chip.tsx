import type { ComponentProps } from "react";
import { cn } from "@/lib/cn";

type ChipProps = ComponentProps<"button"> & { active?: boolean };

/** Small pill button for quick choices (quick dates, weekday toggles...). */
export function Chip({ active = false, className, type = "button", ...props }: ChipProps) {
  return (
    <button
      type={type}
      aria-pressed={active}
      className={cn(
        "rounded-full border px-3 py-1 text-xs font-medium transition-all duration-200 active:scale-95",
        "focus-visible:outline-2 focus-visible:outline-primary",
        active
          ? "border-transparent bg-primary/15 text-primary"
          : "border-border text-muted hover:border-primary/50 hover:text-foreground",
        className,
      )}
      {...props}
    />
  );
}
