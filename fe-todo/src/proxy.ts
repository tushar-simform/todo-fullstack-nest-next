import { NextResponse, type NextRequest } from "next/server";
import { LOGIN_NEXT_PARAM, PUBLIC_ROUTES, ROUTES, SESSION_COOKIE_NAME } from "@/constants";
import { isJwtExpired } from "@/lib/auth/jwt";
import { sessionExpiredPath } from "@/lib/auth/redirect";

/**
 * Optimistic auth gate: anything that is not a public route needs an unexpired
 * session cookie. This only reads the cookie (no network); the API still
 * verifies the token on every data request, so this is UX, not the security boundary.
 */
export function proxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl;
  if (PUBLIC_ROUTES.includes(pathname)) return NextResponse.next();

  const token = request.cookies.get(SESSION_COOKIE_NAME)?.value;
  if (token && !isJwtExpired(token)) return NextResponse.next();

  // A cookie that has run out means the session expired: say so (the route clears the cookie).
  if (token) return NextResponse.redirect(new URL(sessionExpiredPath(`${pathname}${search}`), request.url));

  const login = new URL(ROUTES.login, request.url);
  login.searchParams.set(LOGIN_NEXT_PARAM, `${pathname}${search}`);
  return NextResponse.redirect(login);
}

export const config = {
  // Skip Next internals and static files (anything with a file extension).
  matcher: ["/((?!api|_next/static|_next/image|.*\\..*).*)"],
};
