import "server-only";
import { cache } from "react";
import { redirect } from "next/navigation";
import { connection } from "next/server";
import { API_PATHS, ROUTES } from "@/constants";
import { API_URL } from "@/lib/api/config";
import { isJwtExpired } from "@/lib/auth/jwt";
import { sessionExpiredPath } from "@/lib/auth/redirect";
import { getToken } from "@/lib/auth/session";
import type { AuthUser } from "./types";

/**
 * The signed-in user, verified by the API (not just "a cookie exists").
 * Memoized per request so layouts and pages can all call it cheaply.
 */
export const getCurrentUser = cache(async (): Promise<AuthUser | null> => {
  await connection(); // expiry check below depends on the current time
  const token = await getToken();
  if (!token || isJwtExpired(token)) return null;
  try {
    const res = await fetch(`${API_URL}${API_PATHS.me}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.ok ? ((await res.json()) as AuthUser) : null;
  } catch {
    return null;
  }
});

/**
 * For protected pages: returns the user or redirects to /login (with a
 * "session expired" toast when there was a session cookie that no longer works).
 */
export async function requireUser(): Promise<AuthUser> {
  const user = await getCurrentUser();
  if (!user) redirect((await getToken()) ? sessionExpiredPath() : ROUTES.login);
  return user;
}
