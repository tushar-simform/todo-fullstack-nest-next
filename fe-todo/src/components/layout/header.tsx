import Link from "next/link";
import { Suspense } from "react";
import { ROUTES } from "@/constants";
import { cn } from "@/lib/cn";
import { HeaderActions } from "./header-actions";
import { Logo } from "./logo";

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
        <Link href={ROUTES.home} aria-label="Home" className="rounded-lg focus-visible:outline-2 focus-visible:outline-primary">
          <Logo />
        </Link>
        {/* Reads the session cookie, so it streams in; the placeholder keeps the layout stable. */}
        <Suspense fallback={<div className="h-9 w-20" />}>
          <HeaderActions />
        </Suspense>
      </div>
    </header>
  );
}
