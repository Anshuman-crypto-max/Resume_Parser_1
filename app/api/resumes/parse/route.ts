import { NextResponse } from "next/server";
import { z } from "zod";
import { requireUser } from "@/lib/auth";
import { enforceRateLimit } from "@/lib/rate-limit";
import { parseResumeWithAI } from "@/lib/resume/ai";

const parseSchema = z.object({ text: z.string().min(80) });

export async function POST(request: Request) {
  const { user, organization } = await requireUser();
  await enforceRateLimit(`parse:${organization.id}:${user.id}`);
  const { text } = parseSchema.parse(await request.json());
  const parsed = await parseResumeWithAI(text);
  return NextResponse.json({ parsed });
}
