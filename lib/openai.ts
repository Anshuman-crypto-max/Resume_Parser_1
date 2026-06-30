import OpenAI from "openai";
import { env } from "@/lib/env";

export const openai = env.OPENAI_API_KEY ? new OpenAI({ apiKey: env.OPENAI_API_KEY }) : null;

export function getOpenAI() {
  if (!openai) {
    throw new Error("OPENAI_API_KEY is not configured.");
  }
  return openai;
}
