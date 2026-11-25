"use client";

import { useActionState } from "react";
import { Button } from "@/components/ui/button";
import { FormMessage } from "@/components/ui/form-message";
import {
  PASSWORD_MIN_LENGTH,
  REGISTER_FORM_COPY,
  RESET_PASSWORD_COPY,
} from "@/constants";
import { resendResetCodeAction, resetPasswordAction } from "../actions";
import { CodeField } from "./code-field";
import { PasswordField } from "./password-field";
import { ResendCode } from "./resend-code";

/** Reset code + new password (twice). */
export function ResetPasswordForm({ email }: { email: string }) {
  const [state, formAction, pending] = useActionState(
    resetPasswordAction,
    undefined,
  );
  const invalid = Boolean(state?.error);

  return (
    <div className="flex flex-col gap-6">
      <form action={formAction} className="flex flex-col gap-4">
        <input type="hidden" name="email" value={email} />
        <CodeField
          id="reset-code"
          label={RESET_PASSWORD_COPY.codeLabel}
          defaultValue={state?.code}
          invalid={invalid}
          autoFocus
        />
        <PasswordField
          id="reset-password"
          label={RESET_PASSWORD_COPY.newPassword}
          autoComplete="new-password"
          minLength={PASSWORD_MIN_LENGTH}
          hint={REGISTER_FORM_COPY.passwordHint}
          invalid={invalid}
        />
        <PasswordField
          id="reset-confirm-password"
          name="confirmPassword"
          label={REGISTER_FORM_COPY.confirmPassword}
          autoComplete="new-password"
          minLength={PASSWORD_MIN_LENGTH}
          invalid={invalid}
        />
        {state?.error && <FormMessage>{state.error}</FormMessage>}
        <Button type="submit" loading={pending} className="w-full">
          {RESET_PASSWORD_COPY.submit}
        </Button>
      </form>

      <ResendCode
        email={email}
        action={resendResetCodeAction}
        storageKey={`resend:reset:${email}`}
      />
    </div>
  );
}
