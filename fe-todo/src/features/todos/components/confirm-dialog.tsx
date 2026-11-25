"use client";

import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";

type ConfirmDialogProps = {
  open: boolean;
  title: string;
  message: string;
  confirmLabel: string;
  tone?: "primary" | "danger";
  onConfirm: () => void;
  onClose: () => void;
};

/** Small yes/no confirmation built on the shared Dialog. */
export function ConfirmDialog({ open, title, message, confirmLabel, tone = "primary", onConfirm, onClose }: ConfirmDialogProps) {
  return (
    <Dialog centered open={open} onClose={onClose} title={title}>
      <p className="mb-6 break-words text-sm text-muted">{message}</p>
      <div className="flex justify-end gap-2">
        <Button variant="secondary" onClick={onClose}>Cancel</Button>
        <Button
          variant="primary"
          className={tone === "danger" ? "from-danger to-danger shadow-danger/30" : undefined}
          onClick={() => {
            onClose();
            onConfirm();
          }}
        >
          {confirmLabel}
        </Button>
      </div>
    </Dialog>
  );
}
