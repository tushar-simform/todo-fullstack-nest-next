import type { ReactNode } from "react";

type SectionProps = {
  title: string;
  description?: string;
  children: ReactNode;
};

/** Titled settings-style row: text on the left, control below/right. */
export function Section({ title, description, children }: SectionProps) {
  return (
    <section className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h2 className="text-sm font-semibold">{title}</h2>
        {description && <p className="mt-0.5 text-sm text-muted">{description}</p>}
      </div>
      {children}
    </section>
  );
}
