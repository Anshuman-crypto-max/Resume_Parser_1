import { NextResponse } from "next/server";
import { requireUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const { organization } = await requireUser();
  const [candidates, resumes, topSkills] = await Promise.all([
    prisma.candidate.count({ where: { organizationId: organization.id } }),
    prisma.resume.count({ where: { organizationId: organization.id } }),
    prisma.candidate.findMany({ where: { organizationId: organization.id }, select: { hardSkills: true }, take: 500 })
  ]);
  const skillCounts = new Map<string, number>();
  topSkills.flatMap((candidate) => candidate.hardSkills).forEach((skill) => skillCounts.set(skill, (skillCounts.get(skill) ?? 0) + 1));
  return NextResponse.json({
    candidates,
    resumes,
    topSkills: Array.from(skillCounts.entries()).sort((a, b) => b[1] - a[1]).slice(0, 10)
  });
}
