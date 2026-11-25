"use client";

import Link from "next/link";
import { useActionState } from "react";
import { Button } from "@/components/ui/button";
import { Field } from "@/components/ui/field";
import { FormMessage } from "@/components/ui/form-message";
import { TextField } from "@/components/ui/text-field";
import { LOGIN_FORM_COPY, ROUTES } from "@/constants";
import { loginAction } from "../actions";
import { PasswordField } from "./password-field";

/** Email + password form. `next` is where to go after a successful login. */
export function LoginForm({ next }: { next?: string }) {
  const [state, formAction, pending] = useActionState(loginAction, undefined);

  return (
    <form action={formAction} className="flex flex-col gap-4">
      <input type="hidden" name="next" value={next ?? ""} />

      <Field label="Email" htmlFor="login-email">
        <TextField
          id="login-email"
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

      <div className="flex flex-col gap-2">
        <PasswordField
          id="login-password"
          label="Password"
          autoComplete="current-password"
          invalid={Boolean(state?.error)}
        />
        <Link
          href={ROUTES.forgotPassword}
          className="self-end text-sm text-muted underline-offset-4 hover:text-foreground hover:underline"
        >
          {LOGIN_FORM_COPY.forgotPassword}
        </Link>
      </div>

      {state?.error && <FormMessage>{state.error}</FormMessage>}

      <Button type="submit" loading={pending} className="mt-1 w-full">
        {LOGIN_FORM_COPY.submit}
      </Button>
    </form>
  );
}
