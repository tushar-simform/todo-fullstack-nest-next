"use server";

import { redirect } from "next/navigation";
import {
  API_PATHS,
  AUTH_CODE_PATTERN,
  EMAIL_NOT_VERIFIED_CODE,
  EMAIL_PARAM,
  EMAIL_PATTERN,
  LOGIN_NEXT_PARAM,
  MESSAGES,
  PASSWORD_MAX_LENGTH,
  PASSWORD_MIN_LENGTH,
  RESEND_COOLDOWN_SECONDS,
  ROUTES,
  TOAST_KEYS,
  TOAST_PARAM,
} from "@/constants";
import { API_URL } from "@/lib/api/config";
import { formatWait } from "@/lib/duration";
import { safeRedirectPath, withParams } from "@/lib/auth/redirect";
import { createSession, deleteSession } from "@/lib/auth/session";
import type { AuthFormState } from "./types";

/** `retryAfter`: seconds to wait, from the API's `Retry-After` header on a 429. */
type ApiResult = { status: number | null; body: Record<string, unknown>; retryAfter: number | null };
type Session = { accessToken: string; expiresIn: number };

/** POST JSON to the be-todo API. `status: null` means it couldn't be reached. */
async function post(path: string, payload: Record<string, string>): Promise<ApiResult> {
  try {
    const res = await fetch(`${API_URL}${path}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const body = res.headers.get("content-type")?.includes("json")
      ? ((await res.json()) as Record<string, unknown>)
      : {};
    return { status: res.status, body, retryAfter: retryAfterSeconds(res.headers) };
  } catch {
    return { status: null, body: {}, retryAfter: null };
  }
}

/**
 * Seconds until the API allows another try. A blocked request carries
 * `Retry-After` (the hourly cap) and/or `Retry-After-cooldown` (the gap between emails):
 * the longer one is the real wait.
 */
function retryAfterSeconds(headers: Headers): number | null {
  const waits = ["retry-after", "retry-after-cooldown"]
    .map((name) => Number(headers.get(name)))
    .filter((n) => Number.isFinite(n) && n > 0);
  return waits.length ? Math.max(...waits) : null;
}

const field = (formData: FormData, name: string) => String(formData.get(name) ?? "");
const nextPath = (formData: FormData) => safeRedirectPath(field(formData, LOGIN_NEXT_PARAM));

/** Errors every auth endpoint can return; a 429 says how long to wait when the API told us. */
function commonError(status: number | null, retryAfter: number | null = null): string {
  if (status !== 429) return MESSAGES.genericError;
  return retryAfter ? MESSAGES.rateLimited(formatWait(retryAfter)) : MESSAGES.tooManyAttempts;
}

/** Why a new password isn't acceptable, or null. */
function passwordProblem(password: string, confirm: string): string | null {
  if (password.length < PASSWORD_MIN_LENGTH) return MESSAGES.passwordTooShort;
  if (password.length > PASSWORD_MAX_LENGTH) return MESSAGES.passwordTooLong;
  if (password !== confirm) return MESSAGES.passwordsDoNotMatch;
  return null;
}

/** The "enter your code" page for `email`. */
const verifyPage = (email: string, next: string | null) =>
  withParams(ROUTES.verifyEmail, { [EMAIL_PARAM]: email, [LOGIN_NEXT_PARAM]: next });

/** Log in with email + password; stores the API's JWT in an httpOnly cookie. */
export async function loginAction(_prev: AuthFormState, formData: FormData): Promise<AuthFormState> {
  const email = field(formData, "email").trim();
  const password = field(formData, "password");
  const next = nextPath(formData);

  if (!EMAIL_PATTERN.test(email) || !password) {
    return { error: MESSAGES.loginFieldsInvalid, email };
  }

  const { status, body, retryAfter } = await post(API_PATHS.login, { email, password });
  // Right password, but the email was never verified: the API just sent a new code.
  if (status === 403 && body.code === EMAIL_NOT_VERIFIED_CODE) redirect(verifyPage(email, next));
  if (status === 401) return { error: MESSAGES.invalidCredentials, email };
  if (status !== 200) return { error: commonError(status, retryAfter), email };

  const { accessToken, expiresIn } = body as Session;
  await createSession(accessToken, expiresIn);
  redirect(next ?? ROUTES.today);
}

/** Create an account (unverified), then continue to the email-code step. */
export async function registerAction(_prev: AuthFormState, formData: FormData): Promise<AuthFormState> {
  const email = field(formData, "email").trim();
  const password = field(formData, "password");
  const next = nextPath(formData);

  if (!EMAIL_PATTERN.test(email)) return { error: MESSAGES.registerEmailInvalid, email };
  const problem = passwordProblem(password, field(formData, "confirmPassword"));
  if (problem) return { error: problem, email };

  const { status, retryAfter } = await post(API_PATHS.register, { email, password });
  if (status === 409) return { error: MESSAGES.emailTaken, email };
  if (status !== 201) return { error: commonError(status, retryAfter), email };

  redirect(verifyPage(email, next));
}

/** Check the emailed code; on success the account is verified and signed in. */
export async function verifyEmailAction(_prev: AuthFormState, formData: FormData): Promise<AuthFormState> {
  const email = field(formData, "email");
  const code = field(formData, "code").trim();
  const next = nextPath(formData);

  if (!AUTH_CODE_PATTERN.test(code)) return { error: MESSAGES.codeInvalidFormat, email };

  const { status, body, retryAfter } = await post(API_PATHS.verifyEmail, { email, code });
  if (status === 400) return { error: MESSAGES.invalidCode, email };
  if (status !== 200) return { error: commonError(status, retryAfter), email };

  const { accessToken, expiresIn } = body as Session;
  await createSession(accessToken, expiresIn);
  redirect(withParams(next ?? ROUTES.today, { [TOAST_PARAM]: TOAST_KEYS.accountCreated }));
}

/** Ask the API to email a fresh code. On success (or a 429) the result carries the cooldown for the resend button. */
async function resendCode(path: string, email: string): Promise<AuthFormState> {
  const { status, retryAfter } = await post(path, { email });
  if (status === 204) return { notice: MESSAGES.codeResent, retryAfter: RESEND_COOLDOWN_SECONDS };
  return { error: commonError(status, retryAfter), retryAfter: retryAfter ?? undefined };
}

/** Ask for another verification code. */
export async function resendCodeAction(_prev: AuthFormState, formData: FormData): Promise<AuthFormState> {
  return resendCode(API_PATHS.resendVerification, field(formData, "email"));
}

/** Ask for another password-reset code (same API route as "Forgot password"). */
export async function resendResetCodeAction(_prev: AuthFormState, formData: FormData): Promise<AuthFormState> {
  return resendCode(API_PATHS.forgotPassword, field(formData, "email"));
}

/** Email a reset code, then continue to the reset page. Same outcome for unknown emails. */
export async function forgotPasswordAction(_prev: AuthFormState, formData: FormData): Promise<AuthFormState> {
  const email = field(formData, "email").trim();
  if (!EMAIL_PATTERN.test(email)) return { error: MESSAGES.registerEmailInvalid, email };

  const { status, retryAfter } = await post(API_PATHS.forgotPassword, { email });
  if (status !== 204) return { error: commonError(status, retryAfter), email };

  redirect(withParams(ROUTES.resetPassword, { [EMAIL_PARAM]: email }));
}

/** Set a new password with the emailed code, then send the user to log in. */
export async function resetPasswordAction(_prev: AuthFormState, formData: FormData): Promise<AuthFormState> {
  const email = field(formData, "email");
  const code = field(formData, "code").trim();
  const password = field(formData, "password");

  if (!AUTH_CODE_PATTERN.test(code)) return { error: MESSAGES.codeInvalidFormat, email };
  const problem = passwordProblem(password, field(formData, "confirmPassword"));
  if (problem) return { error: problem, email, code };

  const { status, retryAfter } = await post(API_PATHS.resetPassword, { email, code, password });
  if (status === 400) return { error: MESSAGES.invalidCode, email };
  if (status !== 204) return { error: commonError(status, retryAfter), email };

  redirect(withParams(ROUTES.login, { [TOAST_PARAM]: TOAST_KEYS.passwordReset }));
}

/**
 * Drops a session cookie the login page found to be dead (see ClearDeadSession).
 * Only ever rendered after the API rejected the session, so this can't log out a valid one.
 */
export async function clearDeadSessionAction() {
  await deleteSession();
}

export async function logoutAction() {
  await deleteSession();
  redirect(ROUTES.home);
}
