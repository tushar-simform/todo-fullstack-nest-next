import type { ComponentProps } from "react";
import { cn } from "@/lib/cn";

type IconButtonProps = ComponentProps<"button"> & {
  /** Required: icon-only buttons need an accessible name. */
  label: string;
  tone?: "default" | "danger";
};

export function IconButton({
  label,
  tone = "default",
  className,
  type = "button",
  children,
  ...props
}: IconButtonProps) {
  return (
    <button
      type={type}
      aria-label={label}
      title={label}
      className={cn(
        "inline-flex size-9 items-center justify-center rounded-xl text-lg text-muted transition-all duration-200",
        "focus-visible:outline-2 focus-visible:outline-primary active:scale-90 disabled:opacity-50",
        tone === "danger"
          ? "hover:bg-danger/10 hover:text-danger"
          : "hover:bg-surface-muted hover:text-foreground",
        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
}
