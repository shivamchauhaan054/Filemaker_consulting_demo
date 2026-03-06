"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { NavBar } from "@/components/NavBar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
  FileText,
  DollarSign,
  TrendingUp,
  Calendar,
  Lightbulb,
} from "lucide-react";
import { useDdrAnalytics } from "@/lib/useDdrAnalytics";

export default function ReportPage() {
  const [isVisible, setIsVisible] = useState(false);
  const { data } = useDdrAnalytics();

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const consulting = data?.consultingReport;

  return (
    <div className="min-h-screen">
      <NavBar />
      <main className="mx-auto max-w-4xl px-6 pt-24 pb-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="mb-2 text-3xl font-bold tracking-tight text-foreground">
            Consulting Output
          </h1>
          <p className="mb-10 text-muted-foreground">
            Executive-ready modernization recommendations
          </p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <Card className="mb-8">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-primary" />
                  Executive Summary
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {consulting?.executiveSummary.map((paragraph, i) => (
                  <motion.p
                    key={i}
                    initial={{ opacity: 0 }}
                    animate={isVisible ? { opacity: 1 } : { opacity: 0 }}
                    transition={{ delay: 0.2 + i * 0.15 }}
                    className="leading-relaxed text-muted-foreground"
                  >
                    {paragraph}
                  </motion.p>
                ))}
              </CardContent>
            </Card>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="mb-8 space-y-6"
          >
            <h2 className="flex items-center gap-2 text-xl font-semibold">
              <Lightbulb className="h-5 w-5 text-primary" />
              Modernization Recommendation
            </h2>
              <div className="space-y-6">
              {consulting?.recommendations.map((rec, i) => (
                <motion.div
                  key={rec.title}
                  initial={{ opacity: 0, x: -20 }}
                  animate={isVisible ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
                  transition={{ delay: 0.4 + i * 0.1 }}
                >
                  <Card className="border-primary/20 hover:border-primary/40">
                    <CardHeader>
                      <CardTitle className="text-lg">{rec.title}</CardTitle>
                      <p className="text-sm text-muted-foreground">
                        {rec.description}
                      </p>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2">
                        {rec.items.map((item, j) => (
                          <li
                            key={j}
                            className="flex items-start gap-2 text-sm text-muted-foreground"
                          >
                            <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-primary" />
                            {item}
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.5, delay: 0.6 }}
          >
            <Card className="overflow-hidden border-primary/30 bg-primary/5">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <DollarSign className="h-5 w-5 text-primary" />
                  ROI Estimate
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-6 md:grid-cols-3">
                  <div className="rounded-lg border border-border bg-muted/20 p-6">
                    <p className="mb-1 text-sm text-muted-foreground">
                      Estimated Migration Cost
                    </p>
                    <p className="text-2xl font-bold text-foreground">
                      $
                      {consulting?.roiEstimate.estimatedMigrationCost.toLocaleString()}
                    </p>
                  </div>
                  <div className="rounded-lg border border-border bg-muted/20 p-6">
                    <p className="mb-1 text-sm text-muted-foreground">
                      3-Year ROI
                    </p>
                    <p className="flex items-center gap-2 text-2xl font-bold text-emerald-400">
                      <TrendingUp className="h-6 w-6" />
                      {consulting?.roiEstimate.threeYearROI}%
                    </p>
                  </div>
                  <div className="rounded-lg border border-border bg-muted/20 p-6">
                    <p className="mb-1 text-sm text-muted-foreground">
                      Break-even
                    </p>
                    <p className="flex items-center gap-2 text-2xl font-bold text-foreground">
                      <Calendar className="h-6 w-6 text-primary" />
                      {consulting?.roiEstimate.breakEvenMonths} months
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
          <motion.div
            initial={{ opacity: 0 }}
            animate={isVisible ? { opacity: 1 } : { opacity: 0 }}
            transition={{ delay: 0.8 }}
            className="mt-10 flex justify-center"
          >
            <Link href="/architecture">
              <Button size="lg" className="gap-2">
                View Architecture Blueprint
              </Button>
            </Link>
          </motion.div>
        </motion.div>
      </main>
    </div>
  );
}

