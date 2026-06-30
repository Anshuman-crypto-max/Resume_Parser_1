import crypto from "node:crypto";
import { NextResponse } from "next/server";
import { z } from "zod";
import { requireUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const createKeySchema = z.object({ name: z.string().min(2), expiresAt: z.string().datetime().optional() });

export async function GET() {
  const { organization } = await requireUser();
  const keys = await prisma.apiKey.findMany({
    where: { organizationId: organization.id, revokedAt: null },
    select: { id: true, name: true, prefix: true, lastUsedAt: true, expiresAt: true, createdAt: true }
  });
  return NextResponse.json({ keys });
}

export async function POST(request: Request) {
  const { user, organization } = await requireUser();
  const input = createKeySchema.parse(await request.json());
  const secret = `rp_${crypto.randomBytes(32).toString("hex")}`;
  const prefix = secret.slice(0, 10);
  const hashedKey = crypto.createHash("sha256").update(secret).digest("hex");
  const key = await prisma.apiKey.create({
    data: {
      organizationId: organization.id,
      userId: user.id,
      name: input.name,
      prefix,
      hashedKey,
      expiresAt: input.expiresAt ? new Date(input.expiresAt) : null
    }
  });
  return NextResponse.json({ key: { id: key.id, name: key.name, prefix: key.prefix }, secret });
}
