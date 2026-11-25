import { Card } from "@/components/ui/card";
import { CheckIcon, ClockIcon, RepeatIcon } from "@/components/ui/icons";
import { cn } from "@/lib/cn";

const SAMPLE = [
  { title: "Ship the weekly report", meta: "Today, 5:00 PM", done: false, repeat: false },
  { title: "Morning workout", meta: "Mon, Wed, Fri", done: false, repeat: true },
  { title: "Book dentist appointment", meta: "Done", done: true, repeat: false },
];

/** Decorative, static preview of the app. Not interactive. */
export function AppPreview() {
  return (
    <Card
      aria-hidden="true"
      className="animate-fade-up mx-auto w-full max-w-md overflow-hidden p-1.5"
      style={{ animationDelay: "200ms" }}
    >
      <div className="rounded-xl bg-surface-muted/60 p-3">
        <div className="mb-3 flex items-center justify-between px-1">
          <span className="text-sm font-semibold">Today</span>
          <span className="rounded-full bg-primary/15 px-2 py-0.5 text-xs font-medium text-primary">2 left</span>
        </div>
        <ul className="flex flex-col gap-2">
          {SAMPLE.map((item) => (
            <li key={item.title} className="flex items-center gap-3 rounded-xl bg-surface p-3">
              <span
                className={cn(
                  "grid size-5 shrink-0 place-items-center rounded-full border-2 text-[10px]",
                  item.done ? "border-transparent bg-gradient-to-br from-primary to-accent text-primary-foreground" : "border-border",
                )}
              >
                {item.done && <CheckIcon strokeWidth={3} />}
              </span>
              <span className="min-w-0 flex-1">
                <span className={cn("block truncate text-sm font-medium", item.done && "text-muted line-through")}>
                  {item.title}
                </span>
                <span className="mt-0.5 flex items-center gap-1 text-xs text-muted">
                  {item.repeat ? <RepeatIcon /> : <ClockIcon />}
                  {item.meta}
                </span>
              </span>
            </li>
          ))}
        </ul>
      </div>
    </Card>
  );
}
