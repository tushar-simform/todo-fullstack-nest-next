/** httpOnly cookie holding the API's JWT (set by the Next.js server only). */
export const SESSION_COOKIE_NAME = "session";

/** Query param carrying where to go after login. */
export const LOGIN_NEXT_PARAM = "next";

/** Must match the API (be-todo PASSWORD_MIN_LENGTH). */
export const PASSWORD_MIN_LENGTH = 8;
export const PASSWORD_MAX_LENGTH = 128;

/** Query param carrying the email between the sign-up, verify and reset steps. */
export const EMAIL_PARAM = "email";

/** Must match the API (be-todo AUTH_CODE_LENGTH). */
export const AUTH_CODE_LENGTH = 6;
export const AUTH_CODE_PATTERN = new RegExp(`^\\d{${AUTH_CODE_LENGTH}}$`);

/** Error `code` the API puts in the 403 of login for an unverified account. */
export const EMAIL_NOT_VERIFIED_CODE = "EMAIL_NOT_VERIFIED";

export const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const LOGIN_FORM_COPY = {
  title: "Welcome back",
  subtitle: "Log in to see your todos.",
  submit: "Log in",
  back: "Back to home",
  forgotPassword: "Forgot password?",
  noAccount: "New here?",
  createAccount: "Create an account",
} as const;

export const REGISTER_FORM_COPY = {
  title: "Create your account",
  subtitle: "Sign up to start planning your day.",
  submit: "Create account",
  passwordHint: `At least ${PASSWORD_MIN_LENGTH} characters.`,
  confirmPassword: "Confirm password",
  haveAccount: "Already have an account?",
  logIn: "Log in",
} as const;

export const VERIFY_EMAIL_COPY = {
  title: "Check your email",
  subtitle: (email: string) => `We sent a ${AUTH_CODE_LENGTH}-digit code to ${email}. Enter it to finish creating your account.`,
  codeLabel: "Verification code",
  submit: "Verify email",
  resend: "Resend code",
  wrongEmail: "Wrong email? Start over",
} as const;

export const FORGOT_PASSWORD_COPY = {
  title: "Forgot your password?",
  subtitle: "Enter your email and we'll send you a code to reset it.",
  submit: "Send reset code",
  back: "Back to log in",
} as const;

export const RESET_PASSWORD_COPY = {
  title: "Choose a new password",
  subtitle: (email: string) => `Enter the code we sent to ${email} and your new password.`,
  codeLabel: "Reset code",
  newPassword: "New password",
  submit: "Reset password",
  noCode: "Wrong email? Start over",
} as const;

/** Seconds before "Resend code" can be used again (the API enforces the same cooldown). */
export const RESEND_COOLDOWN_SECONDS = 60;

export const RESEND_COPY = {
  idle: "Resend code",
  /** Shown while the cooldown runs, e.g. "Resend code in 42s". */
  waiting: (seconds: number) => `Resend code in ${seconds}s`,
  hint: "Didn't get the email? Check your spam folder, or resend it.",
} as const;
