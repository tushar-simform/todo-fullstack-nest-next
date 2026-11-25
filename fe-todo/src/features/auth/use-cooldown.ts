"use client";

import { useSyncExternalStore } from "react";
import { RESEND_COOLDOWN_SECONDS } from "@/constants";

/**
 * A countdown that survives page reloads (sessionStorage) and ticks every
 * second. Both the storage and the clock are external systems, which is what
 * `useSyncExternalStore` is for. The first visit starts a full cooldown: this
 * is used where an email was just sent.
 */

const listeners = new Set<() => void>();
const notify = () => listeners.forEach((listener) => listener());

function subscribe(listener: () => void) {
  listeners.add(listener);
  const timer = setInterval(listener, 1000);
  return () => {
    listeners.delete(listener);
    clearInterval(timer);
  };
}

function readEnd(key: string): number | null {
  try {
    const value = Number(sessionStorage.getItem(key));
    return Number.isFinite(value) && value > 0 ? value : null;
  } catch {
    return null; // storage blocked: the countdown just isn't persisted
  }
}

function writeEnd(key: string, endsAt: number) {
  try {
    sessionStorage.setItem(key, String(endsAt));
  } catch {
    /* not persisted, still works */
  }
}

function secondsLeft(key: string): number {
  let end = readEnd(key);
  if (end === null) {
    end = Date.now() + RESEND_COOLDOWN_SECONDS * 1000;
    writeEnd(key, end); // idempotent: later reads see this value
  }
  return Math.max(0, Math.ceil((end - Date.now()) / 1000));
}

/** `[secondsLeft, start]`: `start(seconds)` restarts the countdown (e.g. after the API said how long to wait). */
export function useCooldown(storageKey: string) {
  const left = useSyncExternalStore(
    subscribe,
    () => secondsLeft(storageKey),
    () => RESEND_COOLDOWN_SECONDS, // server and first client render agree
  );
  const start = (seconds: number) => {
    writeEnd(storageKey, Date.now() + seconds * 1000);
    notify();
  };
  return [left, start] as const;
}
