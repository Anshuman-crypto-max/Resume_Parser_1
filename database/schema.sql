CREATE EXTENSION IF NOT EXISTS vector;

CREATE TABLE organizations (
  id text PRIMARY KEY,
  name varchar(180) NOT NULL,
  slug varchar(180) NOT NULL UNIQUE,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE users (
  id text PRIMARY KEY,
  clerk_id text NOT NULL UNIQUE,
  email varchar(320) NOT NULL UNIQUE,
  name varchar(220),
  image_url text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE organization_users (
  id text PRIMARY KEY,
  user_id text NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  organization_id text NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  role varchar(40) NOT NULL DEFAULT 'RECRUITER',
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, organization_id)
);

CREATE TABLE candidates (
  id text PRIMARY KEY,
  organization_id text NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  full_name varchar(220) NOT NULL,
  email varchar(320),
  phone varchar(80),
  linkedin text,
  github text,
  portfolio text,
  address text,
  location varchar(180),
  current_salary integer,
  expected_salary integer,
  notice_period varchar(120),
  summary text,
  status varchar(40) NOT NULL DEFAULT 'NEW',
  tags text[] NOT NULL DEFAULT '{}',
  keywords text[] NOT NULL DEFAULT '{}',
  soft_skills text[] NOT NULL DEFAULT '{}',
  hard_skills text[] NOT NULL DEFAULT '{}',
  source varchar(80) NOT NULL DEFAULT 'upload',
  parsed_json jsonb NOT NULL DEFAULT '{}',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE resumes (
  id text PRIMARY KEY,
  organization_id text NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  candidate_id text REFERENCES candidates(id) ON DELETE SET NULL,
  file_name text NOT NULL,
  file_type varchar(120) NOT NULL,
  file_size integer NOT NULL CHECK (file_size > 0),
  storage_path text NOT NULL,
  checksum varchar(128) NOT NULL,
  raw_text text,
  parsed_json jsonb NOT NULL DEFAULT '{}',
  status varchar(40) NOT NULL DEFAULT 'UPLOADED',
  virus_scan jsonb NOT NULL DEFAULT '{}',
  uploaded_at timestamptz NOT NULL DEFAULT now(),
  parsed_at timestamptz,
  UNIQUE (organization_id, checksum)
);

CREATE TABLE skills (
  id text PRIMARY KEY,
  organization_id text NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  name varchar(180) NOT NULL,
  category varchar(80) NOT NULL DEFAULT 'technical',
  UNIQUE (organization_id, name)
);

CREATE TABLE candidate_skills (
  candidate_id text NOT NULL REFERENCES candidates(id) ON DELETE CASCADE,
  skill_id text NOT NULL REFERENCES skills(id) ON DELETE CASCADE,
  confidence numeric(4,3) NOT NULL DEFAULT 1,
  PRIMARY KEY (candidate_id, skill_id)
);

CREATE TABLE embeddings (
  id text PRIMARY KEY,
  candidate_id text NOT NULL REFERENCES candidates(id) ON DELETE CASCADE,
  content text NOT NULL,
  content_type varchar(80) NOT NULL,
  vector vector(3072),
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE ats_scores (
  id text PRIMARY KEY,
  organization_id text NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  candidate_id text REFERENCES candidates(id) ON DELETE SET NULL,
  resume_id text REFERENCES resumes(id) ON DELETE SET NULL,
  job_title varchar(220),
  job_description text NOT NULL,
  score integer NOT NULL CHECK (score BETWEEN 0 AND 100),
  missing_skills text[] NOT NULL DEFAULT '{}',
  strengths text[] NOT NULL DEFAULT '{}',
  weaknesses text[] NOT NULL DEFAULT '{}',
  suggestions text[] NOT NULL DEFAULT '{}',
  improved_resume text,
  keywords text[] NOT NULL DEFAULT '{}',
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE audit_logs (
  id text PRIMARY KEY,
  organization_id text NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  user_id text REFERENCES users(id) ON DELETE SET NULL,
  action varchar(120) NOT NULL,
  entity_type varchar(120) NOT NULL,
  entity_id text,
  metadata jsonb NOT NULL DEFAULT '{}',
  ip_address inet,
  user_agent text,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_candidates_org_status ON candidates(organization_id, status);
CREATE INDEX idx_candidates_location ON candidates(organization_id, location);
CREATE INDEX idx_candidates_email ON candidates(organization_id, email);
CREATE INDEX idx_resumes_org_status ON resumes(organization_id, status);
CREATE INDEX idx_skills_org_category ON skills(organization_id, category);
CREATE INDEX idx_embeddings_vector ON embeddings USING ivfflat (vector vector_cosine_ops) WITH (lists = 100);
CREATE INDEX idx_ats_scores_org_score ON ats_scores(organization_id, score DESC);
CREATE INDEX idx_audit_logs_org_action ON audit_logs(organization_id, action, created_at DESC);
