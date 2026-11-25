import type { ComponentProps } from "react";
import { cn } from "@/lib/cn";
import { Spinner } from "./spinner";

type Variant = "primary" | "secondary" | "ghost" | "danger";
type Size = "sm" | "md";

const variants: Record<Variant, string> = {
  primary:
    "bg-gradient-to-br from-primary to-accent text-primary-foreground shadow-md shadow-primary/30 hover:shadow-lg hover:shadow-primary/40 hover:brightness-110",
  secondary:
    "border border-border bg-surface-muted text-foreground hover:border-primary/50",
  ghost: "text-muted hover:bg-surface-muted hover:text-foreground",
  danger: "text-muted hover:bg-danger/10 hover:text-danger",
};

const sizes: Record<Size, string> = {
  sm: "h-8 gap-1.5 px-3 text-sm",
  md: "h-11 gap-2 px-5 text-sm font-medium",
};

/** Shared look for <Button> and <ButtonLink>. */
export function buttonClasses(variant: Variant = "primary", size: Size = "md", className?: string) {
  return cn(
    "inline-flex items-center justify-center whitespace-nowrap rounded-xl font-medium transition-all duration-200",
    "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary",
    "active:scale-95 disabled:pointer-events-none disabled:opacity-50",
    variants[variant],
    sizes[size],
    className,
  );
}

export type ButtonProps = ComponentProps<"button"> & {
  variant?: Variant;
  size?: Size;
  loading?: boolean;
};

export function Button({
  variant = "primary",
  size = "md",
  loading = false,
  disabled,
  className,
  children,
  type = "button",
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      disabled={disabled || loading}
      className={buttonClasses(variant, size, className)}
      {...props}
    >
      {loading && <Spinner />}
      {children}
    </button>
  );
}
