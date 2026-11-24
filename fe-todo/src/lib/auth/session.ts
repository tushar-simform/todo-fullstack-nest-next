import "server-only";
import { cookies } from "next/headers";
import { connection } from "next/server";
import { SESSION_COOKIE_NAME } from "@/constants";
import { isJwtExpired } from "./jwt";

/** Store the API's JWT in an httpOnly cookie: page scripts can never read it. */
export async function createSession(token: string, maxAgeSeconds: number) {
  (await cookies()).set(SESSION_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: maxAgeSeconds, // survives reloads and browser restarts until it expires
  });
}

export async function deleteSession() {
  (await cookies()).delete(SESSION_COOKIE_NAME);
}

export async function getToken(): Promise<string | null> {
  return (await cookies()).get(SESSION_COOKIE_NAME)?.value ?? null;
}

/** Cheap check (cookie present, not expired). Not proof of a valid login. */
export async function hasActiveSession(): Promise<boolean> {
  // Expiry depends on the current time, so opt into request-time rendering.
  await connection();
  const token = await getToken();
  return token !== null && !isJwtExpired(token);
}
