# Database

The platform uses normalized PostgreSQL with Supabase-hosted Postgres, Supabase Storage for resume files, and `pgvector` for semantic candidate search.

- `schema.sql` contains the deployable SQL baseline with indexes, constraints, foreign keys, and vector search.
- `../prisma/schema.prisma` is the Next.js application ORM schema.
- `../apps/api/alembic` contains FastAPI SQLAlchemy migrations for the backend service.

Apply the SQL baseline in Supabase SQL editor or run:

```bash
psql "$DATABASE_URL" -f database/schema.sql
```
