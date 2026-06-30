export type Tone = "neutral" | "success" | "warning" | "danger";

export const toneClasses: Record<Tone, string> = {
  neutral: "border-border bg-card text-card-foreground",
  success: "border-emerald-200 bg-emerald-50 text-emerald-950",
  warning: "border-amber-200 bg-amber-50 text-amber-950",
  danger: "border-red-200 bg-red-50 text-red-950"
};
