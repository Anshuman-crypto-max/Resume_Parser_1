export type CandidateStatus =
  | "NEW"
  | "REVIEWING"
  | "SHORTLISTED"
  | "INTERVIEWING"
  | "OFFER"
  | "HIRED"
  | "REJECTED"
  | "ARCHIVED";

export type ParsedResume = {
  fullName: string;
  email: string;
  phone: string;
  linkedin: string;
  github: string;
  portfolio: string;
  address: string;
  location: string;
  summary: string;
  skills: {
    hard: string[];
    soft: string[];
    tools: string[];
  };
  experience: Array<{
    company: string;
    designation: string;
    startDate: string;
    endDate: string;
    duration: string;
    location: string;
    achievements: string[];
    description: string;
  }>;
  education: Array<{
    institution: string;
    degree: string;
    field: string;
    startYear: string;
    endYear: string;
    grade: string;
  }>;
  projects: Array<{
    name: string;
    description: string;
    technologies: string[];
    url: string;
  }>;
  certifications: string[];
  languages: string[];
  keywords: string[];
};

export type Candidate = {
  id: string;
  fullName: string;
  email?: string;
  location?: string;
  status: CandidateStatus;
  hardSkills: string[];
  softSkills: string[];
  createdAt: string;
};
