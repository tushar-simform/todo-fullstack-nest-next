import type { ReactNode } from "react";
import { Card } from "@/components/ui/card";

type FeatureCardProps = { icon: ReactNode; title: string; description: string; delayMs?: number };

export function FeatureCard({ icon, title, description, delayMs = 0 }: FeatureCardProps) {
  return (
    <Card
      className="animate-fade-up p-5 transition-all duration-300 hover:-translate-y-1 hover:border-primary/40"
      style={{ animationDelay: `${delayMs}ms` }}
    >
      <span className="mb-4 grid size-11 place-items-center rounded-xl bg-primary/10 text-xl text-primary">
        {icon}
      </span>
      <h3 className="font-semibold">{title}</h3>
      <p className="mt-1.5 text-sm text-muted">{description}</p>
    </Card>
  );
}
