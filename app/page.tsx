"use client";

import React from "react";

import { LandingNavbar } from "@/components/landing/LandingNavbar";
import { Hero } from "@/components/landing/Hero";
import { Features } from "@/components/landing/Features";
import { Workloads } from "@/components/landing/Workloads";
import { DataExplorerSection } from "@/components/landing/DataExplorerSection";
import { EngineGrid } from "@/components/landing/EngineGrid";
import { DeveloperExperience } from "@/components/landing/DeveloperExperience";
import { SecuritySection } from "@/components/landing/SecuritySection";
import { Testimonials } from "@/components/landing/Testimonials";
import { Pricing } from "@/components/landing/Pricing";
import { Footer } from "@/components/landing/Footer";
import { CTASection } from "@/components/landing/CTASection";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();
  const handleLaunch = () => router.push("/auth/signup");

  return (
    <div className="min-h-screen bg-background font-sans selection:bg-primary/30 scroll-smooth">
      <LandingNavbar onLaunch={handleLaunch} />

      <main>
        <Hero onLaunch={handleLaunch} />
        <EngineGrid />
        <Workloads />
        <Features />
        <DataExplorerSection />
        <DeveloperExperience />
        <SecuritySection />
        <Testimonials />
        <Pricing />

        <CTASection onLaunch={handleLaunch} />
      </main>
      <Footer />
    </div>
  );
}
