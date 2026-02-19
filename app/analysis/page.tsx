"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { NavBar } from "@/components/NavBar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AnimatedCounter } from "@/components/AnimatedCounter";
import { getScoreColor, getScoreBgColor } from "@/lib/utils";
import { MOCK_SCORES } from "@/lib/mockData";
import Link from "next/link";
import {
  AlertTriangle,
  Database,
  FileCode,
  GitBranch,
  ShieldAlert,
} from "lucide-react";

const scoreConfig = [
  {
    key: "technicalDebt" as const,
    label: "Technical Debt Score",
    icon: AlertTriangle,
    value: MOCK_SCORES.technicalDebt,
  },
  {
    key: "schemaComplexity" as const,
    label: "Schema Complexity",
    icon: Database,
    value: MOCK_SCORES.schemaComplexity,
  },
  {
    key: "scriptComplexity" as const,
    label: "Script Complexity",
    icon: FileCode,
    value: MOCK_SCORES.scriptComplexity,
  },
  {
    key: "migrationDifficulty" as const,
    label: "Migration Difficulty",
    icon: GitBranch,
    value: MOCK_SCORES.migrationDifficulty,
  },
  {
    key: "riskIndex" as const,
    label: "Risk Index",
    icon: ShieldAlert,
    value: MOCK_SCORES.riskIndex,
    badge: "High Risk",
  },
];

export default function AnalysisPage() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen">
      <NavBar />
      <main className="mx-auto max-w-6xl px-6 pt-24 pb-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="mb-2 text-3xl font-bold tracking-tight text-foreground">
            AI Analysis Results
          </h1>
          <p className="mb-10 text-muted-foreground">
            Comprehensive assessment scores from DDR analysis
          </p>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {scoreConfig.map((item, index) => (
              <motion.div
                key={item.key}
                initial={{ opacity: 0, y: 30 }}
                animate={
                  isVisible
                    ? { opacity: 1, y: 0 }
                    : { opacity: 0, y: 30 }
                }
                transition={{
                  duration: 0.5,
                  delay: index * 0.1,
                }}
              >
                <Card
                  className={`overflow-hidden transition-all duration-300 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5 ${getScoreBgColor(item.value)}`}
                >
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="flex items-center gap-2 text-base font-medium">
                      <item.icon className="h-5 w-5 text-primary" />
                      {item.label}
                    </CardTitle>
                    {item.badge && (
                      <span className="rounded-full bg-red-500/20 px-2 py-0.5 text-xs font-medium text-red-400">
                        {item.badge}
                      </span>
                    )}
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-baseline gap-1">
                      <AnimatedCounter
                        value={item.value}
                        duration={1.5}
                        className={`text-4xl font-bold ${getScoreColor(item.value)}`}
                      />
                      <span className="text-muted-foreground">/100</span>
                    </div>
                    <div className="mt-3 h-2 overflow-hidden rounded-full bg-muted">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${item.value}%` }}
                        transition={{
                          duration: 1.5,
                          delay: 0.3 + index * 0.1,
                          ease: "easeOut",
                        }}
                        className={`h-full rounded-full ${
                          item.value <= 40
                            ? "bg-emerald-500"
                            : item.value <= 70
                            ? "bg-amber-500"
                            : "bg-red-500"
                        }`}
                      />
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
          <motion.div
            initial={{ opacity: 0 }}
            animate={isVisible ? { opacity: 1 } : { opacity: 0 }}
            transition={{ delay: 0.8 }}
            className="mt-10 flex justify-center gap-4"
          >
            <Link href="/risk">
              <Button size="lg" className="gap-2">
                View Risk Visualization
              </Button>
            </Link>
            <Link href="/report">
              <Button variant="outline" size="lg" className="gap-2">
                Consulting Report
              </Button>
            </Link>
          </motion.div>
        </motion.div>
      </main>
    </div>
  );
}

