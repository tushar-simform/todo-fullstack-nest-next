import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { LOGIN_NEXT_PARAM, REGISTER_FORM_COPY, ROUTES } from "@/constants";
import { AuthCard } from "@/features/auth/components/auth-card";
import { RegisterForm } from "@/features/auth/components/register-form";
import { getCurrentUser } from "@/features/auth/dal";
import { firstParam, safeRedirectPath } from "@/lib/auth/redirect";

export const metadata: Metadata = { title: "Create account" };

/** Reads the session + `?next=`, so it must stream inside <Suspense>. */
async function RegisterContent({ searchParams }: { searchParams: Promise<{ [key: string]: string | string[] | undefined }> }) {
  const params = await searchParams;
  const next = safeRedirectPath(firstParam(params[LOGIN_NEXT_PARAM])) ?? undefined;

  // Already signed in (verified by the API)? No need to sign up again.
  if (await getCurrentUser()) redirect(next ?? ROUTES.today);

  return <RegisterForm next={next} />;
}

export default function RegisterPage({ searchParams }: PageProps<"/register">) {
  return (
    <AuthCard
      title={REGISTER_FORM_COPY.title}
      subtitle={REGISTER_FORM_COPY.subtitle}
      footer={
        <p>
          {REGISTER_FORM_COPY.haveAccount}{" "}
          <Link href={ROUTES.login} className="font-medium text-foreground underline-offset-4 hover:underline">
            {REGISTER_FORM_COPY.logIn}
          </Link>
        </p>
      }
    >
      <Suspense fallback={<Skeleton className="h-96" />}>
        <RegisterContent searchParams={searchParams} />
      </Suspense>
    </AuthCard>
  );
}
