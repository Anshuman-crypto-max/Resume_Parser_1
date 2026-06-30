import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatNumber(value: number) {
  return new Intl.NumberFormat("en", { maximumFractionDigits: 0 }).format(value);
}

export function formatDate(value: Date | string) {
  return new Intl.DateTimeFormat("en", { dateStyle: "medium" }).format(new Date(value));
}

export function safeJson<T>(value: unknown, fallback: T): T {
  try {
    return value as T;
  } catch {
    return fallback;
  }
}
