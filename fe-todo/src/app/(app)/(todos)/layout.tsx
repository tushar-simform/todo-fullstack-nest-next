import { Suspense, type ReactNode } from "react";
import { PageHeader } from "@/components/ui/page-header";
import { TodosShell } from "@/features/todos/components/todos-shell";
import { TodosSkeleton } from "@/features/todos/components/todos-skeleton";

/** Shared by Today / All / Due / Upcoming / Done: one fetch, one state. */
export default function TodosLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <PageHeader title="My Todos" subtitle="Plan your day, one small win at a time." />
      <Suspense fallback={<TodosSkeleton />}>
        <TodosShell>{children}</TodosShell>
      </Suspense>
    </>
  );
}
