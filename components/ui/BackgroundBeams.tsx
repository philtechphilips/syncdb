"use client";
import React, { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export const BackgroundBeams = ({ className }: { className?: string }) => {
    return (
        <div
            className={cn(
                "absolute inset-0 z-0 h-full w-full overflow-hidden [mask-image:radial-gradient(ellipse_at_center,black_20%,transparent_70%)]",
                className
            )}
        >
            <div className="absolute inset-0 tech-grid opacity-[0.2]"></div>
            
            {/* Animated Beams */}
            <div className="absolute top-0 left-1/4 w-[1px] h-full bg-gradient-to-b from-transparent via-primary/50 to-transparent animate-beam-1"></div>
            <div className="absolute top-0 left-2/4 w-[1px] h-full bg-gradient-to-b from-transparent via-secondary/30 to-transparent animate-beam-2"></div>
            <div className="absolute top-0 left-3/4 w-[1px] h-full bg-gradient-to-b from-transparent via-primary/50 to-transparent animate-beam-3"></div>
        </div>
    );
};
