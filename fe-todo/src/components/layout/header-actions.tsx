import { ButtonLink } from "@/components/ui/button-link";
import { ROUTES } from "@/constants";
import { hasActiveSession } from "@/lib/auth/session";
import { ProfileMenuLink } from "./profile-link";
import { ProgressNavLink } from "./progress-link";

/** Right side of the header: profile when signed in, Log in / Sign up otherwise. */
export async function HeaderActions() {
  const signedIn = await hasActiveSession();
  return signedIn ? (
    <div className="flex items-center gap-1 sm:gap-2">
      <ProgressNavLink />
      <ProfileMenuLink />
    </div>
  ) : (
    <div className="flex items-center gap-2">
      <ButtonLink href={ROUTES.login} variant="ghost" size="sm">
        Log in
      </ButtonLink>
      <ButtonLink href={ROUTES.register} size="sm">
        Sign up
      </ButtonLink>
    </div>
  );
}
