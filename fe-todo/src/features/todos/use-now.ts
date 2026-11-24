"use client";

import { useSyncExternalStore } from "react";
import { NOW_TICK_MS } from "@/constants";

let now = Date.now();
let timer: ReturnType<typeof setInterval> | undefined;
const listeners = new Set<() => void>();

function subscribe(onChange: () => void) {
  listeners.add(onChange);
  if (!timer) {
    now = Date.now();
    timer = setInterval(() => {
      now = Date.now();
      listeners.forEach((l) => l());
    }, NOW_TICK_MS);
  }
  return () => {
    listeners.delete(onChange);
    if (listeners.size === 0 && timer) {
      clearInterval(timer);
      timer = undefined;
    }
  };
}

/**
 * Current time (ms), refreshed every NOW_TICK_MS. Returns null on the server
 * and first render so time-dependent UI never causes a hydration mismatch.
 */
export function useNow(): number | null {
  return useSyncExternalStore(subscribe, () => now, () => null);
}
