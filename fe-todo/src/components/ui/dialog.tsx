"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { cn } from "@/lib/cn";
import { IconButton } from "./icon-button";
import { XIcon } from "./icons";

type DialogProps = {
  open: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  className?: string;
};

/**
 * Modal built on the native <dialog>: focus trap, Esc to close and inert
 * background come from the browser. Children mount only while open, so form
 * state resets every time it opens.
 */
export function Dialog({ open, onClose, title, children, className }: DialogProps) {
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);

  return (
    <dialog
      ref={ref}
      onClose={onClose}
      // A click on the backdrop targets the <dialog> element itself.
      onClick={(e) => e.target === e.currentTarget && onClose()}
      aria-label={title}
      className={cn(
        // Mobile: full-width bottom sheet. sm+: centered modal.
        "mb-0 mt-auto w-full max-w-none overflow-y-auto overscroll-contain rounded-b-none rounded-t-3xl border border-border bg-surface p-0 text-foreground shadow-2xl",
        "max-h-[92dvh] open:animate-sheet-up",
        "sm:m-auto sm:max-w-lg sm:rounded-2xl sm:max-h-[85dvh] sm:open:animate-pop",
        "backdrop:bg-black/50 backdrop:backdrop-blur-sm",
        className,
      )}
    >
      {open && (
        <div className="p-5 pb-[max(1.25rem,env(safe-area-inset-bottom))] sm:p-6">
          <div className="mb-5 flex items-center justify-between">
            <h2 className="text-lg font-semibold tracking-tight">{title}</h2>
            <IconButton label="Close dialog" onClick={onClose}>
              <XIcon />
            </IconButton>
          </div>
          {children}
        </div>
      )}
    </dialog>
  );
}
