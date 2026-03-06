"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { NavBar } from "@/components/NavBar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Network } from "lucide-react";
import { useDdrAnalytics } from "@/lib/useDdrAnalytics";

export default function ArchitecturePage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [svgContent, setSvgContent] = useState<string>("");
  const [isVisible, setIsVisible] = useState(false);
  const { data } = useDdrAnalytics();

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const renderMermaid = async () => {
      try {
        const mermaid = (await import("mermaid")).default;
        mermaid.initialize({
          startOnLoad: false,
          theme: "dark",
          themeVariables: {
            primaryColor: "#6366f1",
            primaryTextColor: "#e2e8f0",
            primaryBorderColor: "#6366f1",
            lineColor: "#94a3b8",
            secondaryColor: "#1e293b",
            tertiaryColor: "#0f172a",
            background: "#0f172a",
            mainBkg: "#1e293b",
            nodeBorder: "#6366f1",
            clusterBkg: "#1e293b",
            clusterBorder: "#6366f1",
            titleColor: "#f1f5f9",
            edgeLabelBackground: "#1e293b",
            nodeTextColor: "#e2e8f0",
            fontFamily: "Inter, system-ui, sans-serif",
          },
        });
        const id = "mermaid-" + Date.now();
        const source = data?.architectureDiagram ?? "graph TD; A[DDR]-->B[Analysis];";
        const { svg } = await mermaid.render(id, source);
        setSvgContent(svg);
      } catch (err) {
        setSvgContent(
          '<div class="flex items-center justify-center p-12 text-muted-foreground">Diagram rendering...</div>'
        );
      }
    };
    renderMermaid();
  }, []);

  return (
    <div className="min-h-screen">
      <NavBar />
      <main className="mx-auto max-w-5xl px-6 pt-24 pb-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="mb-2 text-3xl font-bold tracking-tight text-foreground">
            Architecture Blueprint
          </h1>
          <p className="mb-10 text-muted-foreground">
            Proposed modernization architecture visualization
          </p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Card className="overflow-hidden">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Network className="h-5 w-5 text-primary" />
                  Target Architecture
                </CardTitle>
                <p className="text-sm text-muted-foreground">
                  Legacy FileMaker → AI Analysis → API Layer → Cloud (AWS)
                </p>
              </CardHeader>
              <CardContent>
                <div
                  ref={containerRef}
                  className="flex min-h-[400px] items-center justify-center rounded-lg border border-border bg-muted/20 p-8"
                >
                  {svgContent ? (
                    <div
                      className="mermaid-diagram [&_svg]:max-w-full [&_svg]:h-auto"
                      dangerouslySetInnerHTML={{ __html: svgContent }}
                    />
                  ) : (
                    <div className="flex flex-col items-center gap-4">
                      <div className="h-12 w-12 animate-spin rounded-full border-2 border-primary/30 border-t-primary" />
                      <p className="text-muted-foreground">
                        Rendering diagram...
                      </p>
                    </div>
                  )}
                </div>
                <div className="mt-6 rounded-lg border border-border bg-muted/10 p-4 font-mono text-sm text-muted-foreground">
                  <pre className="overflow-x-auto whitespace-pre-wrap break-words">
                    {data?.architectureDiagram ??
                      "graph TD; A[DDR]-->B[Analysis];"}
                  </pre>
                </div>
              </CardContent>
            </Card>
          </motion.div>
          <motion.div
            initial={{ opacity: 0 }}
            animate={isVisible ? { opacity: 1 } : { opacity: 0 }}
            transition={{ delay: 0.5 }}
            className="mt-10 flex justify-center gap-4"
          >
            <Link href="/">
              <Button variant="outline" size="lg">
                Back to Home
              </Button>
            </Link>
            <Link href="/upload">
              <Button size="lg">
                New Assessment
              </Button>
            </Link>
          </motion.div>
        </motion.div>
      </main>
    </div>
  );
}

