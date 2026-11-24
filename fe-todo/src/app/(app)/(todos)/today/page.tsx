import type { Metadata } from "next";
import { TodoView } from "@/features/todos/components/todo-view";

export const metadata: Metadata = { title: "Today" };

export default function TodayPage() {
  return <TodoView view="today" />;
}
