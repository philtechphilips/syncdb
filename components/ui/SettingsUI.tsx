"use client";

import React from "react";
import { motion } from "framer-motion";
import { UI_CLASSES } from "@/lib/constants";

interface SectionProps {
  title: string;
  description: string;
  icon: React.ElementType;
  children: React.ReactNode;
  delay?: number;
  variant?: "default" | "danger";
}

export const SettingsSection = ({
  title,
  description,
  icon: Icon,
  children,
  delay = 0,
  variant = "default",
}: SectionProps) => {
  const isDanger = variant === "danger";

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.4,
        delay,
        ease: [0.16, 1, 0.3, 1],
      }}
      className={`rounded-xl border ${isDanger ? "border-err/15 bg-err/[0.03]" : "border-border bg-ink/[0.01]"} overflow-hidden`}
    >
      <div
        className={`flex items-start gap-4 px-6 py-5 border-b ${isDanger ? "border-err/10" : "border-border bg-ink/[0.01]"}`}
      >
        <div
          className={`h-9 w-9 rounded-xl ${isDanger ? "bg-err/10 border-err/20" : "bg-primary/10 border-primary/20"} border flex items-center justify-center shrink-0`}
        >
          <Icon
            className={`h-4.5 w-4.5 ${isDanger ? "text-err" : "text-accent-fg"}`}
          />
        </div>
        <div>
          <h2 className="text-sm font-semibold text-foreground tracking-tight">
            {title}
          </h2>
          <p className="text-xs text-subtle mt-1 leading-relaxed">
            {description}
          </p>
        </div>
      </div>
      <div className="px-6 py-6">{children}</div>
    </motion.div>
  );
};

interface ToggleProps {
  label: string;
  description: string;
  enabled: boolean;
  onChange: (val: boolean) => void;
}

export const SettingsToggle = ({
  label,
  description,
  enabled,
  onChange,
}: ToggleProps) => (
  <div className="flex items-center justify-between group">
    <div className="flex-1 pr-4">
      <p className="text-[11px] text-foreground/80 group-hover:text-foreground transition-colors">
        {label}
      </p>
      <p className="text-[11px] text-subtle mt-0.5">{description}</p>
    </div>
    <button
      onClick={() => onChange(!enabled)}
      className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 focus:outline-none ${enabled ? "bg-primary" : "bg-muted"}`}
    >
      <span
        className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${enabled ? "translate-x-4" : "translate-x-0"}`}
      />
    </button>
  </div>
);

export const SettingsLabel = ({ children }: { children: React.ReactNode }) => (
  <label className={UI_CLASSES.label}>{children}</label>
);
