import { z } from "zod";

const envSchema = z.object({
  DATABASE_URL: z.string().min(1).optional(),
  NEXT_PUBLIC_APP_URL: z.string().url().default("http://localhost:3000"),
  OPENAI_API_KEY: z.string().optional(),
  OPENAI_MODEL: z.string().default("gpt-5.5"),
  OPENAI_EMBEDDING_MODEL: z.string().default("text-embedding-3-large"),
  NEXT_PUBLIC_SUPABASE_URL: z.string().url().optional(),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().optional(),
  SUPABASE_SERVICE_ROLE_KEY: z.string().optional(),
  SUPABASE_RESUME_BUCKET: z.string().default("resumes"),
  UPSTASH_REDIS_REST_URL: z.string().url().optional(),
  UPSTASH_REDIS_REST_TOKEN: z.string().optional(),
  STRIPE_SECRET_KEY: z.string().optional(),
  STRIPE_WEBHOOK_SECRET: z.string().optional(),
  RESEND_API_KEY: z.string().optional(),
  RESEND_FROM_EMAIL: z.string().default("Resume Parser <notifications@example.com>")
});

export const env = envSchema.parse(process.env);
