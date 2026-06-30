import { NextResponse } from "next/server";
import { z } from "zod";
import { requireUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { analyzeAts } from "@/lib/resume/ai";

const atsInput = z.object({
  resumeText: z.string().min(80),
  jobDescription: z.string().min(80),
  candidateId: z.string().optional(),
  resumeId: z.string().optional(),
  jobTitle: z.string().optional()
});

export async function POST(request: Request) {
  const { organization } = await requireUser();
  const input = atsInput.parse(await request.json());
  const report = await analyzeAts(input.resumeText, input.jobDescription);
  const saved = await prisma.atsScore.create({
    data: {
      organizationId: organization.id,
      candidateId: input.candidateId,
      resumeId: input.resumeId,
      jobTitle: input.jobTitle,
      jobDescription: input.jobDescription,
      score: report.score,
      missingSkills: report.missingSkills,
      strengths: report.strengths,
      weaknesses: report.weaknesses,
      suggestions: report.suggestions,
      improvedResume: report.improvedResume,
      keywords: report.keywordSuggestions
    }
  });
  return NextResponse.json({ report, id: saved.id });
}
