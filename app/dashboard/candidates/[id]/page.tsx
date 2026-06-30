import { Download } from "lucide-react";
import { PageShell } from "@/components/dashboard/page-shell";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function CandidateProfilePage() {
  return (
    <PageShell title="Aarav Mehta" description="Professional profile, resume viewer, extracted data, timeline, ATS score, notes, tags, and exports." action={<div className="flex gap-2"><Button variant="outline"><Download size={16} /> JSON</Button><Button><Download size={16} /> Resume</Button></div>}>
      <div className="grid gap-4 lg:grid-cols-[1fr_360px]">
        <Card>
          <CardHeader><CardTitle>Experience timeline</CardTitle></CardHeader>
          <CardContent className="grid gap-5">
            {["Senior ML Engineer at NovaHire", "ML Engineer at DataForge", "M.Tech Computer Science"].map((item) => (
              <div key={item} className="border-l-2 border-primary pl-4"><p className="font-medium">{item}</p><p className="text-sm text-muted-foreground">Extracted from parsed resume with confidence metadata.</p></div>
            ))}
          </CardContent>
        </Card>
        <div className="grid gap-4">
          <Card><CardHeader><CardTitle>ATS score</CardTitle></CardHeader><CardContent><div className="text-5xl font-semibold text-primary">91</div><p className="mt-2 text-sm text-muted-foreground">Strong match for ML platform roles.</p></CardContent></Card>
          <Card><CardHeader><CardTitle>Skills</CardTitle></CardHeader><CardContent className="flex flex-wrap gap-2">{["Python", "NLP", "RAG", "AWS", "Vector DB"].map((skill) => <Badge key={skill}>{skill}</Badge>)}</CardContent></Card>
        </div>
      </div>
    </PageShell>
  );
}
