export const ROUTES = {
  home: "/",
  login: "/login",
  register: "/register",
  verifyEmail: "/verify-email",
  forgotPassword: "/forgot-password",
  resetPassword: "/reset-password",
  about: "/about",
  today: "/today",
  all: "/all",
  due: "/due",
  upcoming: "/upcoming",
  done: "/done",
  progress: "/progress",
  settings: "/settings",
} as const;

/** be-todo API paths (relative to API_URL). */
export const API_PATHS = {
  login: "/auth/login",
  register: "/auth/register",
  verifyEmail: "/auth/verify-email",
  resendVerification: "/auth/resend-verification",
  forgotPassword: "/auth/forgot-password",
  resetPassword: "/auth/reset-password",
  me: "/auth/me",
  todos: "/todos",
  todo: (id: string) => `/todos/${encodeURIComponent(id)}`,
  completion: (id: string, date: string) => `/todos/${encodeURIComponent(id)}/completions/${encodeURIComponent(date)}`,
} as const;

/** Reachable without signing in. Everything else is protected by `proxy.ts`. */
export const PUBLIC_ROUTES: string[] = [
  ROUTES.home,
  ROUTES.login,
  ROUTES.register,
  ROUTES.verifyEmail,
  ROUTES.forgotPassword,
  ROUTES.resetPassword,
  ROUTES.about,
];
