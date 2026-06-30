from datetime import datetime
from enum import Enum

from sqlalchemy import DateTime, ForeignKey, Integer, String, Text, UniqueConstraint, func
from sqlalchemy.dialects.postgresql import ARRAY, JSONB
from sqlalchemy.orm import Mapped, mapped_column, relationship

from .database import Base


class CandidateStatus(str, Enum):
    NEW = "NEW"
    REVIEWING = "REVIEWING"
    SHORTLISTED = "SHORTLISTED"
    INTERVIEWING = "INTERVIEWING"
    OFFER = "OFFER"
    HIRED = "HIRED"
    REJECTED = "REJECTED"
    ARCHIVED = "ARCHIVED"


class Organization(Base):
    __tablename__ = "organizations"

    id: Mapped[str] = mapped_column(String, primary_key=True)
    name: Mapped[str] = mapped_column(String(180), nullable=False)
    slug: Mapped[str] = mapped_column(String(180), unique=True, nullable=False)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())
    candidates: Mapped[list["Candidate"]] = relationship(back_populates="organization", cascade="all, delete-orphan")


class Candidate(Base):
    __tablename__ = "candidates"

    id: Mapped[str] = mapped_column(String, primary_key=True)
    organization_id: Mapped[str] = mapped_column(ForeignKey("organizations.id", ondelete="CASCADE"), index=True)
    full_name: Mapped[str] = mapped_column(String(220), nullable=False)
    email: Mapped[str | None] = mapped_column(String(320), index=True)
    phone: Mapped[str | None] = mapped_column(String(80))
    location: Mapped[str | None] = mapped_column(String(180), index=True)
    linkedin: Mapped[str | None] = mapped_column(String(500))
    github: Mapped[str | None] = mapped_column(String(500))
    portfolio: Mapped[str | None] = mapped_column(String(500))
    summary: Mapped[str | None] = mapped_column(Text)
    hard_skills: Mapped[list[str]] = mapped_column(ARRAY(String), default=list)
    soft_skills: Mapped[list[str]] = mapped_column(ARRAY(String), default=list)
    keywords: Mapped[list[str]] = mapped_column(ARRAY(String), default=list)
    status: Mapped[str] = mapped_column(String(40), default=CandidateStatus.NEW.value, index=True)
    parsed_json: Mapped[dict] = mapped_column(JSONB, default=dict)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now(), index=True)
    updated_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())

    organization: Mapped[Organization] = relationship(back_populates="candidates")
    resumes: Mapped[list["Resume"]] = relationship(back_populates="candidate")


class Resume(Base):
    __tablename__ = "resumes"
    __table_args__ = (UniqueConstraint("organization_id", "checksum", name="uq_resume_org_checksum"),)

    id: Mapped[str] = mapped_column(String, primary_key=True)
    organization_id: Mapped[str] = mapped_column(ForeignKey("organizations.id", ondelete="CASCADE"), index=True)
    candidate_id: Mapped[str | None] = mapped_column(ForeignKey("candidates.id", ondelete="SET NULL"), index=True)
    file_name: Mapped[str] = mapped_column(String(500), nullable=False)
    file_type: Mapped[str] = mapped_column(String(120), nullable=False)
    file_size: Mapped[int] = mapped_column(Integer, nullable=False)
    storage_path: Mapped[str] = mapped_column(String(900), nullable=False)
    checksum: Mapped[str] = mapped_column(String(128), nullable=False)
    raw_text: Mapped[str | None] = mapped_column(Text)
    status: Mapped[str] = mapped_column(String(40), default="UPLOADED", index=True)
    parsed_json: Mapped[dict] = mapped_column(JSONB, default=dict)
    uploaded_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())

    candidate: Mapped[Candidate | None] = relationship(back_populates="resumes")


class AtsScore(Base):
    __tablename__ = "ats_scores"

    id: Mapped[str] = mapped_column(String, primary_key=True)
    organization_id: Mapped[str] = mapped_column(ForeignKey("organizations.id", ondelete="CASCADE"), index=True)
    candidate_id: Mapped[str | None] = mapped_column(ForeignKey("candidates.id", ondelete="SET NULL"), index=True)
    job_title: Mapped[str | None] = mapped_column(String(220))
    job_description: Mapped[str] = mapped_column(Text, nullable=False)
    score: Mapped[int] = mapped_column(Integer, nullable=False, index=True)
    missing_skills: Mapped[list[str]] = mapped_column(ARRAY(String), default=list)
    strengths: Mapped[list[str]] = mapped_column(ARRAY(String), default=list)
    weaknesses: Mapped[list[str]] = mapped_column(ARRAY(String), default=list)
    suggestions: Mapped[list[str]] = mapped_column(ARRAY(String), default=list)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())
