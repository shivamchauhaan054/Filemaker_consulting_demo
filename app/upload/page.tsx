"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { NavBar } from "@/components/NavBar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileCode, Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import type { DdrAnalyticsResponse } from "@/types";

export default function UploadPage() {
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      const file = e.dataTransfer.files[0];
      if (file && (file.name.endsWith(".xml") || file.type === "text/xml")) {
        void processFile(file);
      } else {
        setError("Please upload a valid DDR XML (.xml) file.");
      }
    },
    []
  );

  const handleFileInput = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
        void processFile(file);
      }
    },
    []
  );

  const processFile = async (file: File) => {
    setFileName(file.name);
    setIsProcessing(true);
    setIsComplete(false);
    setError(null);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/upload-ddr", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const payload = (await res.json().catch(() => null)) as
          | { error?: string }
          | null;
        const message =
          payload?.error ??
          (res.status === 413
            ? "File is too large for this demo. Please upload a smaller DDR export."
            : "Failed to analyze DDR XML.");
        setError(message);
        setIsProcessing(false);
        return;
      }

      const analytics = (await res.json()) as DdrAnalyticsResponse;
      if (typeof window !== "undefined") {
        window.sessionStorage.setItem("ddrAnalytics", JSON.stringify(analytics));
      }

      setIsProcessing(false);
      setIsComplete(true);

      setTimeout(() => {
        router.push("/analysis");
      }, 800);
    } catch (err) {
      console.error(err);
      setError("Unexpected error while uploading or analyzing DDR.");
      setIsProcessing(false);
    }
  };

  const handleContinue = () => {
    router.push("/analysis");
  };

  return (
    <div className="min-h-screen">
      <NavBar />
      <main className="mx-auto max-w-3xl px-6 pt-24 pb-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="mb-2 text-3xl font-bold tracking-tight text-foreground">
            DDR XML Upload
          </h1>
          <p className="mb-8 text-muted-foreground">
            Upload your FileMaker Data Dictionary Report (DDR) for AI analysis
          </p>
          {error && (
            <div className="mb-4 flex items-start gap-2 rounded-md border border-red-500/50 bg-red-500/10 px-3 py-2 text-sm text-red-300">
              <AlertCircle className="mt-0.5 h-4 w-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}
          <Card
            className={`overflow-hidden transition-all duration-300 ${
              isDragging ? "border-primary ring-2 ring-primary/30" : ""
            } ${isProcessing ? "pointer-events-none" : ""}`}
          >
            <CardContent className="p-0">
              <AnimatePresence mode="wait">
                {!isProcessing && !isComplete && (
                  <motion.div
                    key="upload"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    className="cursor-pointer p-12"
                  >
                    <label className="flex cursor-pointer flex-col items-center gap-4">
                      <div
                        className={`rounded-full p-6 transition-all ${
                          isDragging ? "bg-primary/20" : "bg-muted"
                        }`}
                      >
                        <FileCode className="h-16 w-16 text-primary" />
                      </div>
                      <div className="text-center">
                        <p className="font-medium text-foreground">
                          Drag & drop your DDR XML file here
                        </p>
                        <p className="mt-1 text-sm text-muted-foreground">
                          or click to browse (accepts .xml)
                        </p>
                      </div>
                      <input
                        type="file"
                        accept=".xml,text/xml"
                        onChange={handleFileInput}
                        className="hidden"
                      />
                    </label>
                  </motion.div>
                )}
                {isProcessing && (
                  <motion.div
                    key="processing"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex flex-col items-center gap-6 p-12"
                  >
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "linear",
                      }}
                      className="rounded-full border-2 border-primary/30 border-t-primary p-4"
                    >
                      <Loader2 className="h-12 w-12 text-primary" />
                    </motion.div>
                    <div className="text-center">
                      <p className="font-semibold text-foreground">
                        AI Analysis in Progress
                      </p>
                      <p className="mt-1 text-sm text-muted-foreground">
                        Analyzing {fileName || "DDR report"}...
                      </p>
                      <div className="mt-4 flex justify-center gap-1">
                        {[0, 1, 2, 3].map((i) => (
                          <motion.span
                            key={i}
                            className="h-2 w-2 rounded-full bg-primary"
                            animate={{
                              scale: [1, 1.2, 1],
                              opacity: [0.5, 1, 0.5],
                            }}
                            transition={{
                              duration: 0.8,
                              repeat: Infinity,
                              delay: i * 0.2,
                            }}
                          />
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}
                {isComplete && (
                  <motion.div
                    key="complete"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex flex-col items-center gap-6 p-12"
                  >
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{
                        type: "spring",
                        stiffness: 200,
                        damping: 15,
                      }}
                      className="rounded-full bg-emerald-500/20 p-4"
                    >
                      <CheckCircle2 className="h-16 w-16 text-emerald-400" />
                    </motion.div>
                    <div className="text-center">
                      <p className="text-lg font-semibold text-foreground">
                        Analysis Complete
                      </p>
                      <p className="mt-1 text-sm text-muted-foreground">
                        Your DDR has been processed successfully
                      </p>
                    </div>
                    <Button
                      size="lg"
                      onClick={handleContinue}
                      className="mt-4 gap-2"
                    >
                      View Results
                    </Button>
                  </motion.div>
                )}
              </AnimatePresence>
            </CardContent>
          </Card>
        </motion.div>
      </main>
    </div>
  );
}

