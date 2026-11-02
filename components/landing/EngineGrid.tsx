"use client";

import React from "react";
import { motion } from "framer-motion";
import NextImage from "next/image";
import { Database, Layers } from "lucide-react";

const engines = [
  {
    name: "PostgreSQL",
    description:
      "Advanced relational engine with deep JSONB support and PL/pgSQL intelligence.",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/postgresql/postgresql-original.svg",
    color: "#336791",
  },
  {
    name: "MySQL",
    description:
      "Optimized for high-concurrency web applications and cluster architectures.",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mysql/mysql-original.svg",
    color: "#4479A1",
  },
  {
    name: "SQL Server (MSSQL)",
    description:
      "Enterprise-grade T-SQL execution with full support for stored procedures.",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/microsoftsqlserver/microsoftsqlserver-plain.svg",
    color: "#A91D22",
  },
  {
    name: "SQLite",
    description:
      "Zero-configuration edge data storage for local and distributed workloads.",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/sqlite/sqlite-original.svg",
    color: "#003B57",
  },
];

export const EngineGrid = () => {
  return (
    <section className="py-32 bg-background relative overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[1px] bg-gradient-to-r from-transparent via-primary/20 to-transparent"></div>

      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center max-w-2xl mx-auto mb-20">
          <span className="text-[11px] font-medium text-accent-fg mb-3 block">
            Multi-Engine Intelligence
          </span>
          <h2 className="text-4xl md:text-5xl text-foreground leading-[1.1] tracking-tight mb-6 font-semibold">
            Designed for every <br />
            modern dialect.
          </h2>
          <p className="text-subtle">
            SynqDB isn&apos;t just a wrapper. We&apos;ve built native drivers
            for the 4 core database technologies in your stack.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-stretch">
          {/* Featured: PostgreSQL */}
          <div className="md:col-span-8 group relative overflow-hidden rounded-xl bg-ink/[0.02] border border-border p-12 transition-all hover:border-primary/20 hover:bg-ink/[0.03]">
            <div className="absolute top-0 right-0 p-12 opacity-10 group-hover:opacity-20 transition-opacity">
              <NextImage
                src={engines[0].icon}
                alt=""
                width={160}
                height={160}
                className="grayscale group-hover:grayscale-0 transition-all duration-700"
              />
            </div>
            <div className="relative z-10 max-w-md">
              <div className="p-3 rounded-xl bg-primary/10 border border-primary/20 w-max mb-8 group-hover:scale-110 transition-transform">
                <Database className="h-6 w-6 text-subtle" />
              </div>
              <h3 className="text-3xl font-semibold text-foreground mb-4">
                Deep {engines[0].name} Integration
              </h3>
              <p className="text-subtle text-lg leading-relaxed group-hover:text-foreground transition-colors">
                {engines[0].description}
              </p>

              <div className="mt-8 flex gap-4">
                <span className="px-3 py-1 rounded-full bg-ink/5 border border-border text-[11px] font-medium text-foreground">
                  JSONB Optimized
                </span>
                <span className="px-3 py-1 rounded-full bg-ink/5 border border-border text-[11px] font-medium text-foreground">
                  Extension Support
                </span>
              </div>
            </div>
          </div>

          {/* SQLite */}
          <div className="md:col-span-4 group relative overflow-hidden rounded-xl bg-ink/[0.02] border border-border p-10 transition-all hover:border-primary/20 hover:bg-ink/[0.03]">
            <div className="relative z-10">
              <div className="p-3 rounded-xl bg-ink/5 border border-border w-max mb-8 group-hover:scale-110 transition-transform">
                <Layers className="h-6 w-6 text-muted-foreground" />
              </div>
              <NextImage
                src={engines[3].icon}
                alt=""
                width={40}
                height={40}
                className="mb-6 grayscale group-hover:grayscale-0 transition-all duration-500"
              />
              <h3 className="text-2xl font-semibold text-foreground mb-4">
                {engines[3].name}
              </h3>
              <p className="text-subtle text-sm leading-relaxed group-hover:text-foreground transition-colors">
                {engines[3].description}
              </p>
              <div className="mt-8 pt-8 border-t border-border">
                <span className="text-[11px] font-medium text-accent-fg/60 leading-none">
                  Zero-Config Persistence
                </span>
              </div>
            </div>
          </div>

          {/* MSSQL */}
          <div className="md:col-span-5 group relative overflow-hidden rounded-xl bg-ink/[0.02] border border-border p-10 transition-all hover:border-primary/20 hover:bg-ink/[0.03]">
            <div className="relative z-10">
              <NextImage
                src={engines[2].icon}
                alt=""
                width={48}
                height={48}
                className="mb-8 grayscale group-hover:grayscale-0 transition-all duration-500"
              />
              <h3 className="text-2xl font-semibold text-foreground mb-4">
                MSSQL Enterprise
              </h3>
              <p className="text-subtle text-sm leading-relaxed group-hover:text-foreground transition-colors">
                {engines[2].description}
              </p>

              <div className="mt-10 flex items-center justify-between border-t border-border pt-6">
                <div className="flex -space-x-2">
                  {[1, 2, 3].map((i) => (
                    <div
                      key={i}
                      className="h-6 w-6 rounded-full bg-muted border border-background"
                    ></div>
                  ))}
                </div>
                <span className="text-[11px] font-medium text-subtle">
                  Dialect Specialized
                </span>
              </div>
            </div>
          </div>

          {/* MySQL */}
          <div className="md:col-span-7 group relative overflow-hidden rounded-xl bg-ink/[0.02] border border-border p-10 transition-all hover:border-primary/20 hover:bg-ink/[0.03]">
            <div className="relative z-10 flex flex-col md:flex-row gap-8 items-start md:items-center">
              <div className="flex-1">
                <NextImage
                  src={engines[1].icon}
                  alt=""
                  width={48}
                  height={48}
                  className="mb-8 grayscale group-hover:grayscale-0 transition-all duration-500"
                />
                <h3 className="text-2xl font-semibold text-foreground mb-4">
                  {engines[1].name} Production
                </h3>
                <p className="text-subtle text-sm leading-relaxed group-hover:text-foreground transition-colors">
                  {engines[1].description}
                </p>
              </div>

              <div className="w-full md:w-48 p-6 rounded-xl bg-ink/5 border border-border">
                <div className="h-1 w-full bg-ink/5 rounded-full overflow-hidden mb-4">
                  <motion.div
                    initial={{ width: 0 }}
                    whileInView={{ width: "85%" }}
                    transition={{ duration: 1.5, ease: "easeOut" }}
                    viewport={{ once: true }}
                    className="h-full bg-primary/40"
                  ></motion.div>
                </div>
                <span className="text-[11px] font-medium text-subtle block mb-1">
                  Throughput
                </span>
                <span className="text-lg font-semibold text-foreground tracking-tight">
                  1.2M req/sec
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
