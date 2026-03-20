"use client";
import React from "react";
import { motion } from "framer-motion";

export const SynqLogo = ({ className = "h-8 w-8", animate = true }: { className?: string, animate?: boolean }) => {
    return (
        <svg
            viewBox="0 0 100 100"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className={className}
        >
            {/* Minimalist 'S' Sync Icon */}
            {/* Top half of S */}
            <motion.path
                d="M75 30C75 30 70 15 50 15C30 15 25 30 25 30L25 45"
                stroke="currentColor"
                strokeWidth="10"
                strokeLinecap="round"
                initial={animate ? { pathLength: 0 } : {}}
                animate={animate ? { pathLength: 1 } : {}}
                transition={{ duration: 0.8, ease: "easeInOut" }}
            />
            
            {/* Connection / Middle of S */}
            <motion.path
                d="M25 45C25 45 25 55 50 55C75 55 75 45 75 45"
                stroke="currentColor"
                strokeWidth="10"
                strokeLinecap="round"
                initial={animate ? { opacity: 0 } : {}}
                animate={animate ? { opacity: 1 } : {}}
                transition={{ delay: 0.6 }}
            />

            {/* Bottom half of S */}
            <motion.path
                d="M75 55L75 70C75 70 70 85 50 85C30 85 25 70 25 70"
                stroke="currentColor"
                strokeWidth="10"
                strokeLinecap="round"
                initial={animate ? { pathLength: 0 } : {}}
                animate={animate ? { pathLength: 1 } : {}}
                transition={{ duration: 0.8, delay: 0.8, ease: "easeInOut" }}
            />

            {/* Sync arrow heads (optional for sync feel, keep minimal) */}
            <motion.circle
                cx="25"
                cy="30"
                r="5"
                fill="currentColor"
                initial={animate ? { scale: 0 } : {}}
                animate={animate ? { scale: 1 } : {}}
                transition={{ delay: 1.6 }}
            />
            <motion.circle
                cx="75"
                cy="70"
                r="5"
                fill="currentColor"
                initial={animate ? { scale: 0 } : {}}
                animate={animate ? { scale: 1 } : {}}
                transition={{ delay: 1.8 }}
            />
        </svg>
    );
};
