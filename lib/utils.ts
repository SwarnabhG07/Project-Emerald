import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Merges Tailwind class names, resolving conflicts (last one wins).
 * Used by all shadcn/ui-style components.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Parses a numeric input string, preserving 0.
 * (`parseInt(x) || undefined` treats 0 as falsy and drops it.)
 */
export function parseNumberInput(value: string): number | undefined {
  const trimmed = value.trim();
  if (trimmed === "") return undefined; // Number("") === 0, so check first
  const n = Number(trimmed);
  return Number.isFinite(n) ? n : undefined;
}