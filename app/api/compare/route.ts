import { NextResponse } from "next/server";
import { z } from "zod";
import { requireUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const compareSchema = z.object({
  candidateIds: z.array(z.string()).min(2),
  requiredSkills: z.array(z.string()).default([])
});

export async function POST(request: Request) {
  const { organization } = await requireUser();
  const input = compareSchema.parse(await request.json());
  const candidates = await prisma.candidate.findMany({
    where: { organizationId: organization.id, id: { in: input.candidateIds } },
    include: { education: true, experiences: true, atsScores: { orderBy: { createdAt: "desc" }, take: 1 } }
  });
  const comparison = candidates
    .map((candidate) => {
      const skills = new Set(candidate.hardSkills);
      const matched = input.requiredSkills.filter((skill) => skills.has(skill));
      return {
        candidateId: candidate.id,
        fullName: candidate.fullName,
        skillMatch: input.requiredSkills.length ? Math.round((matched.length / input.requiredSkills.length) * 100) : 0,
        experienceCount: candidate.experiences.length,
        educationMatch: candidate.education.length,
        atsScore: candidate.atsScores[0]?.score ?? 0,
        recommendation: matched.length >= Math.ceil(input.requiredSkills.length * 0.7) ? "Interview" : "Review"
      };
    })
    .sort((a, b) => b.skillMatch + b.atsScore - (a.skillMatch + a.atsScore));
  return NextResponse.json({ comparison });
}
