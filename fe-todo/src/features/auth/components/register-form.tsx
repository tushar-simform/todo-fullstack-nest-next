"use client";

import { useActionState } from "react";
import { Button } from "@/components/ui/button";
import { Field } from "@/components/ui/field";
import { FormMessage } from "@/components/ui/form-message";
import { TextField } from "@/components/ui/text-field";
import { PASSWORD_MIN_LENGTH, REGISTER_FORM_COPY } from "@/constants";
import { registerAction } from "../actions";
import { PasswordField } from "./password-field";

/** Sign-up form (email, password twice). `next` is where to go once the account is verified. */
export function RegisterForm({ next }: { next?: string }) {
  const [state, formAction, pending] = useActionState(registerAction, undefined);
  const invalid = Boolean(state?.error);

  return (
    <form action={formAction} className="flex flex-col gap-4">
      <input type="hidden" name="next" value={next ?? ""} />

      <Field label="Email" htmlFor="register-email">
        <TextField
          id="register-email"
          name="email"
          type="email"
          inputMode="email"
          autoComplete="username"
          autoFocus
          required
          defaultValue={state?.email}
          placeholder="you@example.com"
          aria-invalid={invalid}
        />
      </Field>

      <PasswordField
        id="register-password"
        label="Password"
        autoComplete="new-password"
        minLength={PASSWORD_MIN_LENGTH}
        hint={REGISTER_FORM_COPY.passwordHint}
        invalid={invalid}
      />
      <PasswordField
        id="register-confirm-password"
        name="confirmPassword"
        label={REGISTER_FORM_COPY.confirmPassword}
        autoComplete="new-password"
        minLength={PASSWORD_MIN_LENGTH}
        invalid={invalid}
      />

      {state?.error && <FormMessage>{state.error}</FormMessage>}

      <Button type="submit" loading={pending} className="mt-1 w-full">
        {REGISTER_FORM_COPY.submit}
      </Button>
    </form>
  );
}
