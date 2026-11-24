import "server-only";
import { redirect } from "next/navigation";
import { ROUTES } from "@/constants";
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
 * A 401 means the session is missing/expired/invalid, so send the user to login.
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

  if (res.status === 401) redirect(ROUTES.login);
  if (!res.ok) {
    throw new ApiError(res.status, `be-todo ${init?.method ?? "GET"} ${path} failed (${res.status})`);
  }
  return res;
}
