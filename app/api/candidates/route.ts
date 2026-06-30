import { NextResponse } from "next/server";
import { requireUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  const { organization } = await requireUser();
  const { searchParams } = new URL(request.url);
  const q = searchParams.get("q") ?? "";
  const candidates = await prisma.candidate.findMany({
    where: {
      organizationId: organization.id,
      OR: q
        ? [
            { fullName: { contains: q, mode: "insensitive" } },
            { email: { contains: q, mode: "insensitive" } },
            { location: { contains: q, mode: "insensitive" } },
            { hardSkills: { has: q } },
            { softSkills: { has: q } }
          ]
        : undefined
    },
    orderBy: { createdAt: "desc" },
    take: 100
  });
  return NextResponse.json({ candidates });
}
