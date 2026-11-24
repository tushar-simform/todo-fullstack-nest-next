import { Card } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { SparklesIcon } from "@/components/ui/icons";
import type { Occurrence, Todo } from "../types";
import { TodoItem } from "./todo-item";

type TodoListProps = {
  occurrences: Occurrence[];
  /** Shown when `occurrences` is empty. */
  empty: { title: string; description: string };
  onToggle: (occurrence: Occurrence, isCompleted: boolean) => void;
  onEdit: (todo: Todo) => void;
  onDelete: (id: string) => void;
};

export function TodoList({ occurrences, empty, ...handlers }: TodoListProps) {
  if (occurrences.length === 0) {
    return (
      <Card>
        <EmptyState icon={<SparklesIcon />} {...empty} />
      </Card>
    );
  }

  return (
    <Card className="overflow-hidden">
      <ul className="divide-y divide-border">
        {occurrences.map((occurrence) => (
          <TodoItem key={occurrence.key} occurrence={occurrence} {...handlers} />
        ))}
      </ul>
    </Card>
  );
}
