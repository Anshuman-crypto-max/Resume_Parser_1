import { PageShell } from "@/components/dashboard/page-shell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function AdminPage() {
  const controls = [
    ["Users", "1,284", "Invite, suspend, role changes, organization ownership", "Healthy"],
    ["Organizations", "84", "Workspace limits, storage allocation, billing state", "Review"],
    ["Logs", "42k", "Audit events, upload activity, API-key activity", "Live"],
    ["Feature flags", "16", "AI parser versioning, beta analytics, exports", "Managed"]
  ];
  const usage = [
    ["Storage", "72%", "12.8 GB used"],
    ["API usage", "64%", "128k calls this month"],
    ["OpenAI spend", "48%", "$2,840 projected"],
    ["Queue health", "99%", "Celery workers online"]
  ];

  return (
    <PageShell
      title="Admin Panel"
      description="Manage users, organizations, billing, API keys, logs, analytics, storage, and feature flags."
      action={<Button>Invite teammate</Button>}
    >
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {controls.map(([item, count, body, state]) => (
          <Card key={item}>
            <CardHeader>
              <div className="flex items-center justify-between gap-3">
                <CardTitle>{item}</CardTitle>
                <Badge variant={state === "Review" ? "default" : "secondary"}>{state}</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-semibold">{count}</p>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">{body}</p>
            </CardContent>
          </Card>
        ))}
      </div>
      <div className="mt-4 grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
        <Card>
          <CardHeader><CardTitle>Operational Usage</CardTitle></CardHeader>
          <CardContent className="grid gap-4">
            {usage.map(([label, value, detail]) => (
              <div key={label} className="rounded-md border bg-background/70 p-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium">{label}</span>
                  <span className="text-muted-foreground">{value}</span>
                </div>
                <div className="mt-3 h-2 overflow-hidden rounded-full bg-muted">
                  <div className="h-full rounded-full bg-primary" style={{ width: value }} />
                </div>
                <p className="mt-2 text-xs text-muted-foreground">{detail}</p>
              </div>
            ))}
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Security Review</CardTitle></CardHeader>
          <CardContent className="grid gap-3 text-sm">
            {["JWT sessions enforced", "RBAC applied to admin actions", "API keys hashed at rest", "Audit logs retained for compliance", "CORS and rate limits configured"].map((item) => (
              <div key={item} className="flex items-center justify-between rounded-md border bg-background/70 p-3">
                <span>{item}</span>
                <Badge variant="secondary">Enabled</Badge>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </PageShell>
  );
}
