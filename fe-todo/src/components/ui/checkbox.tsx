import { cn } from "@/lib/cn";
import { CheckIcon } from "./icons";

type CheckboxProps = {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label: string;
  disabled?: boolean;
};

/** Round animated checkbox. `label` is the accessible name. */
export function Checkbox({ checked, onChange, label, disabled }: CheckboxProps) {
  return (
    <button
      type="button"
      role="checkbox"
      aria-checked={checked}
      aria-label={label}
      disabled={disabled}
      onClick={() => onChange(!checked)}
      className={cn(
        "grid size-6 shrink-0 place-items-center rounded-full border-2 transition-all duration-300",
        "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary active:scale-90",
        checked
          ? "border-transparent bg-gradient-to-br from-primary to-accent text-white"
          : "border-border hover:border-primary",
      )}
    >
      <CheckIcon
        strokeWidth={3}
        className={cn(
          "size-3.5 transition-all duration-300",
          checked ? "scale-100 opacity-100" : "scale-0 opacity-0",
        )}
      />
    </button>
  );
}
