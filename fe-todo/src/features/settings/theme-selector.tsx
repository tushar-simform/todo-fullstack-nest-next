"use client";

import { MonitorIcon, MoonIcon, SunIcon } from "@/components/ui/icons";
import {
  SegmentedControl,
  type SegmentOption,
} from "@/components/ui/segmented-control";
import { setTheme, useTheme, type Theme } from "./theme-store";

const options: SegmentOption<Theme>[] = [
  { value: "light", label: "Light", icon: <SunIcon /> },
  { value: "dark", label: "Dark", icon: <MoonIcon /> },
  { value: "system", label: "System", icon: <MonitorIcon /> },
];

export function ThemeSelector() {
  const theme = useTheme();
  return (
    <SegmentedControl
      label="Theme"
      options={options}
      value={theme}
      onChange={setTheme}
    />
  );
}
