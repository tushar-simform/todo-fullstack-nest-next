"use client";

import { Button } from "@/components/ui/button";
import { MESSAGES } from "@/constants";
import { Card } from "@/components/ui/card";

export default function Error({ reset }: { error: Error; reset: () => void }) {
  return (
    <Card className="animate-fade-up flex flex-col items-center gap-4 p-10 text-center">
      <h2 className="text-lg font-semibold">{MESSAGES.loadTodosFailedTitle}</h2>
      <p className="max-w-sm text-sm text-muted">
        {MESSAGES.loadTodosFailedHint}
      </p>
      <Button onClick={reset}>Try again</Button>
    </Card>
  );
}
