"use client";

import React from "react";

import Link from "next/link";
import { LandingNavbar } from "@/components/landing/LandingNavbar";
import { Hero } from "@/components/landing/Hero";
import { Features } from "@/components/landing/Features";
import { Workloads } from "@/components/landing/Workloads";
import { DeveloperExperience } from "@/components/landing/DeveloperExperience";
import { SecuritySection } from "@/components/landing/SecuritySection";
import { Testimonials } from "@/components/landing/Testimonials";
import { Pricing } from "@/components/landing/Pricing";
import { Footer } from "@/components/landing/Footer";
import { useRouter } from "next/navigation";
import { SynqLogo } from "@/components/ui/SynqLogo";

export default function Home() {
  const router = useRouter();
  const handleLaunch = () => router.push("/auth/signup");

  return (
    <div className="min-h-screen bg-background font-sans selection:bg-primary/30 scroll-smooth">
      <LandingNavbar onLaunch={handleLaunch} />
      <main>
        <Hero onLaunch={handleLaunch} />

        {/* Logos Section - Infinite Marquee */}
        <section className="py-20 border-y border-white/5 bg-background relative overflow-hidden">
          <div className="max-w-7xl mx-auto px-6">
            <div className="flex overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_20%,black_80%,transparent)]">
              <div className="flex items-center gap-16 md:gap-32 animate-infinite-scroll py-4">
                {[...Array(2)].map((_, i) => (
                  <React.Fragment key={i}>
                    <span className="text-xl md:text-2xl font-black tracking-tighter text-white opacity-20 hover:opacity-100 transition-opacity cursor-default">POSTGRESQL</span>
                    <span className="text-xl md:text-2xl font-black tracking-tighter text-white opacity-20 hover:opacity-100 transition-opacity cursor-default">MYSQL</span>
                    <span className="text-xl md:text-2xl font-black tracking-tighter text-white opacity-20 hover:opacity-100 transition-opacity cursor-default">MONGODB</span>
                    <span className="text-xl md:text-2xl font-black tracking-tighter text-white opacity-20 hover:opacity-100 transition-opacity cursor-default">MSSQL</span>
                    <span className="text-xl md:text-2xl font-black tracking-tighter text-white opacity-20 hover:opacity-100 transition-opacity cursor-default">SQLITE</span>
                    <span className="text-xl md:text-2xl font-black tracking-tighter text-white opacity-20 hover:opacity-100 transition-opacity cursor-default">REDIS</span>
                  </React.Fragment>
                ))}
              </div>
            </div>
          </div>
        </section>

        <Workloads />
        <Features />
        <DeveloperExperience />
        <SecuritySection />
        <Testimonials />
        <Pricing />

        {/* Final CTA Section */}
        <section className="py-40 px-6 text-center relative overflow-hidden bg-[#0c1c24]">
          <div className="absolute inset-0 tech-grid opacity-10"></div>
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[300px] bg-primary/10 blur-[120px] rounded-full pointer-events-none"></div>

          <div className="relative z-10 max-w-4xl mx-auto">
            <h2 className="text-5xl md:text-7xl font-serif text-white mb-8 tracking-tight">
              Ready to modernize <br />
              <span className="text-primary italic">your data stack?</span>
            </h2>
            <p className="text-xl text-zinc-400 mb-12 max-w-2xl mx-auto">
              Join thousands of engineering teams who have unified their database management with SynqDB.
            </p>
            <button
              onClick={handleLaunch}
              className="group relative px-10 py-5 rounded-lg bg-primary text-primary-foreground font-bold text-xl hover:bg-opacity-90 transition-all active:scale-95 shadow-[0_0_30px_rgba(0,237,100,0.3)] hover:shadow-[0_0_50px_rgba(0,237,100,0.5)]"
            >
              <span className="relative z-10">Start Building Now</span>
              <div className="absolute inset-0 rounded-lg bg-white/20 scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-500"></div>
            </button>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
