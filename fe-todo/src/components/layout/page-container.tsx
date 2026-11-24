import type { ReactNode } from "react";

/** Centered column for app pages (todos, settings). */
export function PageContainer({ children }: { children: ReactNode }) {
  return <main className="mx-auto w-full max-w-2xl px-4 pb-28 pt-6 sm:pt-12">{children}</main>;
}
