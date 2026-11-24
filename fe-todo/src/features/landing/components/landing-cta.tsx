import { ArrowRightIcon } from "@/components/ui/icons";
import { ButtonLink } from "@/components/ui/button-link";
import { LANDING_COPY, ROUTES } from "@/constants";
import { hasActiveSession } from "@/lib/auth/session";

/** Primary call to action: "Log in", or "Open my todos" when already signed in. */
export async function LandingCta() {
  const signedIn = await hasActiveSession();
  return (
    <ButtonLink href={signedIn ? ROUTES.today : ROUTES.login} className="w-full sm:w-auto">
      {signedIn ? LANDING_COPY.ctaLoggedIn : LANDING_COPY.ctaLoggedOut}
      <ArrowRightIcon />
    </ButtonLink>
  );
}

/** Static fallback while the session cookie is read. */
export function LandingCtaFallback() {
  return (
    <ButtonLink href={ROUTES.login} className="w-full sm:w-auto">
      {LANDING_COPY.ctaLoggedOut}
      <ArrowRightIcon />
    </ButtonLink>
  );
}
