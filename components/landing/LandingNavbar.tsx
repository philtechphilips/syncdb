"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, ArrowRight } from "lucide-react";
import { SynqLogo } from "@/components/ui/SynqLogo";
import { useAuthStore } from "@/store/useAuthStore";

const NAV_LINKS = [
  { name: "Features", href: "#features" },
  { name: "Databases", href: "#databases" },
  { name: "Security", href: "#security" },
  { name: "Pricing", href: "#pricing" },
];

export const LandingNavbar = ({ onLaunch }: { onLaunch: () => void }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { isAuthenticated, logout } = useAuthStore();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  return (
    <>
      <motion.nav
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{
          duration: 0.9,
          ease: [0.16, 1, 0.3, 1] as [number, number, number, number],
        }}
        className="fixed top-5 left-1/2 -translate-x-1/2 z-50 w-[95%] max-w-7xl"
      >
        <div
          className={`px-5 md:px-8 flex items-center justify-between transition-all duration-500 rounded-full border ${
            isScrolled
              ? "bg-background/60 backdrop-blur-2xl border-white/10 py-3 shadow-xl shadow-black/20"
              : "bg-transparent border-white/5 py-4"
          }`}
        >
          {/* Brand */}
          <Link href="/" className="flex items-center gap-0.5 group shrink-0">
            <SynqLogo className="h-5 w-5 text-primary translate-y-px" />
            <span className="text-base font-serif tracking-tight text-white -ml-0.5 italic">
              ynqDB
            </span>
          </Link>

          {/* Desktop nav links */}
          <div className="hidden md:flex items-center gap-8 text-[10px] font-black uppercase tracking-[0.3em] text-zinc-500">
            {NAV_LINKS.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="relative hover:text-white transition-colors duration-200 group/link"
              >
                {link.name}
                <span className="absolute -bottom-0.5 left-1/2 -translate-x-1/2 w-0 h-px bg-primary transition-all duration-300 group-hover/link:w-full" />
              </a>
            ))}
          </div>

          {/* Desktop actions */}
          <div className="hidden md:flex items-center gap-6">
            {isAuthenticated ? (
              <>
                <Link
                  href="/dashboard"
                  className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-400 hover:text-white transition-colors"
                >
                  Dashboard
                </Link>
                <button
                  onClick={logout}
                  className="text-[10px] font-black uppercase tracking-[0.3em] text-red-500/60 hover:text-red-400 transition-colors"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/auth/login"
                  className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-400 hover:text-white transition-colors"
                >
                  Sign In
                </Link>
                <button
                  onClick={onLaunch}
                  className="flex items-center gap-1.5 px-5 py-2 rounded-full bg-primary text-white text-[10px] font-black uppercase tracking-[0.3em] transition-all hover:bg-primary/90 hover:scale-105 active:scale-95 whitespace-nowrap"
                >
                  Try Free
                  <ArrowRight className="h-3 w-3" />
                </button>
              </>
            )}
          </div>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileOpen((v) => !v)}
            className="md:hidden flex items-center justify-center h-9 w-9 rounded-full border border-white/10 text-zinc-400 hover:text-white hover:border-white/20 transition-all"
            aria-label="Toggle menu"
          >
            {mobileOpen ? (
              <X className="h-4 w-4" />
            ) : (
              <Menu className="h-4 w-4" />
            )}
          </button>
        </div>
      </motion.nav>

      {/* Mobile menu overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-40 bg-background/95 backdrop-blur-xl flex flex-col"
          >
            <motion.div
              initial={{ opacity: 0, y: -16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.3, delay: 0.05 }}
              className="flex flex-col items-center justify-center flex-1 gap-8 px-8"
            >
              {/* Nav links */}
              <nav className="flex flex-col items-center gap-6 w-full">
                {NAV_LINKS.map((link, i) => (
                  <motion.a
                    key={link.name}
                    href={link.href}
                    onClick={() => setMobileOpen(false)}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 + i * 0.05 }}
                    className="text-2xl font-serif text-zinc-300 hover:text-white transition-colors italic"
                  >
                    {link.name}
                  </motion.a>
                ))}
              </nav>

              {/* Divider */}
              <div className="h-px w-24 bg-white/10" />

              {/* Mobile CTAs */}
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="flex flex-col items-center gap-4 w-full max-w-xs"
              >
                {isAuthenticated ? (
                  <Link
                    href="/dashboard"
                    onClick={() => setMobileOpen(false)}
                    className="w-full text-center px-6 py-3.5 rounded-full bg-primary text-white font-semibold text-sm"
                  >
                    Go to Dashboard
                  </Link>
                ) : (
                  <>
                    <button
                      onClick={() => {
                        setMobileOpen(false);
                        onLaunch();
                      }}
                      className="w-full px-6 py-3.5 rounded-full bg-primary text-white font-semibold text-sm flex items-center justify-center gap-2"
                    >
                      Get started free
                      <ArrowRight className="h-4 w-4" />
                    </button>
                    <Link
                      href="/auth/login"
                      onClick={() => setMobileOpen(false)}
                      className="text-sm text-zinc-500 hover:text-white transition-colors"
                    >
                      Already have an account? Sign in
                    </Link>
                  </>
                )}
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
