import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { EMAIL_PARAM, EMAIL_PATTERN, LOGIN_NEXT_PARAM, ROUTES, VERIFY_EMAIL_COPY } from "@/constants";
import { AuthCard } from "@/features/auth/components/auth-card";
import { VerifyEmailForm } from "@/features/auth/components/verify-email-form";
import { getCurrentUser } from "@/features/auth/dal";
import { firstParam, safeRedirectPath } from "@/lib/auth/redirect";

export const metadata: Metadata = { title: "Verify email" };

type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>;

/** Needs `?email=` (set by sign-up/login); without it there is nothing to verify. */
async function VerifyContent({ searchParams }: { searchParams: SearchParams }) {
  const params = await searchParams;
  const email = firstParam(params[EMAIL_PARAM]) ?? "";
  const next = safeRedirectPath(firstParam(params[LOGIN_NEXT_PARAM])) ?? undefined;

  if (!EMAIL_PATTERN.test(email)) redirect(ROUTES.register);
  if (await getCurrentUser()) redirect(next ?? ROUTES.today);

  return (
    <AuthCard
      title={VERIFY_EMAIL_COPY.title}
      subtitle={VERIFY_EMAIL_COPY.subtitle(email)}
      footer={
        <p>
          <Link href={ROUTES.register} className="underline-offset-4 hover:text-foreground hover:underline">
            {VERIFY_EMAIL_COPY.wrongEmail}
          </Link>
        </p>
      }
    >
      <VerifyEmailForm email={email} next={next} />
    </AuthCard>
  );
}

export default function VerifyEmailPage({ searchParams }: PageProps<"/verify-email">) {
  return (
    <Suspense fallback={<Skeleton className="mx-auto mt-16 h-80 max-w-md" />}>
      <VerifyContent searchParams={searchParams} />
    </Suspense>
  );
}
