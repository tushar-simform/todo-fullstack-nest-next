"use server";

import { redirect } from "next/navigation";
import { API_PATHS, EMAIL_PATTERN, MESSAGES, ROUTES } from "@/constants";
import { API_URL } from "@/lib/api/config";
import { safeRedirectPath } from "@/lib/auth/redirect";
import { createSession, deleteSession } from "@/lib/auth/session";
import type { LoginState } from "./types";

type LoginResponse = { accessToken: string; expiresIn: number };

/** Log in with email + password; stores the API's JWT in an httpOnly cookie. */
export async function loginAction(_prev: LoginState, formData: FormData): Promise<LoginState> {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const next = safeRedirectPath(String(formData.get("next") ?? ""));

  if (!EMAIL_PATTERN.test(email) || !password) {
    return { error: MESSAGES.loginFieldsInvalid, email };
  }

  let res: Response;
  try {
    res = await fetch(`${API_URL}${API_PATHS.login}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
  } catch {
    return { error: MESSAGES.genericError, email };
  }

  if (res.status === 401) return { error: MESSAGES.invalidCredentials, email };
  if (res.status === 429) return { error: MESSAGES.tooManyAttempts, email };
  if (!res.ok) return { error: MESSAGES.genericError, email };

  const { accessToken, expiresIn } = (await res.json()) as LoginResponse;
  await createSession(accessToken, expiresIn);
  redirect(next ?? ROUTES.today);
}

export async function logoutAction() {
  await deleteSession();
  redirect(ROUTES.home);
}
