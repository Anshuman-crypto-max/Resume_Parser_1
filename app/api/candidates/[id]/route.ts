import { NextResponse } from "next/server";
import { z } from "zod";
import { requireUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const updateCandidateSchema = z.object({
  fullName: z.string().min(1).optional(),
  email: z.string().email().nullable().optional(),
  phone: z.string().nullable().optional(),
  location: z.string().nullable().optional(),
  status: z.enum(["NEW", "REVIEWING", "SHORTLISTED", "INTERVIEWING", "OFFER", "HIRED", "REJECTED", "ARCHIVED"]).optional(),
  tags: z.array(z.string()).optional(),
  notes: z.string().optional()
});

export async function GET(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const { organization } = await requireUser();
  const { id } = await params;
  const candidate = await prisma.candidate.findFirst({
    where: { id, organizationId: organization.id },
    include: { resumes: true, experiences: true, education: true, projects: true, certifications: true, atsScores: true, notes: true }
  });
  if (!candidate) {
    return NextResponse.json({ error: "candidate not found" }, { status: 404 });
  }
  return NextResponse.json({ candidate });
}

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { user, organization } = await requireUser();
  const { id } = await params;
  const input = updateCandidateSchema.parse(await request.json());
  const existing = await prisma.candidate.findFirst({ where: { id, organizationId: organization.id }, select: { id: true } });
  if (!existing) {
    return NextResponse.json({ error: "candidate not found" }, { status: 404 });
  }
  const candidate = await prisma.candidate.update({
    where: { id },
    data: {
      fullName: input.fullName,
      email: input.email,
      phone: input.phone,
      location: input.location,
      status: input.status,
      tags: input.tags
    }
  });
  if (input.notes) {
    await prisma.candidateNote.create({ data: { candidateId: candidate.id, userId: user.id, body: input.notes } });
  }
  await prisma.auditLog.create({ data: { organizationId: organization.id, userId: user.id, action: "candidate.updated", entityType: "Candidate", entityId: candidate.id } });
  return NextResponse.json({ candidate });
}

export async function DELETE(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const { user, organization } = await requireUser();
  const { id } = await params;
  const result = await prisma.candidate.deleteMany({ where: { id, organizationId: organization.id } });
  if (!result.count) {
    return NextResponse.json({ error: "candidate not found" }, { status: 404 });
  }
  await prisma.auditLog.create({ data: { organizationId: organization.id, userId: user.id, action: "candidate.deleted", entityType: "Candidate", entityId: id } });
  return NextResponse.json({ deleted: true });
}
