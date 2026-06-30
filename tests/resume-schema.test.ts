import { describe, expect, it } from "vitest";
import { parsedResumeSchema } from "@/lib/schemas/resume";

describe("parsedResumeSchema", () => {
  it("accepts a complete parsed resume payload", () => {
    const parsed = parsedResumeSchema.parse({
      fullName: "Aarav Mehta",
      email: "aarav@example.com",
      phone: "+91 99999 99999",
      linkedin: "https://linkedin.com/in/aarav",
      github: "https://github.com/aarav",
      portfolio: "https://aarav.dev",
      address: "Bengaluru",
      location: "Bengaluru",
      summary: "ML engineer",
      expectedSalary: "4500000",
      currentSalary: "3500000",
      noticePeriod: "30 days",
      skills: { hard: ["Python"], soft: ["Leadership"], tools: ["AWS"] },
      experience: [{ company: "NovaHire", designation: "Senior ML Engineer", achievements: ["Built parser"], description: "AI systems" }],
      education: [{ institution: "IISc", degree: "M.Tech" }],
      projects: [{ name: "Resume Intelligence", technologies: ["RAG"] }],
      certifications: ["AWS"],
      languages: ["English"],
      companies: ["NovaHire"],
      keywords: ["NLP"]
    });

    expect(parsed.skills.hard).toContain("Python");
  });
});
