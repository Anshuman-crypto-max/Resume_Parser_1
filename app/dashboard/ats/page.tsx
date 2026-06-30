"use client";

import { useState } from "react";
import { Gauge } from "lucide-react";
import { PageShell } from "@/components/dashboard/page-shell";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";

export default function AtsPage() {
  const [score, setScore] = useState<number | null>(null);
  return (
    <PageShell title="ATS Analyzer" description="Compare a resume with a job description and generate score, missing skills, strengths, weaknesses, and rewrite suggestions.">
      <div className="grid gap-4 lg:grid-cols-2">
        <Card><CardHeader><CardTitle>Job description</CardTitle></CardHeader><CardContent><Textarea placeholder="Paste job description..." /><Button className="mt-4" onClick={() => setScore(87)}><Gauge size={16} /> Analyze</Button></CardContent></Card>
        <Card><CardHeader><CardTitle>AI report</CardTitle></CardHeader><CardContent>{score ? <div><div className="text-6xl font-semibold text-primary">{score}</div><p className="mt-3 text-sm text-muted-foreground">Missing skills: Kubernetes, stakeholder mapping. Strengths: Python, NLP, production ML, cloud.</p></div> : <p className="text-sm text-muted-foreground">Run analysis to generate the ATS report.</p>}</CardContent></Card>
      </div>
    </PageShell>
  );
}
