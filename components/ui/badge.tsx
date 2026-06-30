import { cn } from "@/lib/utils";

type BadgeVariant = "default" | "secondary" | "outline";

const variants: Record<BadgeVariant, string> = {
  default: "border-primary/30 bg-primary text-primary-foreground",
  secondary: "border-border bg-muted text-muted-foreground",
  outline: "border-border bg-background text-foreground"
};

export function Badge({ className, children, variant = "outline" }: { className?: string; children: React.ReactNode; variant?: BadgeVariant }) {
  return <span className={cn("inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium", variants[variant], className)}>{children}</span>;
}
