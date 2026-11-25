import type { ReactNode } from "react";
import { Card } from "@/components/ui/card";

type AuthCardProps = { title: string; subtitle: ReactNode; children: ReactNode; footer?: ReactNode };

/** Centered card shared by every sign-in related page, with an optional footer line below it. */
export function AuthCard({ title, subtitle, children, footer }: AuthCardProps) {
  return (
    <div className="mx-auto w-full max-w-md py-10 sm:py-16">
      <Card className="animate-fade-up p-6 sm:p-8">
        <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
        <p className="mb-6 mt-1.5 break-words text-sm text-muted">{subtitle}</p>
        {children}
      </Card>
      {footer && <div className="mt-6 space-y-2 text-center text-sm text-muted">{footer}</div>}
    </div>
  );
}
