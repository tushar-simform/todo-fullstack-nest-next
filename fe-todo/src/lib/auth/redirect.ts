import { LOGIN_NEXT_PARAM, ROUTES, TOAST_KEYS, TOAST_PARAM } from "@/constants";

/** Only allow same-site relative paths (blocks open redirects like //evil.com). */
export function safeRedirectPath(path: string | null | undefined): string | null {
  if (!path || !path.startsWith("/") || path.startsWith("//") || path.startsWith("/\\")) {
    return null;
  }
  return path === ROUTES.login ? null : path;
}

/** `path` plus query params; empty/undefined values are skipped, existing query is kept. */
export function withParams(path: string, params: Record<string, string | null | undefined>): string {
  const url = new URL(path, "http://local");
  for (const [key, value] of Object.entries(params)) {
    if (value) url.searchParams.set(key, value);
  }
  return `${url.pathname}${url.search}`;
}

/** First value of a Next.js `searchParams` entry. */
export function firstParam(value: string | string[] | undefined): string | undefined {
  return Array.isArray(value) ? value[0] : value;
}

/**
 * Where to send someone whose session is gone (expired, or rejected by the API):
 * the login page with a "session expired" toast. The login page also clears the
 * dead cookie (pages can't delete cookies while rendering).
 */
export function sessionExpiredPath(next?: string | null): string {
  return withParams(ROUTES.login, {
    [TOAST_PARAM]: TOAST_KEYS.sessionExpired,
    [LOGIN_NEXT_PARAM]: safeRedirectPath(next),
  });
}
