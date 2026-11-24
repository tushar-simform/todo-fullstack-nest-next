import type { ComponentProps } from "react";
import { cn } from "@/lib/cn";

export const fieldStyles =
  "w-full min-w-0 rounded-xl border border-border bg-surface-muted px-4 text-base text-foreground sm:text-sm placeholder:text-muted/70 transition-all duration-200 focus:border-primary focus:bg-surface focus:outline-none focus:ring-4 focus:ring-primary/15";

export function TextField({ className, ...props }: ComponentProps<"input">) {
  return <input className={cn(fieldStyles, "h-11", className)} {...props} />;
}

export function TextArea({ className, ...props }: ComponentProps<"textarea">) {
  return (
    <textarea
      className={cn(fieldStyles, "resize-none py-3", className)}
      {...props}
    />
  );
}
