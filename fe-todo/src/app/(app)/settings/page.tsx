import type { Metadata } from "next";
import { Suspense } from "react";
import { Card } from "@/components/ui/card";
import { PageHeader } from "@/components/ui/page-header";
import { Section } from "@/components/ui/section";
import { Skeleton } from "@/components/ui/skeleton";
import { AccountSection } from "@/features/auth/components/account-section";
import { ThemeSelector } from "@/features/settings/theme-selector";

export const metadata: Metadata = { title: "Settings" };

export default function SettingsPage() {
  return (
    <>
      <PageHeader title="Settings" subtitle="Manage your account and appearance." />

      <Suspense fallback={<Skeleton className="mb-4 h-28" />}>
        <AccountSection />
      </Suspense>

      <Card className="animate-fade-up divide-y divide-border" style={{ animationDelay: "160ms" }}>
        <Section title="Theme" description="Choose how Todo looks to you.">
          <ThemeSelector />
        </Section>
      </Card>
    </>
  );
}
