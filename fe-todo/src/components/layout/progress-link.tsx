"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChartIcon } from "@/components/ui/icons";
import { PROGRESS_NAV_LABEL, ROUTES } from "@/constants";
import { cn } from "@/lib/cn";

/** Header menu entry for the Progress page. Highlights while on /progress. */
export function ProgressNavLink() {
  const active = usePathname() === ROUTES.progress;

  return (
    <Link
      href={ROUTES.progress}
      aria-label={PROGRESS_NAV_LABEL}
      aria-current={active ? "page" : undefined}
      className={cn(
        "flex items-center gap-1.5 rounded-lg px-2 py-2 text-sm font-medium transition-colors",
        "hover:text-foreground focus-visible:outline-2 focus-visible:outline-primary",
        active ? "text-primary" : "text-muted",
      )}
    >
      <ChartIcon />
      <span className="hidden min-[400px]:inline">{PROGRESS_NAV_LABEL}</span>
    </Link>
  );
}
