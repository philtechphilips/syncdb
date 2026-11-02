"use client";

import { Monitor, Moon, Sun } from "lucide-react";
import {
  setThemePreference,
  useThemePreference,
  type ThemePreference,
} from "@/lib/theme";

const options: {
  value: ThemePreference;
  icon: typeof Sun;
  label: string;
}[] = [
  { value: "system", icon: Monitor, label: "System" },
  { value: "light", icon: Sun, label: "Light" },
  { value: "dark", icon: Moon, label: "Dark" },
];

/** System / light / dark switch. */
export function ThemeToggle({ className = "" }: { className?: string }) {
  const preference = useThemePreference();
  return (
    <div
      className={`flex w-fit items-center rounded-full border border-border p-0.5 ${className}`}
      role="radiogroup"
      aria-label="Theme"
    >
      {options.map((o) => (
        <button
          key={o.value}
          type="button"
          role="radio"
          aria-checked={preference === o.value}
          aria-label={o.label}
          title={o.label}
          onClick={() => setThemePreference(o.value)}
          className={`flex size-7 items-center justify-center rounded-full transition-colors ${
            preference === o.value
              ? "bg-ink/[0.08] text-foreground"
              : "text-subtle hover:text-foreground"
          }`}
        >
          <o.icon className="h-3.5 w-3.5" />
        </button>
      ))}
    </div>
  );
}
