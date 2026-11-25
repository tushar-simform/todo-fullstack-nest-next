"use client";

import { useActionState } from "react";
import { Button } from "@/components/ui/button";
import { FormMessage } from "@/components/ui/form-message";
import { VERIFY_EMAIL_COPY } from "@/constants";
import { resendCodeAction, verifyEmailAction } from "../actions";
import { CodeField } from "./code-field";
import { ResendCode } from "./resend-code";

/** Enter the emailed code; below it, a separate form asks for a new one. */
export function VerifyEmailForm({ email, next }: { email: string; next?: string }) {
  const [state, formAction, pending] = useActionState(verifyEmailAction, undefined);

  return (
    <div className="flex flex-col gap-6">
      <form action={formAction} className="flex flex-col gap-4">
        <input type="hidden" name="email" value={email} />
        <input type="hidden" name="next" value={next ?? ""} />
        <CodeField id="verify-code" label={VERIFY_EMAIL_COPY.codeLabel} invalid={Boolean(state?.error)} autoFocus />
        {state?.error && <FormMessage>{state.error}</FormMessage>}
        <Button type="submit" loading={pending} className="w-full">
          {VERIFY_EMAIL_COPY.submit}
        </Button>
      </form>

      <ResendCode email={email} action={resendCodeAction} storageKey={`resend:verify:${email}`} />
    </div>
  );
}
