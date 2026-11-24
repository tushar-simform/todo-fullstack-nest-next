import { IconButton } from "@/components/ui/icon-button";
import { XIcon } from "@/components/ui/icons";

type TodoErrorBannerProps = { message: string | null; onDismiss: () => void };

export function TodoErrorBanner({ message, onDismiss }: TodoErrorBannerProps) {
  if (!message) return null;
  return (
    <div
      role="alert"
      className="animate-pop flex items-center justify-between rounded-xl border border-danger/30 bg-danger/10 py-2 pl-4 pr-2 text-sm text-danger"
    >
      {message}
      <IconButton label="Dismiss error" tone="danger" onClick={onDismiss}>
        <XIcon />
      </IconButton>
    </div>
  );
}
