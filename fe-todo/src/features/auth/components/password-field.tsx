"use client";

import { useState } from "react";
import { Field } from "@/components/ui/field";
import { IconButton } from "@/components/ui/icon-button";
import { EyeIcon, EyeOffIcon } from "@/components/ui/icons";
import { TextField } from "@/components/ui/text-field";
import { PASSWORD_MAX_LENGTH } from "@/constants";

type PasswordFieldProps = {
  id: string;
  label: string;
  autoComplete: "current-password" | "new-password";
  name?: string;
  hint?: string;
  invalid?: boolean;
  /** Set on sign-up and reset forms to enforce the minimum length in the browser. */
  minLength?: number;
  autoFocus?: boolean;
};

/** Password input with a show/hide toggle. Each instance toggles on its own. */
export function PasswordField({ id, label, name = "password", hint, invalid, ...input }: PasswordFieldProps) {
  const [visible, setVisible] = useState(false);

  return (
    <Field label={label} htmlFor={id} hint={hint}>
      <div className="relative">
        <TextField
          id={id}
          name={name}
          type={visible ? "text" : "password"}
          required
          maxLength={PASSWORD_MAX_LENGTH}
          className="pr-12"
          aria-invalid={invalid}
          {...input}
        />
        <IconButton
          label={visible ? "Hide password" : "Show password"}
          onClick={() => setVisible((v) => !v)}
          className="absolute right-1 top-1/2 -translate-y-1/2"
        >
          {visible ? <EyeOffIcon /> : <EyeIcon />}
        </IconButton>
      </div>
    </Field>
  );
}
