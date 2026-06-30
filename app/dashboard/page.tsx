import { PageShell } from "@/components/dashboard/page-shell";
import { StatCard } from "@/components/dashboard/stat-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";

export default function DashboardPage() {
  const interviews = [
    ["Maya Chen", "Design systems", "Today 2:30 PM"],
    ["Aarav Mehta", "ML platform", "Tomorrow 11:00 AM"],
    ["Nina Patel", "Data analytics", "Fri 4:00 PM"]
  ];

  return (
    <PageShell title="Dashboard" description="Your recruiting command center for parsing, search, scoring, and usage.">
      <div className="grid gap-4 md:grid-cols-4">
        <StatCard label="Candidates" value="1,248" hint="+18% this month" />
        <StatCard label="Parsed resumes" value="3,904" hint="99.2% success rate" />
        <StatCard label="Avg ATS score" value="78" hint="+6 points this week" />
        <StatCard label="API usage" value="64%" hint="12,820 requests" />
      </div>
      <div className="mt-4 grid gap-4 lg:grid-cols-[1.4fr_1fr]">
        <Card className="glass">
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
        <Card className="glass">
          <CardHeader><CardTitle>Top skills</CardTitle></CardHeader>
          <CardContent className="flex flex-wrap gap-2 text-sm">
            {["Python", "React", "SQL", "AWS", "Product Strategy", "NLP", "Salesforce", "Figma"].map((skill) => (
              <Badge key={skill} variant="secondary">{skill}</Badge>
            ))}
          </CardContent>
        </Card>
      </div>
      <div className="mt-4 grid gap-4 lg:grid-cols-3">
        <Card>
          <CardHeader><CardTitle>Recent uploads</CardTitle></CardHeader>
          <CardContent className="grid gap-3">
            {["Frontend Lead.pdf", "Data Scientist.docx", "People Ops.pdf"].map((file, index) => (
              <div key={file} className="flex items-center justify-between rounded-md border bg-background/70 p-3 text-sm">
                <span>{file}</span>
                <Badge variant={index === 0 ? "default" : "secondary"}>{index === 0 ? "Parsed" : "Queued"}</Badge>
              </div>
            ))}
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Candidate pipeline</CardTitle></CardHeader>
          <CardContent className="grid gap-3 text-sm">
            {["New", "Reviewing", "Shortlisted", "Interview ready"].map((stage, index) => (
              <div key={stage} className="flex items-center justify-between">
                <span className="text-muted-foreground">{stage}</span>
                <span className="font-semibold">{420 - index * 83}</span>
              </div>
            ))}
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Upcoming interviews</CardTitle></CardHeader>
          <CardContent className="grid gap-3">
            {interviews.map(([name, role, time]) => (
              <div key={name} className="rounded-md border bg-background/70 p-3">
                <div className="flex items-center justify-between gap-3 text-sm">
                  <span className="font-medium">{name}</span>
                  <span className="text-xs text-muted-foreground">{time}</span>
                </div>
                <p className="mt-1 text-xs text-muted-foreground">{role}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </PageShell>
  );
}
