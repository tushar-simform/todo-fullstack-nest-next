import type { Metadata } from "next";
import { Suspense } from "react";
import { PageHeader } from "@/components/ui/page-header";
import { PROGRESS_SUBTITLE, PROGRESS_TITLE } from "@/constants";
import { ProgressSection } from "@/features/progress/components/progress-section";
import { TodosSkeleton } from "@/features/todos/components/todos-skeleton";

export const metadata: Metadata = { title: "Progress" };

export default function ProgressPage() {
  return (
    <>
      <PageHeader title={PROGRESS_TITLE} subtitle={PROGRESS_SUBTITLE} />
      <Suspense fallback={<TodosSkeleton />}>
        <ProgressSection />
      </Suspense>
    </>
  );
}
