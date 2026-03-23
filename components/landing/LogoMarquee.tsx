"use client";

import React from "react";
import { motion } from "framer-motion";

const databases = [
  {
    name: "PostgreSQL",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/postgresql/postgresql-original.svg",
  },
  {
    name: "MySQL",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mysql/mysql-original.svg",
  },
  {
    name: "MSSQL Server",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/microsoftsqlserver/microsoftsqlserver-plain.svg",
  },
  {
    name: "SQLite",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/sqlite/sqlite-original.svg",
  },
  {
    name: "PostgreSQL",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/postgresql/postgresql-original.svg",
  },
  {
    name: "MySQL",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mysql/mysql-original.svg",
  },
  {
    name: "MSSQL Server",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/microsoftsqlserver/microsoftsqlserver-plain.svg",
  },
  {
    name: "SQLite",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/sqlite/sqlite-original.svg",
  },
];

export const LogoMarquee = () => {
  const row2 = [
    {
      name: "MariaDB",
      icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mariadb/mariadb-original.svg",
    },
    {
      name: "Oracle",
      icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/oracle/oracle-original.svg",
    },
    {
      name: "Snowflake",
      icon: "https://raw.githubusercontent.com/devicons/devicon/master/icons/snowflake/snowflake-original.svg",
    },
    {
      name: "Redis",
      icon: "https://raw.githubusercontent.com/devicons/devicon/master/icons/redis/redis-original.svg",
    },
    {
      name: "MariaDB",
      icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mariadb/mariadb-original.svg",
    },
    {
      name: "Oracle",
      icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/oracle/oracle-original.svg",
    },
    {
      name: "Snowflake",
      icon: "https://raw.githubusercontent.com/devicons/devicon/master/icons/snowflake/snowflake-original.svg",
    },
    {
      name: "Redis",
      icon: "https://raw.githubusercontent.com/devicons/devicon/master/icons/redis/redis-original.svg",
    },
  ];

  return (
    <div className="w-full py-20 overflow-hidden relative">
      <div className="absolute inset-y-0 left-0 w-40 bg-gradient-to-r from-background to-transparent z-10"></div>
      <div className="absolute inset-y-0 right-0 w-40 bg-gradient-to-l from-background to-transparent z-10"></div>

      <div className="flex flex-col items-center mb-12">
        <span className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.4em] mb-4 text-center">
          Engine Interoperability
        </span>
        <div className="h-px w-12 bg-primary/30"></div>
      </div>

      <div className="flex flex-col gap-8">
        {/* Row 1: Left to Right */}
        <div className="flex overflow-hidden group">
          <motion.div
            animate={{ x: ["-50%", "0%"] }}
            transition={{
              duration: 40,
              repeat: Infinity,
              ease: "linear",
            }}
            className="flex items-center gap-12 whitespace-nowrap"
          >
            {[...databases, ...databases].map((db, i) => (
              <div
                key={i}
                className="flex items-center gap-4 px-8 py-4 rounded-2xl bg-white/[0.02] border border-white/5 hover:bg-white/[0.04] hover:border-white/10 transition-all group/logo cursor-default"
              >
                <img
                  src={db.icon}
                  alt={db.name}
                  className="h-6 w-6 grayscale group-hover/logo:grayscale-0 transition-all duration-500 opacity-40 group-hover/logo:opacity-100"
                />
                <span className="text-xl font-serif text-zinc-600 group-hover/logo:text-white transition-colors">
                  {db.name}
                </span>
              </div>
            ))}
          </motion.div>
        </div>

        {/* Row 2: Right to Left */}
        <div className="flex overflow-hidden group">
          <motion.div
            animate={{ x: ["0%", "-50%"] }}
            transition={{
              duration: 50,
              repeat: Infinity,
              ease: "linear",
            }}
            className="flex items-center gap-12 whitespace-nowrap"
          >
            {[...row2, ...row2].map((db, i) => (
              <div
                key={i}
                className="flex items-center gap-4 px-8 py-4 rounded-2xl bg-white/[0.02] border border-white/5 hover:bg-white/[0.04] hover:border-white/10 transition-all group/logo cursor-default"
              >
                <img
                  src={db.icon}
                  alt={db.name}
                  className="h-6 w-6 grayscale group-hover/logo:grayscale-0 transition-all duration-500 opacity-40 group-hover/logo:opacity-100"
                />
                <span className="text-xl font-serif text-zinc-600 group-hover/logo:text-white transition-colors">
                  {db.name}
                </span>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </div>
  );
};
