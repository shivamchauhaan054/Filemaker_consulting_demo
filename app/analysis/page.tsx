"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { NavBar } from "@/components/NavBar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AnimatedCounter } from "@/components/AnimatedCounter";
import { getScoreColor, getScoreBgColor } from "@/lib/utils";
import Link from "next/link";
import {
  AlertTriangle,
  Database,
  FileCode,
  GitBranch,
  ShieldAlert,
  Download,
} from "lucide-react";
import { useDdrAnalytics } from "@/lib/useDdrAnalytics";

const scoreConfig = [
  {
    key: "technicalDebt" as const,
    label: "Technical Debt Score",
    icon: AlertTriangle,
  },
  {
    key: "schemaComplexity" as const,
    label: "Schema Complexity",
    icon: Database,
  },
  {
    key: "scriptComplexity" as const,
    label: "Script Complexity",
    icon: FileCode,
  },
  {
    key: "migrationDifficulty" as const,
    label: "Migration Difficulty",
    icon: GitBranch,
  },
  {
    key: "riskIndex" as const,
    label: "Risk Index",
    icon: ShieldAlert,
  },
] as const;

export default function AnalysisPage() {
  const [isVisible, setIsVisible] = useState(false);
  const { data, loading } = useDdrAnalytics();

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
            Comprehensive assessment scores from your uploaded DDR XML
          </p>
          {!loading && !data && (
            <div className="mb-8 rounded-md border border-amber-500/40 bg-amber-500/10 px-3 py-2 text-sm text-amber-200">
              No analysis found. Please upload a DDR XML file first on the
              upload page.
            </div>
          )}
          {data?.fileName && (
            <div className="mb-6 space-y-2 text-sm text-muted-foreground">
              <p>
                File analyzed:{" "}
                <span className="font-mono text-foreground">
                  {data.fileName}
                </span>
              </p>
            </div>
          )}
          {data && (
            <div className="mb-8 grid gap-4 md:grid-cols-3">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">
                    Total Tables
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-semibold text-foreground">
                    {data.totals.totalTables}
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">
                    Total Fields
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-semibold text-foreground">
                    {data.totals.totalFields}
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">
                    Total Relationships
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-semibold text-foreground">
                    {data.totals.totalRelationships}
                  </p>
                </CardContent>
              </Card>
            </div>
          )}
          {data && (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {scoreConfig.map((item, index) => {
                const value = data.scores[item.key];
                const isHighRisk =
                  item.key === "riskIndex" && value >= 70 ? "High Risk" : undefined;
                const Icon = item.icon;
                return (
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
                  className={`overflow-hidden transition-all duration-300 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5 ${getScoreBgColor(
                    value
                  )}`}
                >
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="flex items-center gap-2 text-base font-medium">
                      <Icon className="h-5 w-5 text-primary" />
                      {item.label}
                    </CardTitle>
                    {isHighRisk && (
                      <span className="rounded-full bg-red-500/20 px-2 py-0.5 text-xs font-medium text-red-400">
                        {isHighRisk}
                      </span>
                    )}
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-baseline gap-1">
                      <AnimatedCounter
                        value={value}
                        duration={1.5}
                        className={`text-4xl font-bold ${getScoreColor(value)}`}
                      />
                      <span className="text-muted-foreground">/100</span>
                    </div>
                    <div className="mt-3 h-2 overflow-hidden rounded-full bg-muted">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${value}%` }}
                        transition={{
                          duration: 1.5,
                          delay: 0.3 + index * 0.1,
                          ease: "easeOut",
                        }}
                        className={`h-full rounded-full ${
                          value <= 40
                            ? "bg-emerald-500"
                            : value <= 70
                            ? "bg-amber-500"
                            : "bg-red-500"
                        }`}
                      />
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
              );
              })}
            </div>
          )}
          <motion.div
            initial={{ opacity: 0 }}
            animate={isVisible ? { opacity: 1 } : { opacity: 0 }}
            transition={{ delay: 0.8 }}
            className="mt-10 flex flex-wrap justify-center gap-4"
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
            {data && (
              <Button
                type="button"
                variant="outline"
                size="lg"
                className="gap-2"
                onClick={() => {
                  const lines: string[] = [];
                  lines.push("NexusBridge DX - DDR Analysis Report");
                  lines.push("");
                  lines.push(`File: ${data.fileName}`);
                  lines.push("");
                  lines.push("Schema Overview");
                  lines.push(
                    `- Tables: ${data.totals.totalTables}`,
                  );
                  lines.push(
                    `- Fields: ${data.totals.totalFields}`,
                  );
                  lines.push(
                    `- Relationships: ${data.totals.totalRelationships}`,
                  );
                  lines.push(
                    `- Scripts: ${data.totals.totalScripts}`,
                  );
                  lines.push(
                    `- Layouts: ${data.totals.totalLayouts}`,
                  );
                  lines.push(
                    `- Value Lists: ${data.totals.totalValueLists}`,
                  );
                  lines.push(
                    `- Custom Functions: ${data.totals.totalCustomFunctions}`,
                  );
                  lines.push("");
                  lines.push("Scores (0–100)");
                  lines.push(
                    `- Technical Debt: ${data.scores.technicalDebt}`,
                  );
                  lines.push(
                    `- Schema Complexity: ${data.scores.schemaComplexity}`,
                  );
                  lines.push(
                    `- Script Complexity: ${data.scores.scriptComplexity}`,
                  );
                  lines.push(
                    `- Migration Difficulty: ${data.scores.migrationDifficulty}`,
                  );
                  lines.push(
                    `- Risk Index: ${data.scores.riskIndex}`,
                  );
                  lines.push("");
                  lines.push("Executive Summary");
                  data.consultingReport.executiveSummary.forEach((p) => {
                    lines.push("");
                    lines.push(p);
                  });

                  const blob = new Blob([lines.join("\n")], {
                    type: "text/plain;charset=utf-8",
                  });
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement("a");
                  const safeName =
                    data.fileName.replace(/[^a-z0-9\-_.]/gi, "_") ||
                    "ddr-report";
                  a.href = url;
                  a.download = `${safeName}-analysis.txt`;
                  document.body.appendChild(a);
                  a.click();
                  a.remove();
                  URL.revokeObjectURL(url);
                }}
              >
                <Download className="h-5 w-5" />
                Download Client Report
              </Button>
            )}
          </motion.div>
        </motion.div>
      </main>
    </div>
  );
}

