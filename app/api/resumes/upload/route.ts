import { NextResponse } from "next/server";
import { requireUser } from "@/lib/auth";
import { enforceRateLimit } from "@/lib/rate-limit";
import { env } from "@/lib/env";
import { prisma } from "@/lib/prisma";
import { getSupabaseAdmin } from "@/lib/supabase";
import { extractTextFromFile } from "@/lib/resume/extract";
import { parseResumeWithAI } from "@/lib/resume/ai";

export async function POST(request: Request) {
  const { user, organization } = await requireUser();
  await enforceRateLimit(`upload:${organization.id}:${user.id}`);

  const formData = await request.formData();
  const file = formData.get("file");
  if (!(file instanceof File)) {
    return NextResponse.json({ error: "file is required" }, { status: 400 });
  }
  if (file.size > 15 * 1024 * 1024) {
    return NextResponse.json({ error: "file exceeds 15MB limit" }, { status: 413 });
  }

  const { text, checksum } = await extractTextFromFile(file);
  if (text.length < 80) {
    return NextResponse.json({ error: "resume text is too short or image-only" }, { status: 422 });
  }

  const duplicate = await prisma.resume.findUnique({
    where: { organizationId_checksum: { organizationId: organization.id, checksum } }
  });
  if (duplicate) {
    return NextResponse.json({ duplicate: true, resumeId: duplicate.id }, { status: 200 });
  }

  const storagePath = `${organization.id}/${checksum}-${file.name}`;
  const supabase = getSupabaseAdmin();
  await supabase.storage.from(env.SUPABASE_RESUME_BUCKET).upload(storagePath, file, { upsert: false });

  const parsed = await parseResumeWithAI(text);
  const candidate = await prisma.candidate.create({
    data: {
      organizationId: organization.id,
      fullName: parsed.fullName || "Unknown Candidate",
      email: parsed.email || null,
      phone: parsed.phone || null,
      linkedin: parsed.linkedin || null,
      github: parsed.github || null,
      portfolio: parsed.portfolio || null,
      address: parsed.address || null,
      location: parsed.location || null,
      currentSalary: Number.parseInt(parsed.currentSalary, 10) || null,
      expectedSalary: Number.parseInt(parsed.expectedSalary, 10) || null,
      noticePeriod: parsed.noticePeriod || null,
      summary: parsed.summary || null,
      keywords: parsed.keywords,
      hardSkills: parsed.skills.hard,
      softSkills: parsed.skills.soft,
      resumes: {
        create: {
          organizationId: organization.id,
          fileName: file.name,
          fileType: file.type || "application/octet-stream",
          fileSize: file.size,
          storagePath,
          checksum,
          rawText: text,
          parsedJson: parsed,
          status: "PARSED",
          parsedAt: new Date()
        }
      },
      experiences: {
        create: parsed.experience.map((item) => ({
          company: item.company,
          designation: item.designation,
          location: item.location || null,
          startDate: item.startDate || null,
          endDate: item.endDate || null,
          duration: item.duration || null,
          description: item.description || null,
          achievements: item.achievements
        }))
      },
      education: {
        create: parsed.education.map((item) => ({
          institution: item.institution,
          degree: item.degree || null,
          field: item.field || null,
          startYear: item.startYear || null,
          endYear: item.endYear || null,
          grade: item.grade || null
        }))
      },
      projects: {
        create: parsed.projects.map((item) => ({
          name: item.name,
          description: item.description || null,
          url: item.url || null,
          technologies: item.technologies
        }))
      }
    },
    include: { resumes: true }
  });

  await prisma.usageLog.create({ data: { organizationId: organization.id, userId: user.id, action: "resume.upload" } });
  await prisma.auditLog.create({ data: { organizationId: organization.id, userId: user.id, action: "resume.uploaded", entityType: "Candidate", entityId: candidate.id } });

  return NextResponse.json({ candidateId: candidate.id, resumeId: candidate.resumes[0]?.id, parsed });
}
