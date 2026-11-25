import "server-only";
import { redirect } from "next/navigation";
import { ROUTES } from "@/constants";
import { sessionExpiredPath } from "@/lib/auth/redirect";
import { getToken } from "@/lib/auth/session";
import { API_URL } from "./config";

export class ApiError extends Error {
  constructor(
    readonly status: number,
    message: string,
  ) {
    super(message);
  }
}

/**
 * Authenticated request to be-todo: attaches the session JWT as a Bearer token.
 * A 401 means the session is missing/expired/invalid: with a session cookie that is
 * "your session expired" (cookie cleared, toast shown); without one, plain login.
 */
export async function apiRequest(path: string, init?: RequestInit) {
  const token = await getToken();
  const res = await fetch(`${API_URL}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
      ...init?.headers,
    },
  });

  if (res.status === 401) redirect(token ? sessionExpiredPath() : ROUTES.login);
  if (!res.ok) {
    throw new ApiError(res.status, `be-todo ${init?.method ?? "GET"} ${path} failed (${res.status})`);
  }
  return res;
}
