import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { EMAIL_PARAM, EMAIL_PATTERN, RESET_PASSWORD_COPY, ROUTES } from "@/constants";
import { AuthCard } from "@/features/auth/components/auth-card";
import { ResetPasswordForm } from "@/features/auth/components/reset-password-form";
import { firstParam } from "@/lib/auth/redirect";

export const metadata: Metadata = { title: "Reset password" };

/** Needs `?email=` (set by the forgot-password step). */
async function ResetContent({ searchParams }: { searchParams: Promise<{ [key: string]: string | string[] | undefined }> }) {
  const email = firstParam((await searchParams)[EMAIL_PARAM]) ?? "";
  if (!EMAIL_PATTERN.test(email)) redirect(ROUTES.forgotPassword);

  return (
    <AuthCard
      title={RESET_PASSWORD_COPY.title}
      subtitle={RESET_PASSWORD_COPY.subtitle(email)}
      footer={
        <p>
          <Link href={ROUTES.forgotPassword} className="underline-offset-4 hover:text-foreground hover:underline">
            {RESET_PASSWORD_COPY.noCode}
          </Link>
        </p>
      }
    >
      <ResetPasswordForm email={email} />
    </AuthCard>
  );
}

export default function ResetPasswordPage({ searchParams }: PageProps<"/reset-password">) {
  return (
    <Suspense fallback={<Skeleton className="mx-auto mt-16 h-96 max-w-md" />}>
      <ResetContent searchParams={searchParams} />
    </Suspense>
  );
}
