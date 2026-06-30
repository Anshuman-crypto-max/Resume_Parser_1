import { UserProfile } from "@clerk/nextjs";
import { PageShell } from "@/components/dashboard/page-shell";

export default function ProfilePage() {
  return (
    <PageShell title="Profile" description="Manage your account, authentication methods, sessions, and notification identity.">
      <UserProfile routing="hash" />
    </PageShell>
  );
}
