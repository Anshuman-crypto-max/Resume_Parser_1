import { zodResponseFormat } from "openai/helpers/zod";
import { env } from "@/lib/env";
import { getOpenAI } from "@/lib/openai";
import { atsReportSchema, parsedResumeSchema } from "@/lib/schemas/resume";

export async function parseResumeWithAI(text: string) {
  const client = getOpenAI();
  const completion = await client.responses.parse({
    model: env.OPENAI_MODEL,
    input: [
      {
        role: "system",
        content:
          "You are a resume parsing engine. Extract only facts supported by the resume. Return normalized structured JSON. Use empty strings or arrays for missing fields."
      },
      {
        role: "user",
        content: `Parse this resume into the required schema:\n\n${text}`
      }
    ],
    text: { format: zodResponseFormat(parsedResumeSchema, "parsed_resume") }
  });

  return completion.output_parsed;
}

export async function createEmbedding(content: string) {
  const client = getOpenAI();
  const result = await client.embeddings.create({
    model: env.OPENAI_EMBEDDING_MODEL,
    input: content.slice(0, 16_000)
  });
  return result.data[0].embedding;
}

export async function analyzeAts(resumeText: string, jobDescription: string) {
  const client = getOpenAI();
  const completion = await client.responses.parse({
    model: env.OPENAI_MODEL,
    input: [
      {
        role: "system",
        content:
          "You are a senior recruiter and ATS analyst. Compare the resume against the job description and provide factual, actionable feedback."
      },
      {
        role: "user",
        content: `JOB DESCRIPTION:\n${jobDescription}\n\nRESUME:\n${resumeText}`
      }
    ],
    text: { format: zodResponseFormat(atsReportSchema, "ats_report") }
  });

  return completion.output_parsed;
}
