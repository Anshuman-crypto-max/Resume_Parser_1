"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import type { LucideIcon } from "lucide-react";
import { ArrowRight, CheckCircle2, FileSearch, Lock, Search, Sparkles, UploadCloud, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const features: Array<{ title: string; body: string; icon: LucideIcon }> = [
  { title: "AI parsing", body: "Extract contact, work history, skills, salaries, dates, achievements, and normalized JSON.", icon: FileSearch },
  { title: "Candidate search", body: "Blend keyword, filters, semantic embeddings, salary, availability, education, and company search.", icon: Search },
  { title: "ATS intelligence", body: "Score resumes against job descriptions with gaps, strengths, suggestions, and improved resume drafts.", icon: Sparkles },
  { title: "Secure operations", body: "RBAC, audit logs, rate limits, signed storage, API keys, and billing limits are built into the workflow.", icon: Lock }
];

const faqs = [
  ["Can it parse PDF and DOCX?", "Yes. Upload endpoints support PDF and DOCX extraction, validation, duplicate checks, and storage metadata."],
  ["Does it support teams?", "Yes. Clerk organization support, roles, billing, API keys, audit logs, and shared candidate databases are modeled."],
  ["Can we use the API?", "Yes. REST endpoints cover upload, parse, candidates, search, analytics, ATS, comparison, and API-key management."]
];

export function LandingPage() {
  return (
    <main className="overflow-hidden">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-5 py-5">
        <Link href="/" className="flex items-center gap-2 font-semibold">
          <span className="flex h-8 w-8 items-center justify-center rounded-md bg-primary text-primary-foreground"><Zap size={18} /></span>
          Resume Parser
        </Link>
        <div className="hidden items-center gap-6 text-sm text-muted-foreground md:flex">
          <a href="#features">Features</a>
          <a href="#pricing">Pricing</a>
          <a href="#faq">FAQ</a>
        </div>
        <div className="flex items-center gap-2">
          <Button asChild variant="ghost"><Link href="/sign-in">Sign in</Link></Button>
          <Button asChild><Link href="/dashboard">Open app</Link></Button>
        </div>
      </nav>

      <section className="mx-auto grid min-h-[calc(100vh-96px)] max-w-7xl items-center gap-10 px-5 pb-16 pt-8 lg:grid-cols-[1fr_0.92fr]">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border bg-card px-3 py-1 text-sm text-muted-foreground">
            <Sparkles size={15} /> AI recruiting intelligence for modern HR teams
          </div>
          <h1 className="max-w-4xl text-5xl font-semibold leading-[1.02] tracking-normal md:text-7xl">
            Resume Parser
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-muted-foreground">
            Turn messy resumes into searchable candidate profiles, ATS scores, comparison tables, analytics, and clean exports without leaving your hiring workspace.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Button asChild size="lg"><Link href="/dashboard/upload">Parse resumes <ArrowRight size={18} /></Link></Button>
            <Button asChild size="lg" variant="outline"><Link href="#features">See features</Link></Button>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.55 }} className="relative">
          <div className="noise rounded-lg border bg-card p-4 shadow-premium">
            <div className="rounded-md border bg-background p-4">
              <div className="flex items-center justify-between border-b pb-3">
                <div>
                  <p className="text-sm font-medium">Resume intake</p>
                  <p className="text-xs text-muted-foreground">12 files processing</p>
                </div>
                <UploadCloud className="text-primary" />
              </div>
              <div className="mt-4 grid gap-3">
                {["Senior Product Designer.pdf", "ML Engineer.docx", "Revenue Ops Lead.pdf"].map((file, index) => (
                  <motion.div key={file} animate={{ y: [0, -3, 0] }} transition={{ duration: 2.4, repeat: Infinity, delay: index * 0.25 }} className="rounded-md border bg-card p-3">
                    <div className="flex items-center justify-between gap-3">
                      <div className="min-w-0">
                        <p className="truncate text-sm font-medium">{file}</p>
                        <p className="text-xs text-muted-foreground">{index === 0 ? "Parsed" : index === 1 ? "Scoring" : "Embedding"}</p>
                      </div>
                      <CheckCircle2 className="shrink-0 text-primary" size={18} />
                    </div>
                    <div className="mt-3 h-2 overflow-hidden rounded-full bg-muted">
                      <div className="h-full rounded-full bg-primary" style={{ width: `${92 - index * 16}%` }} />
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      <section id="features" className="border-y bg-card/60 py-20">
        <div className="mx-auto max-w-7xl px-5">
          <div className="max-w-2xl">
            <h2 className="text-3xl font-semibold">Everything HR expects after upload.</h2>
            <p className="mt-3 text-muted-foreground">Parsing, search, ranking, analytics, exports, and governance live in one workflow.</p>
          </div>
          <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {features.map(({ title, body, icon: Icon }) => (
              <Card key={title}>
                <CardHeader><Icon className="text-primary" /><CardTitle>{title}</CardTitle></CardHeader>
                <CardContent className="text-sm leading-6 text-muted-foreground">{body}</CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-8 px-5 py-20 lg:grid-cols-3">
        {["Upload resumes", "AI extracts structure", "Search, score, export"].map((step, index) => (
          <div key={step} className="rounded-lg border bg-card p-6">
            <div className="mb-5 flex h-10 w-10 items-center justify-center rounded-md bg-primary text-primary-foreground">{index + 1}</div>
            <h3 className="font-semibold">{step}</h3>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              {index === 0 ? "Drag in PDF or DOCX files with progress, validation, duplicate detection, and secure storage." : index === 1 ? "OpenAI extracts normalized fields, embeddings, skills, timelines, and candidate intelligence." : "Recruiters filter talent, compare resumes, generate ATS reports, and download JSON or CSV."}
            </p>
          </div>
        ))}
      </section>

      <section id="pricing" className="bg-foreground py-20 text-background">
        <div className="mx-auto grid max-w-7xl gap-4 px-5 md:grid-cols-3">
          {["Free", "Pro", "Business"].map((plan, index) => (
            <div key={plan} className="rounded-lg border border-background/15 bg-background/5 p-6">
              <h3 className="text-xl font-semibold">{plan}</h3>
              <p className="mt-2 text-sm text-background/70">{index === 0 ? "50 resumes/month" : index === 1 ? "2,000 resumes/month" : "Custom volume and controls"}</p>
              <p className="mt-6 text-3xl font-semibold">{index === 0 ? "$0" : index === 1 ? "$79" : "Custom"}</p>
              <Button className="mt-6 w-full" variant={index === 1 ? "default" : "secondary"} asChild><Link href="/dashboard/billing">Choose plan</Link></Button>
            </div>
          ))}
        </div>
      </section>

      <section id="faq" className="mx-auto max-w-4xl px-5 py-20">
        <h2 className="text-3xl font-semibold">Questions hiring teams ask first.</h2>
        <div className="mt-8 grid gap-3">
          {faqs.map(([question, answer]) => (
            <Card key={question}>
              <CardHeader><CardTitle>{question}</CardTitle></CardHeader>
              <CardContent className="text-sm text-muted-foreground">{answer}</CardContent>
            </Card>
          ))}
        </div>
      </section>

      <footer className="border-t py-8">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 px-5 text-sm text-muted-foreground md:flex-row md:items-center md:justify-between">
          <p>Resume Parser. Built for secure AI hiring operations.</p>
          <div className="flex gap-4"><Link href="/privacy">Privacy</Link><Link href="/security">Security</Link><Link href="/dashboard">Dashboard</Link></div>
        </div>
      </footer>
    </main>
  );
}
