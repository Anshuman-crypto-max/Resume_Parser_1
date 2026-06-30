import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function StatCard({ label, value, hint }: { label: string; value: string; hint: string }) {
  return (
    <Card>
      <CardHeader><CardTitle className="text-sm text-muted-foreground">{label}</CardTitle></CardHeader>
      <CardContent>
        <div className="text-3xl font-semibold">{value}</div>
        <p className="mt-2 text-xs text-muted-foreground">{hint}</p>
      </CardContent>
    </Card>
  );
}
