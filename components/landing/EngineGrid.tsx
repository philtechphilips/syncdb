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
          <span className="text-[10px] font-black text-primary uppercase tracking-[0.4em] mb-4 block animate-pulse underline underline-offset-8">
            Multi-Engine Intelligence
          </span>
          <h2 className="text-4xl md:text-5xl font-serif text-white mb-6">
            Designed for every <br />
            modern dialect.
          </h2>
          <p className="text-zinc-500 font-medium">
            SynqDB isn&apos;t just a wrapper. We&apos;ve built native drivers
            for the 4 core database technologies in your stack.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-stretch">
          {/* Featured: PostgreSQL */}
          <div className="md:col-span-8 group relative overflow-hidden rounded-[2.5rem] bg-white/[0.02] border border-white/5 p-12 transition-all hover:border-primary/20 hover:bg-white/[0.03]">
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
                <Database className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-3xl font-bold text-white mb-4 italic font-serif">
                Deep {engines[0].name} Integration
              </h3>
              <p className="text-zinc-500 text-lg font-medium leading-relaxed group-hover:text-zinc-300 transition-colors">
                {engines[0].description}
              </p>

              <div className="mt-8 flex gap-4">
                <span className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[9px] font-black text-white uppercase tracking-widest">
                  JSONB Optimized
                </span>
                <span className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[9px] font-black text-white uppercase tracking-widest">
                  Extension Support
                </span>
              </div>
            </div>
          </div>

          {/* SQLite */}
          <div className="md:col-span-4 group relative overflow-hidden rounded-[2.5rem] bg-white/[0.02] border border-white/5 p-10 transition-all hover:border-primary/20 hover:bg-white/[0.03]">
            <div className="relative z-10">
              <div className="p-3 rounded-xl bg-white/5 border border-white/10 w-max mb-8 group-hover:scale-110 transition-transform">
                <Layers className="h-6 w-6 text-zinc-400" />
              </div>
              <NextImage
                src={engines[3].icon}
                alt=""
                width={40}
                height={40}
                className="mb-6 grayscale group-hover:grayscale-0 transition-all duration-500"
              />
              <h3 className="text-2xl font-bold text-white mb-4 italic font-serif">
                {engines[3].name}
              </h3>
              <p className="text-zinc-500 text-sm font-medium leading-relaxed group-hover:text-zinc-300 transition-colors">
                {engines[3].description}
              </p>
              <div className="mt-8 pt-8 border-t border-white/5">
                <span className="text-[9px] font-black text-primary/60 uppercase tracking-widest leading-none">
                  Zero-Config Persistence
                </span>
              </div>
            </div>
          </div>

          {/* MSSQL */}
          <div className="md:col-span-5 group relative overflow-hidden rounded-[2.5rem] bg-white/[0.02] border border-white/5 p-10 transition-all hover:border-primary/20 hover:bg-white/[0.03]">
            <div className="relative z-10">
              <NextImage
                src={engines[2].icon}
                alt=""
                width={48}
                height={48}
                className="mb-8 grayscale group-hover:grayscale-0 transition-all duration-500"
              />
              <h3 className="text-2xl font-bold text-white mb-4 italic font-serif">
                MSSQL Enterprise
              </h3>
              <p className="text-zinc-500 text-sm font-medium leading-relaxed group-hover:text-zinc-300 transition-colors">
                {engines[2].description}
              </p>

              <div className="mt-10 flex items-center justify-between border-t border-white/5 pt-6">
                <div className="flex -space-x-2">
                  {[1, 2, 3].map((i) => (
                    <div
                      key={i}
                      className="h-6 w-6 rounded-full bg-zinc-800 border border-background"
                    ></div>
                  ))}
                </div>
                <span className="text-[9px] font-black text-zinc-500 uppercase tracking-widest">
                  Dialect Specialized
                </span>
              </div>
            </div>
          </div>

          {/* MySQL */}
          <div className="md:col-span-7 group relative overflow-hidden rounded-[2.5rem] bg-white/[0.02] border border-white/5 p-10 transition-all hover:border-primary/20 hover:bg-white/[0.03]">
            <div className="relative z-10 flex flex-col md:flex-row gap-8 items-start md:items-center">
              <div className="flex-1">
                <NextImage
                  src={engines[1].icon}
                  alt=""
                  width={48}
                  height={48}
                  className="mb-8 grayscale group-hover:grayscale-0 transition-all duration-500"
                />
                <h3 className="text-2xl font-bold text-white mb-4 italic font-serif">
                  {engines[1].name} Production
                </h3>
                <p className="text-zinc-500 text-sm font-medium leading-relaxed group-hover:text-zinc-300 transition-colors">
                  {engines[1].description}
                </p>
              </div>

              <div className="w-full md:w-48 p-6 rounded-2xl bg-white/5 border border-white/10">
                <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden mb-4">
                  <motion.div
                    initial={{ width: 0 }}
                    whileInView={{ width: "85%" }}
                    transition={{ duration: 1.5, ease: "easeOut" }}
                    viewport={{ once: true }}
                    className="h-full bg-primary/40"
                  ></motion.div>
                </div>
                <span className="text-[9px] font-black text-zinc-500 uppercase tracking-widest block mb-1">
                  Throughput
                </span>
                <span className="text-lg font-bold text-white tracking-tighter">
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
