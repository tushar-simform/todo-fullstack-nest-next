import type { Metadata } from "next";
import { TodoView } from "@/features/todos/components/todo-view";

export const metadata: Metadata = { title: "Done" };

export default function DonePage() {
  return <TodoView view="done" />;
}
