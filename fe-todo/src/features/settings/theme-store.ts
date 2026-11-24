"use client";

import { useSyncExternalStore } from "react";

export type Theme = (typeof THEMES)[number];

import { THEME_STORAGE_KEY, type THEMES } from "@/constants";

const listeners = new Set<() => void>();

function readTheme(): Theme {
  try {
    const stored = localStorage.getItem(THEME_STORAGE_KEY);
    if (stored === "light" || stored === "dark") return stored;
  } catch {}
  return "system";
}

/** Apply the resolved theme to <html>. Mirrors ThemeScript. */
function applyTheme(theme: Theme) {
  const dark =
    theme === "dark" ||
    (theme === "system" && matchMedia("(prefers-color-scheme: dark)").matches);
  document.documentElement.dataset.theme = dark ? "dark" : "light";
}

export function setTheme(theme: Theme) {
  try {
    if (theme === "system") localStorage.removeItem(THEME_STORAGE_KEY);
    else localStorage.setItem(THEME_STORAGE_KEY, theme);
  } catch {}
  applyTheme(theme);
  listeners.forEach((l) => l());
}

function subscribe(onChange: () => void) {
  listeners.add(onChange);
  const media = matchMedia("(prefers-color-scheme: dark)");
  const onSystem = () => {
    if (readTheme() === "system") applyTheme("system");
  };
  media.addEventListener("change", onSystem);
  window.addEventListener("storage", onChange);
  return () => {
    listeners.delete(onChange);
    media.removeEventListener("change", onSystem);
    window.removeEventListener("storage", onChange);
  };
}

/** Current theme preference ("system" on the server / first render). */
export function useTheme() {
  return useSyncExternalStore<Theme>(subscribe, readTheme, () => "system");
}
