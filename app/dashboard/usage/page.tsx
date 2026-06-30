import { PageShell } from "@/components/dashboard/page-shell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

export default function UsagePage() {
  return (
    <PageShell title="Usage" description="Track parsing volume, API requests, ATS analyses, storage, and plan limits.">
      <div className="grid gap-4 md:grid-cols-3">
        {[
          ["Resume parses", 64],
          ["API requests", 42],
          ["Storage", 18]
        ].map(([label, value]) => (
          <Card key={label as string}>
            <CardHeader><CardTitle>{label}</CardTitle></CardHeader>
            <CardContent><Progress value={value as number} /><p className="mt-3 text-sm text-muted-foreground">{value}% of monthly allowance used.</p></CardContent>
          </Card>
        ))}
      </div>
    </PageShell>
  );
}
