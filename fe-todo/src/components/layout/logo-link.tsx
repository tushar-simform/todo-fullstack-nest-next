import Link from "next/link";
import { HEADER_COPY, ROUTES } from "@/constants";
import { hasActiveSession } from "@/lib/auth/session";
import { Logo } from "./logo";

const linkClasses = "rounded-lg focus-visible:outline-2 focus-visible:outline-primary";

/** The logo as a link to `href`. Also the static fallback while the session cookie is read. */
export function LogoLinkFallback() {
  return (
    <Link href={ROUTES.home} aria-label={HEADER_COPY.homeLabel} className={linkClasses}>
      <Logo />
    </Link>
  );
}

/** Signed-in users go to their todos; visitors go to the public landing page. */
export async function LogoLink() {
  const signedIn = await hasActiveSession();
  return (
    <Link
      href={signedIn ? ROUTES.today : ROUTES.home}
      aria-label={signedIn ? HEADER_COPY.todosLabel : HEADER_COPY.homeLabel}
      className={linkClasses}
    >
      <Logo />
    </Link>
  );
}
