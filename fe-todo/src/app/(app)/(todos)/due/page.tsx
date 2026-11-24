import type { Metadata } from "next";
import { TodoView } from "@/features/todos/components/todo-view";

export const metadata: Metadata = { title: "Due" };

export default function DuePage() {
  return <TodoView view="due" />;
}
