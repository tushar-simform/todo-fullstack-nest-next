"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { TODO_TABS } from "@/constants";
import { cn } from "@/lib/cn";
import { selectCounts } from "../occurrences";
import { useNow } from "../use-now";
import { useTodos } from "./todos-provider";

/** Today / All / Due / Upcoming / Done, with live count badges. */
export function TodoTabs() {
  const pathname = usePathname();
  const { todos } = useTodos();
  const now = useNow();
  const counts = now === null ? null : selectCounts(todos, new Date(now));

  return (
    <nav
      aria-label="Todo views"
      className="animate-fade-up mb-6"
    >
      <div className="grid w-full grid-cols-5 gap-1 rounded-xl border border-border bg-surface p-1 shadow-card sm:inline-flex sm:w-auto">
        {TODO_TABS.map(({ view, label, href }) => {
          const active = pathname === href;
          const count = counts && (view === "today" || view === "due" || view === "upcoming") ? counts[view] : 0;
          return (
            <Link
              key={view}
              href={href}
              aria-current={active ? "page" : undefined}
              className={cn(
                "flex items-center justify-center gap-1.5 whitespace-nowrap rounded-lg px-1 py-2.5 text-xs font-medium transition-all duration-200 sm:px-3.5 sm:py-2 sm:text-sm",
                "focus-visible:outline-2 focus-visible:outline-primary active:scale-95",
                active
                  ? "bg-gradient-to-br from-primary to-accent text-primary-foreground shadow-md shadow-primary/30"
                  : "text-muted hover:bg-surface-muted hover:text-foreground",
              )}
            >
              {label}
              {count > 0 && (
                <span
                  className={cn(
                    "animate-pop hidden min-w-5 rounded-full px-1.5 text-center text-xs tabular-nums sm:inline",
                    active
                      ? "bg-primary-foreground/20 text-primary-foreground"
                      : view === "due"
                        ? "bg-danger/15 text-danger"
                        : "bg-surface-muted text-muted",
                  )}
                >
                  {count > 99 ? "99+" : count}
                </span>
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
