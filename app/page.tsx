"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { NavBar } from "@/components/NavBar";
import { ArrowRight, Sparkles, Shield, Zap } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen">
      <NavBar />
      <main className="flex min-h-screen flex-col items-center justify-center px-6 pt-16">
        <div className="mx-auto max-w-4xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-6"
          >
            <span className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary">
              <Sparkles className="h-4 w-4" />
              AI-Powered Assessment
            </span>
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="mb-4 text-5xl font-bold tracking-tight text-foreground md:text-7xl"
          >
            NexusBridge{" "}
            <span className="bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
              DX
            </span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mb-12 text-xl text-muted-foreground md:text-2xl"
          >
            AI-Accelerated Legacy Modernization Consulting Framework
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <Link href="/upload">
              <Button
                size="lg"
                className="group gap-2 px-8 py-6 text-lg shadow-xl shadow-primary/25 transition-all hover:scale-105 hover:shadow-2xl hover:shadow-primary/30"
              >
                Start Assessment
                <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
          </motion.div>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="mt-20 grid gap-8 md:grid-cols-3"
          >
            {[
              {
                icon: Zap,
                title: "DDR XML Analysis",
                desc: "Upload your Data Dictionary Report for instant AI-powered assessment",
              },
              {
                icon: Shield,
                title: "Risk Intelligence",
                desc: "Comprehensive scoring across technical debt, schema, and migration complexity",
              },
              {
                icon: Sparkles,
                title: "Strategic Roadmap",
                desc: "Executive-ready recommendations with ROI estimates and architecture blueprints",
              },
            ].map((item, i) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.6 + i * 0.1 }}
                className="rounded-xl border border-border/50 bg-muted/20 p-6 backdrop-blur-sm transition-all hover:border-primary/30 hover:bg-muted/40"
              >
                <item.icon className="mb-3 h-10 w-10 text-primary" />
                <h3 className="mb-2 font-semibold text-foreground">
                  {item.title}
                </h3>
                <p className="text-sm text-muted-foreground">{item.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </main>
      <div className="pointer-events-none fixed inset-0 bg-gradient-to-b from-primary/5 via-transparent to-background" />
    </div>
  );
}

