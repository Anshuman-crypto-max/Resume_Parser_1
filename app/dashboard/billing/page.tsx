import { PageShell } from "@/components/dashboard/page-shell";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function BillingPage() {
  return (
    <PageShell title="Billing" description="Stripe subscriptions, monthly and yearly plans, invoices, checkout, billing portal, free trial, and usage limits.">
      <div className="grid gap-4 md:grid-cols-3">{["Free", "Pro", "Business"].map((plan) => <Card key={plan}><CardHeader><CardTitle>{plan}</CardTitle></CardHeader><CardContent><p className="text-sm text-muted-foreground">Managed with Stripe checkout and billing portal.</p><Button className="mt-4">Manage</Button></CardContent></Card>)}</div>
    </PageShell>
  );
}
