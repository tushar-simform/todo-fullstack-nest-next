import { ROUTES } from "@/constants";

/** Only allow same-site relative paths (blocks open redirects like //evil.com). */
export function safeRedirectPath(path: string | null | undefined): string | null {
  if (!path || !path.startsWith("/") || path.startsWith("//") || path.startsWith("/\\")) {
    return null;
  }
  return path === ROUTES.login ? null : path;
}
