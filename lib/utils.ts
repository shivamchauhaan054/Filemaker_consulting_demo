import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getScoreColor(score: number): string {
  if (score <= 40) return "text-emerald-400";
  if (score <= 70) return "text-amber-400";
  return "text-red-400";
}

export function getScoreBgColor(score: number): string {
  if (score <= 40) return "bg-emerald-500/20 border-emerald-500/50";
  if (score <= 70) return "bg-amber-500/20 border-amber-500/50";
  return "bg-red-500/20 border-red-500/50";
}

export function getScoreGlowColor(score: number): string {
  if (score <= 40) return "shadow-emerald-500/20";
  if (score <= 70) return "shadow-amber-500/20";
  return "shadow-red-500/20";
}

