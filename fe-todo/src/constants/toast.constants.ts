/** Query param that asks the next page to show a toast (`?toast=<key>`). */
export const TOAST_PARAM = "toast";

export const TOAST_DURATION_MS = 5000;

export const TOAST_KEYS = {
  accountCreated: "account-created",
  passwordReset: "password-reset",
  sessionExpired: "session-expired",
} as const;

export type ToastTone = "success" | "error" | "warning";

/**
 * Only these messages can be shown via the URL, so a crafted link can't put
 * arbitrary text in front of the user.
 */
export const URL_TOASTS: Record<string, { message: string; tone: ToastTone }> = {
  [TOAST_KEYS.accountCreated]: {
    message: "Account created! Welcome aboard.",
    tone: "success",
  },
  [TOAST_KEYS.passwordReset]: {
    message: "Password updated. Log in with your new password.",
    tone: "success",
  },
  [TOAST_KEYS.sessionExpired]: {
    message: "Your session has expired. Please log in again.",
    tone: "warning",
  },
};
