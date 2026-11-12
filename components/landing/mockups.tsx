"use client";

import React from "react";

export const ENGINES = [
  { name: "PostgreSQL", icon: "postgresql/postgresql-original.svg" },
  { name: "MySQL", icon: "mysql/mysql-original.svg" },
  {
    name: "SQL Server",
    icon: "microsoftsqlserver/microsoftsqlserver-plain.svg",
  },
  { name: "SQLite", icon: "sqlite/sqlite-original.svg" },
] as const;

export function EngineIcon({
  icon,
  className = "h-5 w-5",
}: {
  icon: string;
  className?: string;
}) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={`https://cdn.jsdelivr.net/gh/devicons/devicon/icons/${icon}`}
      alt=""
      className={className}
      loading="lazy"
    />
  );
}

/** App window frame: traffic lights and an optional address. */
export function Window({
  title,
  children,
  className = "",
  dark = false,
}: {
  title?: string;
  children: React.ReactNode;
  className?: string;
  dark?: boolean;
}) {
  return (
    <div
      className={`overflow-hidden rounded-xl border shadow-[0_24px_60px_-20px_rgb(30_27_75/0.25),0_2px_6px_rgb(0_0_0/0.05)] ${
        dark
          ? "border-white/10 bg-[#0f0f14] text-white"
          : "border-border bg-card"
      } ${className}`}
    >
      <div
        className={`flex h-8 items-center gap-1.5 border-b px-3 ${
          dark ? "border-white/10 bg-white/[0.03]" : "border-border bg-bg-200"
        }`}
      >
        <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]" />
        <span className="h-2.5 w-2.5 rounded-full bg-[#febc2e]" />
        <span className="h-2.5 w-2.5 rounded-full bg-[#28c840]" />
        {title && (
          <span
            className={`mx-auto -translate-x-6 rounded-md px-2 py-0.5 font-mono text-[10px] ${
              dark ? "text-white/50" : "bg-background text-subtle"
            }`}
          >
            {title}
          </span>
        )}
      </div>
      {children}
    </div>
  );
}
