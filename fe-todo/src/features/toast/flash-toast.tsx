"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef } from "react";
import { TOAST_PARAM, URL_TOASTS } from "@/constants";
import { useToast } from "./toast-provider";

/**
 * Shows the toast named by `?toast=<key>` once, then removes the param so a
 * reload doesn't repeat it. Renders nothing. Needs a <Suspense> parent.
 */
export function FlashToast() {
  const params = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();
  const showToast = useToast();
  const shown = useRef<string | null>(null);

  const key = params.get(TOAST_PARAM);

  useEffect(() => {
    if (!key || shown.current === key) return;
    const toast = URL_TOASTS[key];
    shown.current = key;
    if (toast) showToast(toast.message, toast.tone);

    const rest = new URLSearchParams(params.toString());
    rest.delete(TOAST_PARAM);
    const query = rest.toString();
    router.replace(query ? `${pathname}?${query}` : pathname, { scroll: false });
  }, [key, params, pathname, router, showToast]);

  return null;
}
