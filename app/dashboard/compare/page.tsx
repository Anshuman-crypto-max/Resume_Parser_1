import { PageShell } from "@/components/dashboard/page-shell";
import { Card, CardContent } from "@/components/ui/card";

export default function ComparePage() {
  return (
    <PageShell title="Resume Compare" description="Compare multiple resumes by skill match, experience match, education match, ATS rank, and hiring recommendation.">
      <Card><CardContent className="overflow-x-auto p-0"><table className="w-full min-w-[760px] text-sm"><thead className="border-b bg-muted/50 text-left"><tr><th className="p-4">Candidate</th><th>Skill match</th><th>Experience</th><th>Education</th><th>ATS rank</th><th>Recommendation</th></tr></thead><tbody>{[["Aarav", "94%", "8 yrs", "M.Tech", "#1", "Interview"], ["Maya", "81%", "6 yrs", "B.Des", "#2", "Portfolio review"], ["Jon", "76%", "7 yrs", "MBA", "#3", "Screen"]].map((row) => <tr key={row[0]} className="border-b last:border-0">{row.map((cell, index) => <td key={cell} className={index === 0 ? "p-4 font-medium" : ""}>{cell}</td>)}</tr>)}</tbody></table></CardContent></Card>
    </PageShell>
  );
}
