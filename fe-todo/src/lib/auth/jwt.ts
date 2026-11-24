/**
 * Read a JWT's `exp` WITHOUT verifying the signature. Only for optimistic UI /
 * proxy checks; the API is the real authority and verifies every request.
 * Works in the Edge runtime (uses atob).
 */
export function getJwtExpiry(token: string): number | null {
  try {
    const payload = token.split(".")[1];
    const json = atob(payload.replace(/-/g, "+").replace(/_/g, "/"));
    const { exp } = JSON.parse(json) as { exp?: unknown };
    return typeof exp === "number" ? exp : null;
  } catch {
    return null;
  }
}

export function isJwtExpired(token: string, nowMs = Date.now()): boolean {
  const exp = getJwtExpiry(token);
  return exp === null || exp * 1000 <= nowMs;
}
