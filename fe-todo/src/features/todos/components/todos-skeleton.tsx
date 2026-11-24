import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function TodosSkeleton() {
  return (
    <div className="flex flex-col gap-4" role="status" aria-label="Loading todos">
      <Skeleton className="h-28" />
      <Skeleton className="h-10 w-64" />
      <Card className="divide-y divide-border">
        {[0, 1, 2].map((i) => (
          <div key={i} className="flex items-center gap-4 p-4">
            <Skeleton className="size-6 rounded-full" />
            <Skeleton className="h-5 flex-1" />
          </div>
        ))}
      </Card>
    </div>
  );
}
