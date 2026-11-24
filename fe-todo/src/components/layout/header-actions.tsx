import { ButtonLink } from "@/components/ui/button-link";
import { ROUTES } from "@/constants";
import { hasActiveSession } from "@/lib/auth/session";
import { ProfileMenuLink } from "./profile-link";

/** Right side of the header: profile when signed in, a Log in button otherwise. */
export async function HeaderActions() {
  const signedIn = await hasActiveSession();
  return signedIn ? (
    <ProfileMenuLink />
  ) : (
    <ButtonLink href={ROUTES.login} size="sm">
      Log in
    </ButtonLink>
  );
}
