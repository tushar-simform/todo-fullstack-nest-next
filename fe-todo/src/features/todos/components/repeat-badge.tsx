import { RepeatIcon } from "@/components/ui/icons";
import { formatRepeatDays } from "../repeat";

/** Pill describing which weekdays a repeating todo occurs on. */
export function RepeatBadge({ days }: { days: number[] }) {
  return (
    <span className="inline-flex items-center gap-1.5 whitespace-nowrap rounded-full bg-accent/10 px-2.5 py-1 text-xs font-medium text-accent">
      <RepeatIcon />
      {formatRepeatDays(days)}
    </span>
  );
}
