"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Github, Twitter, Linkedin, ArrowRight } from "lucide-react";
import { Logotype } from "@/components/ui/SynqLogo";
import { ThemeToggle } from "@/components/ui/ThemeToggle";

const LINKS = {
  Product: [
    { label: "Features", href: "#features" },
    { label: "Integrations", href: "#" },
    { label: "Pricing", href: "#pricing" },
    { label: "Changelog", href: "#" },
    { label: "Roadmap", href: "#" },
  ],
  Developers: [
    { label: "Documentation", href: "#" },
    { label: "API Reference", href: "#" },
    { label: "GitHub", href: "#" },
    { label: "Status", href: "#" },
  ],
  Company: [
    { label: "About", href: "#" },
    { label: "Blog", href: "#" },
    { label: "Careers", href: "#" },
    { label: "Contact", href: "#" },
  ],
  Legal: [
    { label: "Privacy Policy", href: "#" },
    { label: "Terms of Service", href: "#" },
    { label: "Security", href: "#security" },
    { label: "Cookie Policy", href: "#" },
  ],
};

const SOCIALS = [
  { icon: Twitter, href: "#", label: "Twitter" },
  { icon: Github, href: "#", label: "GitHub" },
  { icon: Linkedin, href: "#", label: "LinkedIn" },
];

export const Footer = () => {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setSubmitted(true);
    setEmail("");
  };

  return (
    <footer className="bg-background relative overflow-hidden">
      {/* Top separator */}
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-ink/8 to-transparent" />

      {/* Newsletter band */}
      <div className="border-b border-border">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
            <div className="space-y-1">
              <p className="text-sm text-foreground">Stay in the loop</p>
              <p className="text-sm text-subtle">
                Get product updates, engineering notes, and release
                announcements.
              </p>
            </div>

            {submitted ? (
              <div className="flex items-center gap-2 text-sm text-accent-fg font-semibold">
                <div className="h-4 w-4 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center">
                  <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                </div>
                You&apos;re subscribed — thank you!
              </div>
            ) : (
              <form
                onSubmit={handleSubmit}
                className="flex items-center gap-2 w-full md:w-auto"
              >
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@company.com"
                  className="flex-1 md:w-64 px-4 py-2.5 rounded-full border border-border bg-ink/[0.03] text-sm text-foreground placeholder:text-subtle focus:outline-none focus:border-primary/40 focus:bg-ink/[0.05] transition-all"
                />
                <button
                  type="submit"
                  className="flex items-center gap-1.5 px-5 py-2.5 rounded-full bg-primary text-white text-sm font-medium whitespace-nowrap hover:bg-primary-hover transition-all"
                >
                  Subscribe
                  <ArrowRight className="h-3.5 w-3.5" />
                </button>
              </form>
            )}
          </div>
        </div>
      </div>

      {/* Main footer */}
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-6 gap-12">
          {/* Brand col */}
          <div className="md:col-span-2 space-y-5">
            <Link
              href="/"
              className="flex items-center gap-0.5 cursor-pointer w-max"
            >
              <Logotype className="text-[17px]" />
            </Link>

            <p className="text-sm text-subtle leading-relaxed max-w-xs">
              The professional workspace for multi-database engineering teams.
              Connect, query, and visualize — all in one place.
            </p>

            {/* Socials */}
            <div className="flex gap-2 pt-1">
              {SOCIALS.map(({ icon: Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className="h-9 w-9 flex items-center justify-center rounded-full border border-border text-subtle hover:text-foreground hover:border-line-strong transition-all duration-200"
                >
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>

            <ThemeToggle />
          </div>

          {/* Link columns */}
          {Object.entries(LINKS).map(([section, items]) => (
            <div key={section} className="space-y-4">
              <h4 className="text-[11px] font-medium text-subtle">{section}</h4>
              <nav className="flex flex-col gap-2.5">
                {items.map((item) => (
                  <a
                    key={item.label}
                    href={item.href}
                    className="text-sm text-subtle font-medium hover:text-foreground transition-colors duration-200"
                  >
                    {item.label}
                  </a>
                ))}
              </nav>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="mt-16 pt-8 border-t border-border flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-[11px] text-subtle/70">
            &copy; {new Date().getFullYear()} SynqDB, Inc. All rights reserved.
          </p>
          <div className="flex items-center gap-1.5">
            <div className="h-1.5 w-1.5 rounded-full bg-ok animate-pulse" />
            <span className="text-[11px] font-medium text-subtle/70">
              All systems operational
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};
