import { PageShell } from "@/components/dashboard/page-shell";
import { StatCard } from "@/components/dashboard/stat-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

export default function DashboardPage() {
  return (
    <PageShell title="Dashboard" description="Your recruiting command center for parsing, search, scoring, and usage.">
      <div className="grid gap-4 md:grid-cols-4">
        <StatCard label="Candidates" value="1,248" hint="+18% this month" />
        <StatCard label="Parsed resumes" value="3,904" hint="99.2% success rate" />
        <StatCard label="Avg ATS score" value="78" hint="+6 points this week" />
        <StatCard label="API usage" value="64%" hint="12,820 requests" />
      </div>
      <div className="mt-4 grid gap-4 lg:grid-cols-[1.4fr_1fr]">
        <Card>
          <CardHeader><CardTitle>Hiring funnel</CardTitle></CardHeader>
          <CardContent className="grid gap-4">
            {["Parsed", "Reviewed", "Shortlisted", "Interviewing", "Offer"].map((stage, index) => (
              <div key={stage}>
                <div className="mb-2 flex justify-between text-sm"><span>{stage}</span><span>{92 - index * 13}%</span></div>
                <Progress value={92 - index * 13} />
              </div>
            ))}
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Top skills</CardTitle></CardHeader>
          <CardContent className="flex flex-wrap gap-2 text-sm">
            {["Python", "React", "SQL", "AWS", "Product Strategy", "NLP", "Salesforce", "Figma"].map((skill) => (
              <span key={skill} className="rounded-full border bg-muted px-3 py-1">{skill}</span>
            ))}
          </CardContent>
        </Card>
      </div>
    </PageShell>
  );
}
