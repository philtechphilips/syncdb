"use client";

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

export default function Home() {
  const router = useRouter();
  const handleLaunch = () => router.push("/auth/signup");

  return (
    <div className="min-h-screen bg-background font-sans selection:bg-primary/30 scroll-smooth">
      <LandingNavbar onLaunch={handleLaunch} />
      <main>
        <Hero onLaunch={handleLaunch} />

        {/* Logos Section */}
        <section className="py-20 border-y border-white/5 bg-background relative overflow-hidden">
          <div className="max-w-7xl mx-auto px-6 whitespace-nowrap overflow-hidden">
            <div className="flex items-center justify-center gap-16 md:gap-32 opacity-30 grayscale hover:grayscale-0 transition-all duration-700">
              <span className="text-xl md:text-2xl font-black tracking-tighter text-white">POSTGRES</span>
              <span className="text-xl md:text-2xl font-black tracking-tighter text-white">MYSQL</span>
              <span className="text-xl md:text-2xl font-black tracking-tighter text-white">MSSQL</span>
              <span className="text-xl md:text-2xl font-black tracking-tighter text-white">SQLITE</span>
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
              Join thousands of engineering teams who have unified their database management with MultiDBM.
            </p>
            <button
              onClick={handleLaunch}
              className="group relative px-10 py-5 rounded-lg bg-primary text-primary-foreground font-bold text-xl hover:bg-opacity-90 transition-all active:scale-95 shadow-[0_0_30px_rgba(0,237,100,0.3)]"
            >
              Start Building Now
            </button>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
