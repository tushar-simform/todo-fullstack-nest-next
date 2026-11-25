import { Field } from "@/components/ui/field";
import { TextField } from "@/components/ui/text-field";
import { AUTH_CODE_LENGTH } from "@/constants";

type CodeFieldProps = { id: string; label: string; invalid?: boolean; autoFocus?: boolean; defaultValue?: string };

/** The one-time code from the email: numeric keypad on phones, autofill on iOS/Android. */
export function CodeField({ id, label, invalid, autoFocus, defaultValue }: CodeFieldProps) {
  return (
    <Field label={label} htmlFor={id}>
      <TextField
        id={id}
        name="code"
        inputMode="numeric"
        autoComplete="one-time-code"
        pattern={`\\d{${AUTH_CODE_LENGTH}}`}
        maxLength={AUTH_CODE_LENGTH}
        required
        autoFocus={autoFocus}
        defaultValue={defaultValue}
        placeholder={"0".repeat(AUTH_CODE_LENGTH)}
        aria-invalid={invalid}
        className="text-center font-mono text-xl tracking-[0.5em] sm:text-xl"
      />
    </Field>
  );
}
