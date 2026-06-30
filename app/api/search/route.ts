import { NextResponse } from "next/server";
import { z } from "zod";
import { requireUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const searchSchema = z.object({
  query: z.string().default(""),
  skills: z.array(z.string()).default([]),
  location: z.string().optional(),
  minExperience: z.number().optional(),
  education: z.string().optional(),
  company: z.string().optional(),
  availability: z.string().optional()
});

export async function POST(request: Request) {
  const { organization } = await requireUser();
  const input = searchSchema.parse(await request.json());
  const candidates = await prisma.candidate.findMany({
    where: {
      organizationId: organization.id,
      location: input.location ? { contains: input.location, mode: "insensitive" } : undefined,
      hardSkills: input.skills.length ? { hasSome: input.skills } : undefined,
      OR: input.query
        ? [
            { fullName: { contains: input.query, mode: "insensitive" } },
            { summary: { contains: input.query, mode: "insensitive" } },
            { keywords: { has: input.query } }
          ]
        : undefined,
      experiences: input.company ? { some: { company: { contains: input.company, mode: "insensitive" } } } : undefined,
      education: input.education ? { some: { institution: { contains: input.education, mode: "insensitive" } } } : undefined
    },
    include: { atsScores: { orderBy: { createdAt: "desc" }, take: 1 } },
    take: 50
  });
  return NextResponse.json({ candidates });
}
