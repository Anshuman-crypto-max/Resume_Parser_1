"use client";

import { Area, AreaChart, Bar, BarChart, CartesianGrid, Cell, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { PageShell } from "@/components/dashboard/page-shell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const data = [
  { month: "Jan", uploads: 240 },
  { month: "Feb", uploads: 310 },
  { month: "Mar", uploads: 420 },
  { month: "Apr", uploads: 390 },
  { month: "May", uploads: 520 },
  { month: "Jun", uploads: 680 }
];

const funnel = [
  { stage: "Parsed", count: 3904 },
  { stage: "Reviewed", count: 2440 },
  { stage: "Shortlisted", count: 920 },
  { stage: "Interview", count: 410 },
  { stage: "Offer", count: 86 }
];

const skills = [
  { skill: "Python", count: 420 },
  { skill: "React", count: 386 },
  { skill: "SQL", count: 350 },
  { skill: "AWS", count: 296 },
  { skill: "NLP", count: 220 }
];

const experience = [
  { name: "0-2 yrs", value: 22 },
  { name: "3-5 yrs", value: 38 },
  { name: "6-9 yrs", value: 26 },
  { name: "10+ yrs", value: 14 }
];

const locations = ["Bengaluru", "Remote", "Austin", "London", "Singapore"];
const colors = ["#4CAF50", "#8BC34A", "#14B8A6", "#F59E0B"];

export default function AnalyticsPage() {
  return (
    <PageShell title="Analytics" description="Monthly uploads, top skills, experience distribution, hiring funnel, top colleges, companies, and recruiter activity.">
      <div className="grid gap-4 xl:grid-cols-[1.3fr_0.7fr]">
        <Card>
          <CardHeader><CardTitle>Monthly uploads</CardTitle></CardHeader>
          <CardContent className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data}>
                <defs>
                  <linearGradient id="uploads" x1="0" x2="0" y1="0" y2="1">
                    <stop offset="5%" stopColor="#4CAF50" stopOpacity={0.55} />
                    <stop offset="95%" stopColor="#4CAF50" stopOpacity={0.04} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Area dataKey="uploads" fill="url(#uploads)" stroke="#4CAF50" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Experience distribution</CardTitle></CardHeader>
          <CardContent className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={experience} dataKey="value" nameKey="name" innerRadius={54} outerRadius={90} paddingAngle={3}>
                  {experience.map((entry, index) => <Cell key={entry.name} fill={colors[index % colors.length]} />)}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
      <div className="mt-4 grid gap-4 lg:grid-cols-3">
        <Card>
          <CardHeader><CardTitle>Hiring funnel</CardTitle></CardHeader>
          <CardContent className="grid gap-3">
            {funnel.map((item) => (
              <div key={item.stage} className="rounded-md border bg-background/70 p-3">
                <div className="flex justify-between text-sm">
                  <span>{item.stage}</span>
                  <span className="font-semibold">{item.count.toLocaleString()}</span>
                </div>
                <div className="mt-2 h-2 overflow-hidden rounded-full bg-muted">
                  <div className="h-full rounded-full bg-primary" style={{ width: `${Math.max(8, (item.count / funnel[0].count) * 100)}%` }} />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Top skills</CardTitle></CardHeader>
          <CardContent className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={skills} layout="vertical" margin={{ left: 12 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" hide />
                <YAxis dataKey="skill" type="category" width={72} />
                <Tooltip />
                <Bar dataKey="count" fill="hsl(var(--primary))" radius={[0, 6, 6, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Hot locations</CardTitle></CardHeader>
          <CardContent className="flex flex-wrap gap-2">
            {locations.map((location, index) => <Badge key={location} variant={index < 2 ? "default" : "secondary"}>{location}</Badge>)}
            <p className="mt-4 w-full text-sm leading-6 text-muted-foreground">Location clustering helps recruiters plan hybrid role availability, relocation conversations, and regional pipeline gaps.</p>
          </CardContent>
        </Card>
      </div>
    </PageShell>
  );
}
