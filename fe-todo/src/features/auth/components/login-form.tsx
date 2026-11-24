"use client";

import { useActionState, useState } from "react";
import { Button } from "@/components/ui/button";
import { Field } from "@/components/ui/field";
import { IconButton } from "@/components/ui/icon-button";
import { EyeIcon, EyeOffIcon } from "@/components/ui/icons";
import { TextField } from "@/components/ui/text-field";
import { LOGIN_FORM_COPY } from "@/constants";
import { loginAction } from "../actions";

/** Email + password form. `next` is where to go after a successful login. */
export function LoginForm({ next }: { next?: string }) {
  const [state, formAction, pending] = useActionState(loginAction, undefined);
  const [showPassword, setShowPassword] = useState(false);

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
          aria-describedby={state?.error ? "login-error" : undefined}
        />
      </Field>

      <Field label="Password" htmlFor="login-password">
        <div className="relative">
          <TextField
            id="login-password"
            name="password"
            type={showPassword ? "text" : "password"}
            autoComplete="current-password"
            required
            className="pr-12"
            aria-invalid={Boolean(state?.error)}
          />
          <IconButton
            label={showPassword ? "Hide password" : "Show password"}
            onClick={() => setShowPassword((v) => !v)}
            className="absolute right-1 top-1/2 -translate-y-1/2"
          >
            {showPassword ? <EyeOffIcon /> : <EyeIcon />}
          </IconButton>
        </div>
      </Field>

      {state?.error && (
        <p
          id="login-error"
          role="alert"
          className="animate-pop rounded-xl border border-danger/30 bg-danger/10 px-4 py-2.5 text-sm text-danger"
        >
          {state.error}
        </p>
      )}

      <Button type="submit" loading={pending} className="mt-1 w-full">
        {LOGIN_FORM_COPY.submit}
      </Button>
    </form>
  );
}
