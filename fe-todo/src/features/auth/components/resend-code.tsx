"use client";

import { useActionState } from "react";
import { Button } from "@/components/ui/button";
import { FormMessage } from "@/components/ui/form-message";
import { RESEND_COPY } from "@/constants";
import type { AuthFormState } from "../types";
import { useCooldown } from "../use-cooldown";

type ResendCodeProps = {
  email: string;
  /** Server Action that asks the API to email a new code. */
  action: (prev: AuthFormState, formData: FormData) => Promise<AuthFormState>;
  /** sessionStorage key: keeps the countdown running across a page reload. */
  storageKey: string;
};

/**
 * "Resend code" button with a countdown. A code was just emailed when this page
 * opened, so the button starts disabled for the cooldown; the API enforces the
 * same limit and says how long to wait when it is hit anyway.
 */
export function ResendCode({ email, action, storageKey }: ResendCodeProps) {
  const [secondsLeft, startCooldown] = useCooldown(storageKey);

  const [state, formAction, pending] = useActionState(async (prev: AuthFormState, formData: FormData) => {
    const result = await action(prev, formData);
    if (result?.retryAfter) startCooldown(result.retryAfter);
    return result;
  }, undefined);

  return (
    <form action={formAction} className="flex flex-col gap-3">
      <input type="hidden" name="email" value={email} />
      <p className="text-center text-sm text-muted">{RESEND_COPY.hint}</p>
      {state?.notice && <FormMessage tone="success">{state.notice}</FormMessage>}
      {state?.error && <FormMessage>{state.error}</FormMessage>}
      <Button type="submit" variant="secondary" loading={pending} disabled={secondsLeft > 0} className="w-full">
        {secondsLeft > 0 ? RESEND_COPY.waiting(secondsLeft) : RESEND_COPY.idle}
      </Button>
    </form>
  );
}
