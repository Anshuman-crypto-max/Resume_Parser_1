"use client";

import { useState } from "react";
import { AlertCircle, CheckCircle2, FileText, ShieldCheck, UploadCloud } from "lucide-react";
import { PageShell } from "@/components/dashboard/page-shell";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";

export default function UploadPage() {
  const [files, setFiles] = useState<File[]>([]);
  const [progress, setProgress] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [status, setStatus] = useState<"idle" | "uploading" | "done" | "error">("idle");

  function addFiles(nextFiles: FileList | File[]) {
    const accepted = Array.from(nextFiles).filter((file) => /\.(pdf|docx|doc)$/i.test(file.name) && file.size <= 15 * 1024 * 1024);
    setFiles((current) => {
      const existing = new Set(current.map((file) => `${file.name}-${file.size}`));
      return [...current, ...accepted.filter((file) => !existing.has(`${file.name}-${file.size}`))];
    });
  }

  async function upload() {
    setStatus("uploading");
    setProgress(18);
    try {
      for (const file of files) {
        const form = new FormData();
        form.append("file", file);
        const response = await fetch("/api/resumes/upload", { method: "POST", body: form });
        if (!response.ok) {
          throw new Error("Upload failed");
        }
        setProgress((value) => Math.min(100, value + 82 / files.length));
      }
      setStatus("done");
    } catch {
      setStatus("error");
    }
  }

  return (
    <PageShell title="Resume Upload" description="Upload PDF, DOCX, or DOC resumes with validation, duplicate checks, scan metadata, and preview.">
      <Card className="glass">
        <CardContent className="p-6">
          <label
            className={`flex min-h-72 cursor-pointer flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center transition ${isDragging ? "border-primary bg-primary/10" : "bg-muted/30 hover:bg-muted/50"}`}
            onDragOver={(event) => {
              event.preventDefault();
              setIsDragging(true);
            }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={(event) => {
              event.preventDefault();
              setIsDragging(false);
              addFiles(event.dataTransfer.files);
            }}
          >
            <UploadCloud className="mb-4 text-primary" size={36} />
            <span className="font-semibold">Drop resumes here or browse</span>
            <span className="mt-2 text-sm text-muted-foreground">PDF, DOCX, and DOC, multiple files, max 15MB each</span>
            <input
              className="sr-only"
              type="file"
              accept=".pdf,.docx,.doc,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
              multiple
              onChange={(event) => addFiles(event.target.files ?? [])}
            />
          </label>
          <div className="mt-5 grid gap-3">
            {files.map((file) => (
              <div key={`${file.name}-${file.size}`} className="flex items-center justify-between rounded-md border bg-background/70 p-3">
                <div className="flex min-w-0 items-center gap-3">
                  <FileText className="shrink-0 text-primary" />
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium">{file.name}</p>
                    <p className="text-xs text-muted-foreground">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                  </div>
                </div>
                <Badge variant="secondary">Ready</Badge>
              </div>
            ))}
          </div>
          {progress > 0 && <Progress className="mt-5" value={progress} />}
          <div className="mt-5 flex flex-wrap items-center gap-3">
            <Button disabled={!files.length || status === "uploading"} onClick={upload}>Upload and parse</Button>
            <Button variant="outline" disabled={!files.length || status === "uploading"} onClick={() => { setFiles([]); setProgress(0); setStatus("idle"); }}>Clear queue</Button>
            {status === "done" ? <span className="inline-flex items-center gap-2 text-sm text-primary"><CheckCircle2 size={16} /> Parsed successfully</span> : null}
            {status === "error" ? <span className="inline-flex items-center gap-2 text-sm text-destructive"><AlertCircle size={16} /> Review failed files and retry</span> : null}
          </div>
        </CardContent>
      </Card>
      <div className="mt-4 grid gap-4 md:grid-cols-3">
        {["PDF, DOCX, and DOC validation", "Secure storage metadata", "AI extraction and ranking"].map((item) => (
          <Card key={item}>
            <CardContent className="flex items-center gap-3 p-4 text-sm">
              <ShieldCheck className="text-primary" size={18} />
              <span>{item}</span>
            </CardContent>
          </Card>
        ))}
      </div>
      <div className="mt-4 grid gap-4 lg:grid-cols-3">
        {[
          ["Queued", files.length.toString(), "Files ready for background parsing"],
          ["Max file size", "15 MB", "Large enough for portfolio-heavy resumes"],
          ["Retention", "Private", "Stored in your Supabase resume bucket"]
        ].map(([title, value, body]) => (
          <Card key={title}>
            <CardHeader>
              <CardTitle>{title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-semibold">{value}</p>
              <p className="mt-1 text-sm text-muted-foreground">{body}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </PageShell>
  );
}
