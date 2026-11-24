import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { LOGIN_FORM_COPY, LOGIN_NEXT_PARAM, ROUTES } from "@/constants";
import { LoginForm } from "@/features/auth/components/login-form";
import { getCurrentUser } from "@/features/auth/dal";
import { safeRedirectPath } from "@/lib/auth/redirect";

export const metadata: Metadata = { title: "Log in" };

/** Reads the session + `?next=`, so it must stream inside <Suspense>. */
async function LoginContent({ searchParams }: { searchParams: Promise<{ [key: string]: string | string[] | undefined }> }) {
  const params = await searchParams;
  const raw = params[LOGIN_NEXT_PARAM];
  const next = safeRedirectPath(Array.isArray(raw) ? raw[0] : raw) ?? undefined;

  // Already signed in (verified by the API)? Skip the form.
  if (await getCurrentUser()) redirect(next ?? ROUTES.today);

  return <LoginForm next={next} />;
}

export default function LoginPage({ searchParams }: PageProps<"/login">) {
  return (
    <div className="mx-auto w-full max-w-md py-10 sm:py-16">
      <Card className="animate-fade-up p-6 sm:p-8">
        <h1 className="text-2xl font-bold tracking-tight">{LOGIN_FORM_COPY.title}</h1>
        <p className="mb-6 mt-1.5 text-sm text-muted">{LOGIN_FORM_COPY.subtitle}</p>
        <Suspense fallback={<Skeleton className="h-64" />}>
          <LoginContent searchParams={searchParams} />
        </Suspense>
      </Card>
      <p className="mt-6 text-center text-sm text-muted">
        <Link href={ROUTES.home} className="underline-offset-4 hover:text-foreground hover:underline">
          {LOGIN_FORM_COPY.back}
        </Link>
      </p>
    </div>
  );
}
