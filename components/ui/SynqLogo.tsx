"use client";
import React from "react";
import { motion } from "framer-motion";

export const SynqLogo = ({
  className = "h-8 w-8",
  animate = true,
}: {
  className?: string;
  animate?: boolean;
}) => {
  return (
    <svg
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Architectural Diamond Frame - Subtle Background */}
      <motion.path
        d="M50 10 L85 45 L50 80 L15 45 Z"
        stroke="currentColor"
        strokeWidth="1.5"
        opacity="0.1"
        initial={animate ? { pathLength: 0, opacity: 0 } : {}}
        animate={animate ? { pathLength: 1, opacity: 0.1 } : {}}
        transition={{ duration: 1.5, ease: "easeInOut" }}
      />

      {/* The Gateway Chevrons (Interlocking Sync) */}
      {/* Left Layer (Source) */}
      <motion.path
        d="M42 30 L22 50 L42 70"
        stroke="currentColor"
        strokeWidth="10"
        strokeLinecap="round"
        strokeLinejoin="round"
        initial={animate ? { x: -20, opacity: 0 } : {}}
        animate={animate ? { x: 0, opacity: 1 } : {}}
        transition={{ duration: 0.8, ease: "easeOut" }}
      />

      {/* Right Layer (Interface) */}
      <motion.path
        d="M58 30 L78 50 L58 70"
        stroke="currentColor"
        strokeWidth="10"
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity="0.3"
        initial={animate ? { x: 20, opacity: 0 } : {}}
        animate={animate ? { x: 0, opacity: 0.3 } : {}}
        transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
      />

      {/* The Core Sync Node */}
      <motion.rect
        x="47"
        y="32"
        width="6"
        height="36"
        rx="3"
        fill="currentColor"
        initial={animate ? { scaleY: 0, opacity: 0 } : {}}
        animate={animate ? { scaleY: 1, opacity: 1 } : {}}
        transition={{ duration: 0.6, delay: 0.6, ease: "backOut" }}
        className="origin-center"
      />

      {/* Dynamic Pulse Detail */}
      <motion.circle
        cx="50"
        cy="50"
        r="3"
        fill="currentColor"
        animate={
          animate
            ? {
                scale: [1, 2, 1],
                opacity: [1, 0, 1],
              }
            : {}
        }
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 1.2,
        }}
      />
    </svg>
  );
};
