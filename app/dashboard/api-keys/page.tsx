import { KeyRound } from "lucide-react";
import { PageShell } from "@/components/dashboard/page-shell";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function ApiKeysPage() {
  return (
    <PageShell title="API Keys" description="Create, rotate, revoke, and audit REST API credentials for resume upload, parsing, search, and analytics." action={<Button><KeyRound size={16} /> New key</Button>}>
      <Card><CardContent className="p-5 text-sm text-muted-foreground">Keys are stored hashed with prefixes, last-used timestamps, expiry, and audit events.</CardContent></Card>
    </PageShell>
  );
}
