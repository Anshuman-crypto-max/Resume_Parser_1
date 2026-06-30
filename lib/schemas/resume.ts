import { z } from "zod";

export const parsedResumeSchema = z.object({
  fullName: z.string().default(""),
  email: z.string().default(""),
  phone: z.string().default(""),
  linkedin: z.string().default(""),
  github: z.string().default(""),
  portfolio: z.string().default(""),
  address: z.string().default(""),
  location: z.string().default(""),
  summary: z.string().default(""),
  expectedSalary: z.string().default(""),
  currentSalary: z.string().default(""),
  noticePeriod: z.string().default(""),
  skills: z.object({
    hard: z.array(z.string()).default([]),
    soft: z.array(z.string()).default([]),
    tools: z.array(z.string()).default([])
  }),
  experience: z.array(z.object({
    company: z.string().default(""),
    designation: z.string().default(""),
    startDate: z.string().default(""),
    endDate: z.string().default(""),
    duration: z.string().default(""),
    location: z.string().default(""),
    achievements: z.array(z.string()).default([]),
    description: z.string().default("")
  })).default([]),
  education: z.array(z.object({
    institution: z.string().default(""),
    degree: z.string().default(""),
    field: z.string().default(""),
    startYear: z.string().default(""),
    endYear: z.string().default(""),
    grade: z.string().default("")
  })).default([]),
  projects: z.array(z.object({
    name: z.string().default(""),
    description: z.string().default(""),
    technologies: z.array(z.string()).default([]),
    url: z.string().default("")
  })).default([]),
  certifications: z.array(z.string()).default([]),
  languages: z.array(z.string()).default([]),
  companies: z.array(z.string()).default([]),
  keywords: z.array(z.string()).default([])
});

export type ParsedResume = z.infer<typeof parsedResumeSchema>;

export const atsReportSchema = z.object({
  score: z.number().min(0).max(100),
  missingSkills: z.array(z.string()),
  strengths: z.array(z.string()),
  weaknesses: z.array(z.string()),
  suggestions: z.array(z.string()),
  improvedResume: z.string(),
  keywordSuggestions: z.array(z.string())
});

export type AtsReport = z.infer<typeof atsReportSchema>;
