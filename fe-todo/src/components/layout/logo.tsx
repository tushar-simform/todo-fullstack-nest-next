import { APP_NAME } from "@/constants";
import { ListChecksIcon } from "@/components/ui/icons";

export function Logo() {
  return (
    <span className="flex items-center gap-2.5 font-semibold tracking-tight">
      <span className="grid size-9 place-items-center rounded-xl bg-gradient-to-br from-primary to-accent text-lg text-white shadow-md shadow-primary/30">
        <ListChecksIcon />
      </span>
      <span className="text-lg">{APP_NAME}</span>
    </span>
  );
}
