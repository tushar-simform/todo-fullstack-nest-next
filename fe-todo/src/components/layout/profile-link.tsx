"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { SettingsIcon, UserIcon } from "@/components/ui/icons";
import { ROUTES } from "@/constants";
import { cn } from "@/lib/cn";

/** Profile avatar + settings entry point. Highlights while on /settings. */
export function ProfileMenuLink() {
  const active = usePathname() === ROUTES.settings;

  return (
    <Link
      href={ROUTES.settings}
      aria-label="Profile and settings"
      className={cn(
        "group flex items-center gap-2 rounded-full border bg-surface py-1 pl-1 pr-3 text-sm transition-all duration-200",
        "hover:border-primary/60 hover:shadow-card active:scale-95 focus-visible:outline-2 focus-visible:outline-primary",
        active ? "border-primary text-foreground" : "border-border text-muted",
      )}
    >
      <span className="grid size-8 place-items-center rounded-full bg-gradient-to-br from-primary to-accent text-primary-foreground">
        <UserIcon />
      </span>
      <SettingsIcon className="transition-transform duration-500 group-hover:rotate-90" />
    </Link>
  );
}
