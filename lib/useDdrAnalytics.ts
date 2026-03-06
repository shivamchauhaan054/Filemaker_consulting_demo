"use client";

import { useEffect, useState } from "react";
import type { DdrAnalyticsResponse } from "@/types";

export function useDdrAnalytics() {
  const [data, setData] = useState<DdrAnalyticsResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const stored = typeof window !== "undefined"
        ? window.sessionStorage.getItem("ddrAnalytics")
        : null;
      if (stored) {
        setData(JSON.parse(stored) as DdrAnalyticsResponse);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  return { data, loading };
}

