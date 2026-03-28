"use client";

import React from "react";

export const getEnvColor = (env: string = "development") => {
  switch (env.toLowerCase()) {
    case "production":
      return "#EF4444";
    case "staging":
      return "#F59E0B";
    default:
      return "#10B981"; // Primary green for dev
  }
};

interface BadgeProps {
  children: React.ReactNode;
  variant?: "outline" | "filled" | "glass";
  color?: string;
  dot?: boolean;
  pulse?: boolean;
  className?: string;
}

export const Badge = ({
  children,
  variant = "glass",
  color,
  dot = false,
  pulse = false,
  className = "",
}: BadgeProps) => {
  const baseClasses = "flex items-center gap-2 rounded-full px-2.5 py-0.5 text-[9px] font-black uppercase tracking-widest whitespace-nowrap transition-all";
  
  const variants = {
    glass: "bg-white/5 border border-white/10 text-zinc-400",
    filled: "text-white",
    outline: "border",
  };

  return (
    <div 
      className={`${baseClasses} ${variants[variant]} ${className}`}
      style={variant === "filled" ? { backgroundColor: `${color}20`, borderColor: `${color}40`, color } : color ? { borderColor: `${color}40`, color } : {}}
    >
      {dot && (
        <div 
          className={`h-1.5 w-1.5 rounded-full ${pulse ? "animate-pulse" : ""}`}
          style={{ backgroundColor: color || "currentColor" }}
        />
      )}
      {children}
    </div>
  );
};
