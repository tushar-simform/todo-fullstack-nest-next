import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

export type SegmentOption<T extends string> = {
  value: T;
  label: string;
  icon?: ReactNode;
};

type SegmentedControlProps<T extends string> = {
  options: SegmentOption<T>[];
  value: T;
  onChange: (value: T) => void;
  label: string;
};

export function SegmentedControl<T extends string>({
  options,
  value,
  onChange,
  label,
}: SegmentedControlProps<T>) {
  return (
    <div
      role="radiogroup"
      aria-label={label}
      className="inline-grid w-full auto-cols-fr grid-flow-col gap-1 rounded-xl border border-border bg-surface-muted p-1 sm:w-auto"
    >
      {options.map((option) => {
        const active = option.value === value;
        return (
          <button
            key={option.value}
            type="button"
            role="radio"
            aria-checked={active}
            onClick={() => onChange(option.value)}
            className={cn(
              "flex items-center justify-center gap-2 rounded-lg px-3 py-2 text-sm font-medium sm:px-3.5 transition-all duration-200",
              "focus-visible:outline-2 focus-visible:outline-primary",
              active
                ? "bg-surface text-foreground shadow-sm"
                : "text-muted hover:text-foreground",
            )}
          >
            {option.icon}
            {option.label}
          </button>
        );
      })}
    </div>
  );
}
