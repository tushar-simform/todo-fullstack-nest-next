"use client";

import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react";
import { Toast } from "@/components/ui/toast";
import { TOAST_DURATION_MS, type ToastTone } from "@/constants";

type ToastItem = { id: number; message: string; tone: ToastTone };
type ShowToast = (message: string, tone?: ToastTone) => void;

const ToastContext = createContext<ShowToast | null>(null);

/** `const showToast = useToast(); showToast("Saved")`. */
export function useToast(): ShowToast {
  const show = useContext(ToastContext);
  if (!show) throw new Error("useToast must be used inside <ToastProvider>");
  return show;
}

/** Holds the toast stack (bottom-centre, above the safe area) and auto-dismisses each one. */
export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const dismiss = useCallback((id: number) => {
    setToasts((list) => list.filter((t) => t.id !== id));
  }, []);

  const show = useCallback<ShowToast>(
    (message, tone = "success") => {
      const id = Date.now() + Math.random();
      setToasts((list) => [...list, { id, message, tone }]);
      setTimeout(() => dismiss(id), TOAST_DURATION_MS);
    },
    [dismiss],
  );

  const value = useMemo(() => show, [show]);

  return (
    <ToastContext value={value}>
      {children}
      <div
        aria-live="polite"
        className="pointer-events-none fixed inset-x-0 bottom-0 z-50 flex flex-col items-center gap-2 px-4 pb-[max(1rem,env(safe-area-inset-bottom))]"
      >
        {toasts.map((t) => (
          <Toast key={t.id} message={t.message} tone={t.tone} onDismiss={() => dismiss(t.id)} />
        ))}
      </div>
    </ToastContext>
  );
}
