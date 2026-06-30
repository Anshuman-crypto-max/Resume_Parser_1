import Link from "next/link";
import { Download, Search } from "lucide-react";
import { PageShell } from "@/components/dashboard/page-shell";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

const candidates = [
  ["Aarav Mehta", "ML Engineer", "Bengaluru", "Python, NLP, AWS", "91"],
  ["Maya Chen", "Product Designer", "Remote", "Figma, Research, Systems", "86"],
  ["Jon Bell", "Revenue Ops", "Austin", "SQL, Salesforce, BI", "82"]
];

export default function CandidatesPage() {
  return (
    <PageShell title="Candidates" description="Search parsed candidates by keywords, vectors, skills, experience, location, company, salary, and availability." action={<Button><Download size={16} /> Export CSV</Button>}>
      <div className="mb-4 flex gap-2">
        <Input placeholder="Search candidates, skills, companies, education..." />
        <Button variant="outline"><Search size={16} /></Button>
      </div>
      <Card>
        <CardContent className="overflow-x-auto p-0">
          <table className="w-full min-w-[760px] text-sm">
            <thead className="border-b bg-muted/50 text-left text-muted-foreground">
              <tr><th className="p-4">Name</th><th>Role</th><th>Location</th><th>Skills</th><th>ATS</th></tr>
            </thead>
            <tbody>
              {candidates.map((row) => (
                <tr key={row[0]} className="border-b last:border-0">
                  <td className="p-4 font-medium"><Link href="/dashboard/candidates/demo">{row[0]}</Link></td>
                  <td>{row[1]}</td><td>{row[2]}</td><td>{row[3]}</td><td>{row[4]}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </PageShell>
  );
}
