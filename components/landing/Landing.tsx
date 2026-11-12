"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { MotionConfig } from "framer-motion";
import { AnnouncementBar, Nav } from "./Nav";
import { Hero } from "./Hero";
import { Engines, Platform, ProblemSolution } from "./Story";
import { Workflow } from "./Workflow";
import { Closing, LocalAgent, Pricing, Testimonials } from "./Closing";

export default function Landing() {
  const router = useRouter();
  const onLaunch = () => router.push("/auth/signup");

  return (
    <MotionConfig reducedMotion="user">
      <div className="min-h-screen overflow-x-clip bg-background text-foreground">
        <AnnouncementBar onLaunch={onLaunch} />
        <Nav onLaunch={onLaunch} />
        <main>
          <Hero onLaunch={onLaunch} />
          <Engines />
          <ProblemSolution />
          <Platform />
          <Workflow />
          <LocalAgent />
          <Testimonials />
          <Pricing onLaunch={onLaunch} />
        </main>
        <Closing onLaunch={onLaunch} />
      </div>
    </MotionConfig>
  );
}
