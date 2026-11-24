import type { Metadata } from "next";
import { TodoView } from "@/features/todos/components/todo-view";

export const metadata: Metadata = { title: "Upcoming" };

export default function UpcomingPage() {
  return <TodoView view="upcoming" />;
}
