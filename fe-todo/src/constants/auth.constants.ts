/** httpOnly cookie holding the API's JWT (set by the Next.js server only). */
export const SESSION_COOKIE_NAME = "session";

/** Query param carrying where to go after login. */
export const LOGIN_NEXT_PARAM = "next";

export const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const LOGIN_FORM_COPY = {
  title: "Welcome back",
  subtitle: "Log in to see your todos.",
  submit: "Log in",
  back: "Back to home",
} as const;
