import { getTodos } from "@/features/todos/api";
import { ProgressView } from "./progress-view";

/** Server Component: loads the todos (uncached, so it streams inside <Suspense>). */
export async function ProgressSection() {
  return <ProgressView todos={await getTodos()} />;
}
