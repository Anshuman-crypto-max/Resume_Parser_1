import { PageShell } from "@/components/dashboard/page-shell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function SettingsPage() {
  return (
    <PageShell title="Settings" description="Profile, theme, notifications, organization, API keys, and account deletion controls.">
      <Card><CardHeader><CardTitle>Organization profile</CardTitle></CardHeader><CardContent className="grid max-w-xl gap-3"><Input defaultValue="Talent Team" /><Input defaultValue="notifications@company.com" /><Button>Save changes</Button></CardContent></Card>
    </PageShell>
  );
}
