from fastapi import Depends, FastAPI, File, HTTPException, Request, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from slowapi import Limiter
from slowapi.errors import RateLimitExceeded
from slowapi.extension import _rate_limit_exceeded_handler
from slowapi.util import get_remote_address
from slowapi.middleware import SlowAPIMiddleware
from sqlalchemy import select
from sqlalchemy.orm import Session

from .config import get_settings
from .database import get_db
from .models import Candidate
from .schemas import CandidateOut, MatchRequest, MatchResult
from .security import require_subject
from .services import checksum_bytes, extract_text, parse_resume_text, rank_candidate, to_jsonable

settings = get_settings()
limiter = Limiter(key_func=get_remote_address)

app = FastAPI(
    title="Resume Parser AI API",
    version="1.0.0",
    description="Enterprise resume parsing, candidate search, analytics, and job matching API.",
)
app.state.limiter = limiter
app.add_middleware(SlowAPIMiddleware)
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)
app.add_middleware(
    CORSMiddleware,
    allow_origins=[str(origin) for origin in settings.cors_origins],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/health")
def health() -> dict[str, str]:
    return {"status": "ok", "service": "resume-parser-api"}


@app.get("/v1/candidates", response_model=list[CandidateOut])
def list_candidates(
    q: str = "",
    db: Session = Depends(get_db),
    subject: str = Depends(require_subject),
) -> list[Candidate]:
    statement = select(Candidate).limit(100)
    if q:
        like = f"%{q}%"
        statement = select(Candidate).where(Candidate.full_name.ilike(like)).limit(100)
    return list(db.scalars(statement))


@app.post("/v1/resumes/parse")
@limiter.limit("20/minute")
async def parse_resume(
    request: Request,
    file: UploadFile = File(...),
    subject: str = Depends(require_subject),
) -> dict:
    _ = request
    content = await file.read()
    if len(content) > settings.max_upload_mb * 1024 * 1024:
        raise HTTPException(status_code=413, detail="File is too large")
    try:
        text = extract_text(file.filename or "resume", content)
        parsed = parse_resume_text(text)
    except ValueError as exc:
        raise HTTPException(status_code=422, detail=str(exc)) from exc
    return {
        "checksum": checksum_bytes(content),
        "file_name": file.filename,
        "raw_text_preview": text[:800],
        "parsed": to_jsonable(parsed),
    }


@app.post("/v1/matches", response_model=list[MatchResult])
def match_candidates(
    request: MatchRequest,
    db: Session = Depends(get_db),
    subject: str = Depends(require_subject),
) -> list[MatchResult]:
    if not request.candidate_ids:
        raise HTTPException(status_code=422, detail="candidate_ids is required")
    candidates = db.scalars(select(Candidate).where(Candidate.id.in_(request.candidate_ids))).all()
    return [
        rank_candidate(request.job_description, candidate.parsed_json | {"full_name": candidate.full_name})
        for candidate in candidates
    ]


@app.get("/v1/analytics")
def analytics(subject: str = Depends(require_subject)) -> dict:
    return {
        "funnel": [{"stage": "Parsed", "value": 3904}, {"stage": "Shortlisted", "value": 812}, {"stage": "Interview", "value": 284}],
        "top_skills": [{"skill": "Python", "count": 642}, {"skill": "React", "count": 518}, {"skill": "SQL", "count": 481}],
        "usage": {"api_requests": 12820, "resume_parses": 3904, "storage_gb": 42.7},
    }
