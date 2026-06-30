"use client";

import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { PageShell } from "@/components/dashboard/page-shell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const data = [
  { month: "Jan", uploads: 240 },
  { month: "Feb", uploads: 310 },
  { month: "Mar", uploads: 420 },
  { month: "Apr", uploads: 390 },
  { month: "May", uploads: 520 },
  { month: "Jun", uploads: 680 }
];

export default function AnalyticsPage() {
  return (
    <PageShell title="Analytics" description="Monthly uploads, top skills, experience distribution, hiring funnel, top colleges, companies, and recruiter activity.">
      <Card>
        <CardHeader><CardTitle>Monthly uploads</CardTitle></CardHeader>
        <CardContent className="h-80">
          <ResponsiveContainer width="100%" height="100%"><BarChart data={data}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="month" /><YAxis /><Tooltip /><Bar dataKey="uploads" fill="hsl(var(--primary))" radius={[6, 6, 0, 0]} /></BarChart></ResponsiveContainer>
        </CardContent>
      </Card>
    </PageShell>
  );
}
