"use client";

import { useState } from "react";
import { UploadCloud, FileText, CheckCircle2 } from "lucide-react";
import { PageShell } from "@/components/dashboard/page-shell";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

export default function UploadPage() {
  const [files, setFiles] = useState<File[]>([]);
  const [progress, setProgress] = useState(0);

  async function upload() {
    setProgress(18);
    for (const file of files) {
      const form = new FormData();
      form.append("file", file);
      await fetch("/api/resumes/upload", { method: "POST", body: form });
      setProgress((value) => Math.min(100, value + 82 / files.length));
    }
  }

  return (
    <PageShell title="Resume Upload" description="Upload PDF or DOCX resumes with validation, duplicate checks, scan metadata, and preview.">
      <Card>
        <CardContent className="p-6">
          <label className="flex min-h-72 cursor-pointer flex-col items-center justify-center rounded-lg border border-dashed bg-muted/30 p-8 text-center">
            <UploadCloud className="mb-4 text-primary" size={36} />
            <span className="font-semibold">Drop resumes here or browse</span>
            <span className="mt-2 text-sm text-muted-foreground">PDF, DOCX, multiple files, max 15MB each</span>
            <input
              className="sr-only"
              type="file"
              accept=".pdf,.docx"
              multiple
              onChange={(event) => setFiles(Array.from(event.target.files ?? []))}
            />
          </label>
          <div className="mt-5 grid gap-3">
            {files.map((file) => (
              <div key={file.name} className="flex items-center justify-between rounded-md border p-3">
                <div className="flex min-w-0 items-center gap-3"><FileText className="shrink-0 text-primary" /><span className="truncate text-sm">{file.name}</span></div>
                <CheckCircle2 size={18} className="text-primary" />
              </div>
            ))}
          </div>
          {progress > 0 && <Progress className="mt-5" value={progress} />}
          <Button className="mt-5" disabled={!files.length} onClick={upload}>Upload and parse</Button>
        </CardContent>
      </Card>
    </PageShell>
  );
}
