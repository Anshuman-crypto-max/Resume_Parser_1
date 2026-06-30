# Developer Documentation

## Local Setup

```bash
npm install
cp .env.example .env.local
npm run prisma:generate
npm run prisma:migrate
npm run dev
```

## Data Flow

1. Recruiter uploads a PDF or DOCX in `/dashboard/upload`.
2. `/api/resumes/upload` validates file type and size, extracts text, computes checksum, checks duplicates, uploads the source file to Supabase Storage, calls OpenAI for strict JSON extraction, and stores candidate records.
3. Search routes query normalized fields and are ready for pgvector semantic ranking.
4. ATS routes compare resume text with a job description and persist score reports.
5. Usage and audit events are recorded for security, billing, and admin review.

## Security

- Clerk protects dashboard and API routes.
- Zod validates request bodies and AI responses.
- Prisma parameterizes database access.
- Uploads are size and type checked.
- API keys are hashed; raw secrets are returned only once.
- Upstash rate limits write-heavy routes.
- Audit logs capture sensitive operations.

## Extending Semantic Search

Store embeddings in `Embedding.vector`, then add a raw SQL query using pgvector cosine distance:

```sql
select id, content
from "Embedding"
order by vector <=> $1
limit 20;
```
