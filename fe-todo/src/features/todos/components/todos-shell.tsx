import type { ReactNode } from "react";
import { getTodos } from "../api";
import { TodoTabs } from "./todo-tabs";
import { TodosProvider } from "./todos-provider";

/** Server Component: loads todos once for every tab and shares them via context. */
export async function TodosShell({ children }: { children: ReactNode }) {
  const todos = await getTodos();
  // Newest first. Sorted here so the client never re-sorts on every render.
  const sorted = [...todos].sort((a, b) => b.createdAt.localeCompare(a.createdAt));

  return (
    <TodosProvider todos={sorted}>
      <TodoTabs />
      {children}
    </TodosProvider>
  );
}
