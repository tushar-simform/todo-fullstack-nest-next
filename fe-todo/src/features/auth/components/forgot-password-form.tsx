"use client";

import { useActionState } from "react";
import { Button } from "@/components/ui/button";
import { Field } from "@/components/ui/field";
import { FormMessage } from "@/components/ui/form-message";
import { TextField } from "@/components/ui/text-field";
import { FORGOT_PASSWORD_COPY } from "@/constants";
import { forgotPasswordAction } from "../actions";

export function ForgotPasswordForm() {
  const [state, formAction, pending] = useActionState(forgotPasswordAction, undefined);

  return (
    <form action={formAction} className="flex flex-col gap-4">
      <Field label="Email" htmlFor="forgot-email">
        <TextField
          id="forgot-email"
          name="email"
          type="email"
          inputMode="email"
          autoComplete="username"
          autoFocus
          required
          defaultValue={state?.email}
          placeholder="you@example.com"
          aria-invalid={Boolean(state?.error)}
        />
      </Field>
      {state?.error && <FormMessage>{state.error}</FormMessage>}
      <Button type="submit" loading={pending} className="w-full">
        {FORGOT_PASSWORD_COPY.submit}
      </Button>
    </form>
  );
}
