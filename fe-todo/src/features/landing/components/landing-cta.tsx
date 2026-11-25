import { ArrowRightIcon } from "@/components/ui/icons";
import { ButtonLink } from "@/components/ui/button-link";
import { LANDING_COPY, ROUTES } from "@/constants";
import { hasActiveSession } from "@/lib/auth/session";

/** Primary call to action: "Create account" + "Log in", or "Open my todos" when signed in. */
export async function LandingCta() {
  const signedIn = await hasActiveSession();
  if (signedIn) {
    return (
      <ButtonLink href={ROUTES.today} className="w-full sm:w-auto">
        {LANDING_COPY.ctaLoggedIn}
        <ArrowRightIcon />
      </ButtonLink>
    );
  }
  return <LandingCtaFallback />;
}

/** Signed-out buttons; also the static fallback while the session cookie is read. */
export function LandingCtaFallback() {
  return (
    <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
      <ButtonLink href={ROUTES.register} className="w-full sm:w-auto">
        {LANDING_COPY.ctaLoggedOut}
        <ArrowRightIcon />
      </ButtonLink>
      <ButtonLink href={ROUTES.login} variant="secondary" className="w-full sm:w-auto">
        {LANDING_COPY.ctaLogIn}
      </ButtonLink>
    </div>
  );
}
