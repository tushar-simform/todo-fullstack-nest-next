import type { Metadata } from "next";
import { Suspense } from "react";
import { Card } from "@/components/ui/card";
import { PageHeader } from "@/components/ui/page-header";
import { Section } from "@/components/ui/section";
import { Skeleton } from "@/components/ui/skeleton";
import { APP_NAME } from "@/constants";
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
        <Section title="Theme" description={`Choose how ${APP_NAME} looks to you.`}>
          <ThemeSelector />
        </Section>
      </Card>
    </>
  );
}
