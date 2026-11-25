import type { Metadata } from "next";
import Link from "next/link";
import { FORGOT_PASSWORD_COPY, ROUTES } from "@/constants";
import { AuthCard } from "@/features/auth/components/auth-card";
import { ForgotPasswordForm } from "@/features/auth/components/forgot-password-form";

export const metadata: Metadata = { title: "Forgot password" };

export default function ForgotPasswordPage() {
  return (
    <AuthCard
      title={FORGOT_PASSWORD_COPY.title}
      subtitle={FORGOT_PASSWORD_COPY.subtitle}
      footer={
        <p>
          <Link href={ROUTES.login} className="underline-offset-4 hover:text-foreground hover:underline">
            {FORGOT_PASSWORD_COPY.back}
          </Link>
        </p>
      }
    >
      <ForgotPasswordForm />
    </AuthCard>
  );
}
