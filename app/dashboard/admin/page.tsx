import { PageShell } from "@/components/dashboard/page-shell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function AdminPage() {
  return (
    <PageShell title="Admin Panel" description="Manage users, organizations, billing, API keys, logs, analytics, and feature flags.">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">{["Users", "Organizations", "Logs", "Feature flags"].map((item) => <Card key={item}><CardHeader><CardTitle>{item}</CardTitle></CardHeader><CardContent className="text-sm text-muted-foreground">Operational controls with RBAC and audit logging.</CardContent></Card>)}</div>
    </PageShell>
  );
}
