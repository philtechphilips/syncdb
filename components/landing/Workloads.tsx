"use client";

import React, { useState } from "react";
import { Database, Code2, Zap, Shield, ChevronRight } from "lucide-react";

export const Workloads = () => {
    const [activeTab, setActiveTab] = useState(0);

    const tabs = [
        {
            title: "PostgreSQL & MySQL",
            description: "High-performance management for your core production databases. Use Visual ER Diagrams to map complex relationships and AI to optimize query plans.",
            code: "SELECT u.name, o.total \nFROM users u \nJOIN orders o ON u.id = o.user_id \nWHERE o.status = 'shipped';",
            label: "Production SQL"
        },
        {
            title: "MSSQL & Enterprise",
            description: "First-class support for SQL Server. Visualize complex T-SQL schemas and use AI to translate or refactor legacy stored procedures safely.",
            code: "SELECT TOP 10 * FROM Employees\nWHERE DepartmentID = 5\nORDER BY HireDate DESC;",
            label: "Enterprise"
        },
        {
            title: "SQLite & Edge",
            description: "Manage local and edge databases with ease. Perfect for lightweight apps, testing environments, and distributed SQLite architectures like LiteFS.",
            code: "SELECT name FROM sqlite_master\nWHERE type='table' AND \nname NOT LIKE 'sqlite_%';",
            label: "Edge Data"
        }
    ];

    return (
        <section id="databases" className="py-32 bg-background relative border-t border-white/5">
            <div className="max-w-7xl mx-auto px-6">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-20 items-center">
                    <div className="lg:col-span-5">
                        <h2 className="text-4xl md:text-6xl font-serif text-white mb-8 leading-tight">One platform.<br />Any workload.</h2>
                        <p className="text-xl text-zinc-400 mb-12 font-medium">Stop switching tools. SynqDB provides a unified interface for every database in your stack, regardless of the data model.</p>

                        <div className="space-y-4">
                            {tabs.map((tab, i) => (
                                <button
                                    key={i}
                                    onClick={() => setActiveTab(i)}
                                    className={`w-full flex items-center justify-between p-6 rounded-xl border transition-all duration-300 ${activeTab === i
                                        ? "bg-primary/5 border-primary/20 text-white"
                                        : "bg-transparent border-white/5 text-zinc-500 hover:border-white/10"
                                        }`}
                                >
                                    <span className="text-xl font-bold">{tab.title}</span>
                                    {activeTab === i && <ChevronRight className="h-5 w-5 text-primary" />}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="lg:col-span-7">
                        <div className="relative">
                            {/* Decorative background for the code */}
                            <div className="absolute -inset-4 bg-primary/5 blur-3xl rounded-full opacity-50"></div>

                            <div className="relative rounded-2xl bg-[#021016] border border-white/10 overflow-hidden shadow-2xl">
                                <div className="bg-[#0c1c24] border-b border-white/5 p-4 flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="h-2 w-2 rounded-full bg-primary"></div>
                                        <span className="text-[10px] font-bold uppercase tracking-widest text-primary/60">{tabs[activeTab].label}</span>
                                    </div>
                                    <div className="text-[10px] font-mono text-zinc-600">query_editor.ts</div>
                                </div>
                                <div className="p-8 min-h-[300px] flex flex-col justify-center">
                                    <pre className="font-mono text-sm leading-relaxed overflow-x-auto">
                                        <code className="text-zinc-300">
                                            {tabs[activeTab].code.split('\n').map((line, i) => (
                                                <div key={i} className="flex gap-6">
                                                    <span className="text-zinc-800 w-4 text-right select-none">{i + 1}</span>
                                                    <span>{line}</span>
                                                </div>
                                            ))}
                                        </code>
                                    </pre>

                                    <div className="mt-12 pt-8 border-t border-white/5">
                                        <p className="text-zinc-500 text-sm font-medium leading-relaxed">
                                            {tabs[activeTab].description}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};
