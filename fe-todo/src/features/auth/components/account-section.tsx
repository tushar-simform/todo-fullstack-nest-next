import { Button } from "@/components/ui/button";
import { LogOutIcon, UserIcon } from "@/components/ui/icons";
import { Card } from "@/components/ui/card";
import { logoutAction } from "../actions";
import { requireUser } from "../dal";

/** Signed-in account card with a Log out button. Redirects to /login if not signed in. */
export async function AccountSection() {
  const user = await requireUser();

  return (
    <Card className="animate-fade-up mb-4 flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex min-w-0 items-center gap-4">
        <span className="grid size-14 shrink-0 place-items-center rounded-full bg-gradient-to-br from-primary to-accent text-2xl text-white">
          <UserIcon />
        </span>
        <div className="min-w-0">
          <p className="text-sm text-muted">Signed in as</p>
          <p className="truncate font-semibold">{user.email}</p>
        </div>
      </div>
      <form action={logoutAction}>
        <Button type="submit" variant="secondary" className="w-full sm:w-auto">
          <LogOutIcon />
          Log out
        </Button>
      </form>
    </Card>
  );
}
