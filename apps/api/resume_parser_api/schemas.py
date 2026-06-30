from pydantic import BaseModel, ConfigDict, EmailStr, Field


class ExperienceItem(BaseModel):
    company: str = ""
    designation: str = ""
    start_date: str = ""
    end_date: str = ""
    duration: str = ""
    location: str = ""
    achievements: list[str] = Field(default_factory=list)
    description: str = ""


class EducationItem(BaseModel):
    institution: str = ""
    degree: str = ""
    field: str = ""
    start_year: str = ""
    end_year: str = ""
    grade: str = ""


class ProjectItem(BaseModel):
    name: str = ""
    description: str = ""
    technologies: list[str] = Field(default_factory=list)
    url: str = ""


class SkillSet(BaseModel):
    hard: list[str] = Field(default_factory=list)
    soft: list[str] = Field(default_factory=list)
    tools: list[str] = Field(default_factory=list)


class ParsedResume(BaseModel):
    model_config = ConfigDict(extra="ignore")

    full_name: str = ""
    email: EmailStr | str = ""
    phone: str = ""
    linkedin: str = ""
    github: str = ""
    portfolio: str = ""
    address: str = ""
    location: str = ""
    summary: str = ""
    recommended_roles: list[str] = Field(default_factory=list)
    strengths: list[str] = Field(default_factory=list)
    weaknesses: list[str] = Field(default_factory=list)
    skills: SkillSet = Field(default_factory=SkillSet)
    experience: list[ExperienceItem] = Field(default_factory=list)
    education: list[EducationItem] = Field(default_factory=list)
    projects: list[ProjectItem] = Field(default_factory=list)
    certifications: list[str] = Field(default_factory=list)
    languages: list[str] = Field(default_factory=list)
    keywords: list[str] = Field(default_factory=list)


class CandidateOut(BaseModel):
    id: str
    full_name: str
    email: str | None = None
    phone: str | None = None
    location: str | None = None
    summary: str | None = None
    hard_skills: list[str] = Field(default_factory=list)
    soft_skills: list[str] = Field(default_factory=list)
    keywords: list[str] = Field(default_factory=list)
    status: str

    model_config = ConfigDict(from_attributes=True)


class MatchRequest(BaseModel):
    job_description: str = Field(min_length=80)
    candidate_ids: list[str] = Field(default_factory=list)


class MatchResult(BaseModel):
    candidate_id: str
    score: int
    missing_skills: list[str]
    strengths: list[str]
    recommendation: str
