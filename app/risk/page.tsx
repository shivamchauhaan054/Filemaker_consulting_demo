"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
import { NavBar } from "@/components/NavBar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MOCK_RADAR_DATA, MOCK_BAR_DATA } from "@/lib/mockData";
import { AlertTriangle, Activity } from "lucide-react";

const riskLevels = [
  { level: "Low", range: "0-40", color: "bg-emerald-500", label: "Low Risk" },
  {
    level: "Medium",
    range: "41-70",
    color: "bg-amber-500",
    label: "Medium Risk",
  },
  { level: "High", range: "71-100", color: "bg-red-500", label: "High Risk" },
];

export default function RiskPage() {
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
            Risk Visualization
          </h1>
          <p className="mb-10 text-muted-foreground">
            Multi-dimensional risk assessment across key metrics
          </p>
          <div className="grid gap-8 lg:grid-cols-2">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={isVisible ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Card className="overflow-hidden">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Activity className="h-5 w-5 text-primary" />
                    Radar Chart
                  </CardTitle>
                  <p className="text-sm text-muted-foreground">
                    Comparative view across all assessment dimensions
                  </p>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <RadarChart data={MOCK_RADAR_DATA}>
                        <PolarGrid stroke="hsl(217, 33%, 30%)" />
                        <PolarAngleAxis
                          dataKey="subject"
                          tick={{ fill: "hsl(215, 20%, 65%)", fontSize: 12 }}
                        />
                        <PolarRadiusAxis
                          angle={30}
                          domain={[0, 100]}
                          tick={{ fill: "hsl(215, 20%, 65%)" }}
                        />
                        <Radar
                          name="Score"
                          dataKey="value"
                          stroke="hsl(263, 70%, 58%)"
                          fill="hsl(263, 70%, 58%)"
                          fillOpacity={0.3}
                          strokeWidth={2}
                        />
                      </RadarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={isVisible ? { opacity: 1, x: 0 } : { opacity: 0, x: 20 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <Card className="overflow-hidden">
                <CardHeader>
                  <CardTitle>Bar Chart</CardTitle>
                  <p className="text-sm text-muted-foreground">
                    Individual metric scores
                  </p>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={MOCK_BAR_DATA} layout="vertical" margin={{ left: 20 }}>
                        <CartesianGrid
                          strokeDasharray="3 3"
                          stroke="hsl(217, 33%, 20%)"
                        />
                        <XAxis
                          type="number"
                          domain={[0, 100]}
                          tick={{ fill: "hsl(215, 20%, 65%)" }}
                        />
                        <YAxis
                          type="category"
                          dataKey="name"
                          width={120}
                          tick={{ fill: "hsl(215, 20%, 65%)", fontSize: 11 }}
                        />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: "hsl(217, 33%, 17%)",
                            border: "1px solid hsl(217, 33%, 25%)",
                            borderRadius: "8px",
                          }}
                          labelStyle={{ color: "hsl(210, 40%, 98%)" }}
                        />
                        <Bar dataKey="value" name="Score" radius={[0, 4, 4, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="mt-8"
          >
            <Card className="overflow-hidden border-amber-500/30 bg-amber-500/5">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-amber-400">
                  <AlertTriangle className="h-5 w-5" />
                  Risk Heat Indicator
                </CardTitle>
                <p className="text-sm text-muted-foreground">
                  Current assessment: High Risk (74/100)
                </p>
              </CardHeader>
              <CardContent>
                <div className="flex gap-4">
                  {riskLevels.map((r) => (
                    <div
                      key={r.level}
                      className={`flex flex-1 items-center gap-3 rounded-lg border p-4 ${
                        r.level === "High"
                          ? "border-red-500/50 bg-red-500/10"
                          : "border-border bg-muted/20"
                      }`}
                    >
                      <div
                        className={`h-4 w-4 rounded-full ${r.color} ${
                          r.level === "High" ? "animate-pulse" : ""
                        }`}
                      />
                      <div>
                        <p
                          className={`font-medium ${
                            r.level === "High"
                              ? "text-red-400"
                              : "text-muted-foreground"
                          }`}
                        >
                          {r.label}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Score range: {r.range}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>
      </main>
    </div>
  );
}

