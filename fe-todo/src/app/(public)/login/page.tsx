import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { LOGIN_FORM_COPY, LOGIN_NEXT_PARAM, ROUTES, TOAST_KEYS, TOAST_PARAM } from "@/constants";
import { AuthCard } from "@/features/auth/components/auth-card";
import { ClearDeadSession } from "@/features/auth/components/clear-dead-session";
import { LoginForm } from "@/features/auth/components/login-form";
import { getCurrentUser } from "@/features/auth/dal";
import { firstParam, safeRedirectPath } from "@/lib/auth/redirect";

export const metadata: Metadata = { title: "Log in" };

/** Reads the session + `?next=`, so it must stream inside <Suspense>. */
async function LoginContent({ searchParams }: { searchParams: Promise<{ [key: string]: string | string[] | undefined }> }) {
  const params = await searchParams;
  const next = safeRedirectPath(firstParam(params[LOGIN_NEXT_PARAM])) ?? undefined;

  // Already signed in (verified by the API)? Skip the form.
  if (await getCurrentUser()) redirect(next ?? ROUTES.today);

  // Sent here because the session expired: remove the dead cookie (the API just confirmed nobody is signed in).
  const sessionExpired = firstParam(params[TOAST_PARAM]) === TOAST_KEYS.sessionExpired;

  return (
    <>
      {sessionExpired && <ClearDeadSession />}
      <LoginForm next={next} />
    </>
  );
}

export default function LoginPage({ searchParams }: PageProps<"/login">) {
  return (
    <AuthCard
      title={LOGIN_FORM_COPY.title}
      subtitle={LOGIN_FORM_COPY.subtitle}
      footer={
        <>
          <p>
            {LOGIN_FORM_COPY.noAccount}{" "}
            <Link href={ROUTES.register} className="font-medium text-foreground underline-offset-4 hover:underline">
              {LOGIN_FORM_COPY.createAccount}
            </Link>
          </p>
          <p>
            <Link href={ROUTES.home} className="underline-offset-4 hover:text-foreground hover:underline">
              {LOGIN_FORM_COPY.back}
            </Link>
          </p>
        </>
      }
    >
      <Suspense fallback={<Skeleton className="h-64" />}>
        <LoginContent searchParams={searchParams} />
      </Suspense>
    </AuthCard>
  );
}
