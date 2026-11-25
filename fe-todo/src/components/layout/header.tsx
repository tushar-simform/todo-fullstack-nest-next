import Link from "next/link";
import { Suspense } from "react";
import { ABOUT_COPY, ROUTES } from "@/constants";
import { cn } from "@/lib/cn";
import { HeaderActions } from "./header-actions";
import { LogoLink, LogoLinkFallback } from "./logo-link";

type HeaderProps = { size?: "narrow" | "wide" };

export function Header({ size = "narrow" }: HeaderProps) {
  return (
    <header className="sticky top-0 z-20 border-b border-border/60 bg-background/70 backdrop-blur-xl">
      <div
        className={cn(
          "mx-auto flex h-16 items-center justify-between px-4",
          size === "wide" ? "max-w-5xl" : "max-w-2xl",
        )}
      >
        {/* Reads the session cookie (signed in -> /today), so it streams in like the actions on the right. */}
        <Suspense fallback={<LogoLinkFallback />}>
          <LogoLink />
        </Suspense>
        <nav className="ml-auto mr-3 sm:mr-4">
          <Link
            href={ROUTES.about}
            className="rounded-lg px-2 py-2 text-sm font-medium text-muted transition-colors hover:text-foreground focus-visible:outline-2 focus-visible:outline-primary"
          >
            {ABOUT_COPY.navLabel}
          </Link>
        </nav>
        {/* Reads the session cookie, so it streams in; the placeholder keeps the layout stable. */}
        <Suspense fallback={<div className="h-9 w-28" />}>
          <HeaderActions />
        </Suspense>
      </div>
    </header>
  );
}
