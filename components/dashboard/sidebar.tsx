import Link from "next/link";
import { BarChart3, CreditCard, FileSearch, Gauge, GitCompare, KeyRound, LayoutDashboard, Settings, Shield, UploadCloud, UserCircle, Users } from "lucide-react";
import { UserButton, OrganizationSwitcher } from "@clerk/nextjs";

const nav = [
  ["/dashboard", "Dashboard", LayoutDashboard],
  ["/dashboard/candidates", "Candidates", Users],
  ["/dashboard/upload", "Resume Upload", UploadCloud],
  ["/dashboard/compare", "Resume Compare", GitCompare],
  ["/dashboard/ats", "ATS Analyzer", Gauge],
  ["/dashboard/analytics", "Analytics", BarChart3],
  ["/dashboard/api-keys", "API Keys", KeyRound],
  ["/dashboard/usage", "Usage", BarChart3],
  ["/dashboard/profile", "Profile", UserCircle],
  ["/dashboard/billing", "Billing", CreditCard],
  ["/dashboard/settings", "Settings", Settings],
  ["/dashboard/admin", "Admin", Shield]
] as const;

export function Sidebar() {
  return (
    <aside className="hidden min-h-screen w-64 border-r bg-card/80 p-4 lg:block">
      <Link href="/dashboard" className="mb-6 flex items-center gap-2 font-semibold">
        <span className="flex h-8 w-8 items-center justify-center rounded-md bg-primary text-primary-foreground"><FileSearch size={18} /></span>
        Resume Parser
      </Link>
      <div className="mb-5"><OrganizationSwitcher hidePersonal /></div>
      <nav className="grid gap-1">
        {nav.map(([href, label, Icon]) => (
          <Link key={href} href={href} className="flex items-center gap-3 rounded-md px-3 py-2 text-sm text-muted-foreground transition hover:bg-muted hover:text-foreground">
            <Icon size={17} /> {label}
          </Link>
        ))}
      </nav>
      <div className="fixed bottom-4 flex items-center gap-3">
        <UserButton afterSignOutUrl="/" />
        <span className="text-sm text-muted-foreground">Workspace</span>
      </div>
    </aside>
  );
}
