import type { ReactNode } from "react";

type FieldProps = { label: string; htmlFor?: string; children: ReactNode };

/** Label + control wrapper for form rows. */
export function Field({ label, htmlFor, children }: FieldProps) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={htmlFor} className="text-sm font-medium text-muted">
        {label}
      </label>
      {children}
    </div>
  );
}
