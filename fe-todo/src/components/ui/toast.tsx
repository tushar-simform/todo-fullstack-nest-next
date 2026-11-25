import { cn } from "@/lib/cn";
import type { ToastTone } from "@/constants";
import { IconButton } from "./icon-button";
import { AlertIcon, CheckIcon, XIcon } from "./icons";

const TONE_STYLES: Record<ToastTone, string> = {
  success: "bg-success/15 text-success",
  error: "bg-danger/15 text-danger",
  warning: "bg-warning/15 text-warning",
};

type ToastProps = { message: string; tone: ToastTone; onDismiss: () => void };

/** One notification card. Placement and timing belong to `ToastProvider`. */
export function Toast({ message, tone, onDismiss }: ToastProps) {
  const success = tone === "success";
  return (
    <div
      role={tone === "error" ? "alert" : "status"}
      className="animate-fade-up pointer-events-auto flex w-full max-w-sm items-center gap-3 rounded-2xl border border-border bg-surface p-3 pr-2 shadow-card"
    >
      <span
        className={cn(
          "grid size-8 shrink-0 place-items-center rounded-full text-base",
          TONE_STYLES[tone],
        )}
      >
        {success ? <CheckIcon /> : <AlertIcon />}
      </span>
      <p className="min-w-0 flex-1 break-words text-sm font-medium">{message}</p>
      <IconButton label="Dismiss" onClick={onDismiss}>
        <XIcon />
      </IconButton>
    </div>
  );
}
