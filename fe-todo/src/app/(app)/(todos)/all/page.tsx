import type { Metadata } from "next";
import { TodoView } from "@/features/todos/components/todo-view";

export const metadata: Metadata = { title: "All" };

export default function AllPage() {
  return <TodoView view="all" />;
}
