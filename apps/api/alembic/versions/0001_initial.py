"""initial resume parser api tables

Revision ID: 0001_initial
Revises:
Create Date: 2026-06-30
"""

from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

revision = "0001_initial"
down_revision = None
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.execute("CREATE EXTENSION IF NOT EXISTS vector")
    op.create_table(
        "organizations",
        sa.Column("id", sa.String(), primary_key=True),
        sa.Column("name", sa.String(length=180), nullable=False),
        sa.Column("slug", sa.String(length=180), nullable=False, unique=True),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.func.now()),
    )
    op.create_table(
        "candidates",
        sa.Column("id", sa.String(), primary_key=True),
        sa.Column("organization_id", sa.String(), sa.ForeignKey("organizations.id", ondelete="CASCADE"), nullable=False),
        sa.Column("full_name", sa.String(length=220), nullable=False),
        sa.Column("email", sa.String(length=320)),
        sa.Column("phone", sa.String(length=80)),
        sa.Column("location", sa.String(length=180)),
        sa.Column("linkedin", sa.String(length=500)),
        sa.Column("github", sa.String(length=500)),
        sa.Column("portfolio", sa.String(length=500)),
        sa.Column("summary", sa.Text()),
        sa.Column("hard_skills", postgresql.ARRAY(sa.String()), server_default="{}"),
        sa.Column("soft_skills", postgresql.ARRAY(sa.String()), server_default="{}"),
        sa.Column("keywords", postgresql.ARRAY(sa.String()), server_default="{}"),
        sa.Column("status", sa.String(length=40), server_default="NEW"),
        sa.Column("parsed_json", postgresql.JSONB(), server_default="{}"),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.func.now()),
        sa.Column("updated_at", sa.DateTime(timezone=True), server_default=sa.func.now()),
    )
    op.create_index("ix_candidates_org_status", "candidates", ["organization_id", "status"])
    op.create_index("ix_candidates_email", "candidates", ["email"])
    op.create_index("ix_candidates_location", "candidates", ["location"])
    op.create_table(
        "resumes",
        sa.Column("id", sa.String(), primary_key=True),
        sa.Column("organization_id", sa.String(), sa.ForeignKey("organizations.id", ondelete="CASCADE"), nullable=False),
        sa.Column("candidate_id", sa.String(), sa.ForeignKey("candidates.id", ondelete="SET NULL")),
        sa.Column("file_name", sa.String(length=500), nullable=False),
        sa.Column("file_type", sa.String(length=120), nullable=False),
        sa.Column("file_size", sa.Integer(), nullable=False),
        sa.Column("storage_path", sa.String(length=900), nullable=False),
        sa.Column("checksum", sa.String(length=128), nullable=False),
        sa.Column("raw_text", sa.Text()),
        sa.Column("status", sa.String(length=40), server_default="UPLOADED"),
        sa.Column("parsed_json", postgresql.JSONB(), server_default="{}"),
        sa.Column("uploaded_at", sa.DateTime(timezone=True), server_default=sa.func.now()),
        sa.UniqueConstraint("organization_id", "checksum", name="uq_resume_org_checksum"),
    )
    op.create_index("ix_resumes_org_status", "resumes", ["organization_id", "status"])
    op.create_table(
        "ats_scores",
        sa.Column("id", sa.String(), primary_key=True),
        sa.Column("organization_id", sa.String(), sa.ForeignKey("organizations.id", ondelete="CASCADE"), nullable=False),
        sa.Column("candidate_id", sa.String(), sa.ForeignKey("candidates.id", ondelete="SET NULL")),
        sa.Column("job_title", sa.String(length=220)),
        sa.Column("job_description", sa.Text(), nullable=False),
        sa.Column("score", sa.Integer(), nullable=False),
        sa.Column("missing_skills", postgresql.ARRAY(sa.String()), server_default="{}"),
        sa.Column("strengths", postgresql.ARRAY(sa.String()), server_default="{}"),
        sa.Column("weaknesses", postgresql.ARRAY(sa.String()), server_default="{}"),
        sa.Column("suggestions", postgresql.ARRAY(sa.String()), server_default="{}"),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.func.now()),
    )
    op.create_index("ix_ats_scores_org_score", "ats_scores", ["organization_id", "score"])


def downgrade() -> None:
    op.drop_table("ats_scores")
    op.drop_table("resumes")
    op.drop_table("candidates")
    op.drop_table("organizations")
