import hashlib
import json
import os
import re
import tempfile
import uuid

import fitz
from docx import Document
from openai import OpenAI

from .config import get_settings
from .schemas import MatchResult, ParsedResume


def checksum_bytes(content: bytes) -> str:
    return hashlib.sha256(content).hexdigest()


def extract_text(file_name: str, content: bytes) -> str:
    lower = file_name.lower()
    if lower.endswith(".pdf"):
        with fitz.open(stream=content, filetype="pdf") as pdf:
            text = "\n\n".join(page.get_text("text", sort=True) for page in pdf)
    elif lower.endswith(".docx"):
        temp_name = ""
        try:
            with tempfile.NamedTemporaryFile(delete=False, suffix=f"{uuid.uuid4()}.docx") as handle:
                handle.write(content)
                temp_name = handle.name
            document = Document(temp_name)
            text = "\n".join(paragraph.text for paragraph in document.paragraphs)
        finally:
            if temp_name and os.path.exists(temp_name):
                os.remove(temp_name)
    elif lower.endswith(".doc"):
        text = _extract_legacy_doc_text(content)
    else:
        raise ValueError("Unsupported file type. Upload PDF, DOCX, or DOC.")
    cleaned = re.sub(r"\s+", " ", text).strip()
    if len(cleaned) < 80:
        raise ValueError("Resume text is too short to parse reliably.")
    return cleaned[:90_000]


def _extract_legacy_doc_text(content: bytes) -> str:
    ascii_text = content.decode("latin1", errors="ignore")
    unicode_text = content.decode("utf-16-le", errors="ignore")
    combined = "\n".join([ascii_text, unicode_text])
    readable = re.sub(r"[^\x20-\x7E\r\n\t]+", " ", combined)
    return "\n".join(part for part in re.split(r"\s{2,}", readable) if re.search(r"[A-Za-z]{3,}", part))


def parse_resume_text(text: str) -> ParsedResume:
    settings = get_settings()
    if not settings.openai_api_key:
        return heuristic_parse(text)
    client = OpenAI(api_key=settings.openai_api_key)
    completion = client.beta.chat.completions.parse(
        model=settings.openai_model,
        temperature=0,
        response_format=ParsedResume,
        messages=[
            {"role": "system", "content": "Extract factual resume data as structured JSON. Do not invent details."},
            {"role": "user", "content": text},
        ],
    )
    parsed = completion.choices[0].message.parsed
    return parsed or ParsedResume.model_validate_json(completion.choices[0].message.content or "{}")


def heuristic_parse(text: str) -> ParsedResume:
    email = re.search(r"[\w.+-]+@[\w-]+\.[\w.-]+", text)
    phone = re.search(r"(?:\+?\d[\d\s().-]{7,}\d)", text)
    words = re.findall(r"\b[A-Z][a-z]+(?:\s+[A-Z][a-z]+){0,2}\b", text[:400])
    skills = [skill for skill in ["Python", "React", "SQL", "AWS", "Docker", "Kubernetes", "TypeScript", "FastAPI"] if skill.lower() in text.lower()]
    return ParsedResume(
        full_name=words[0] if words else "Unknown Candidate",
        email=email.group(0) if email else "",
        phone=phone.group(0).strip() if phone else "",
        summary=text[:500],
        skills={"hard": skills, "soft": [], "tools": []},
        keywords=skills,
    )


def rank_candidate(job_description: str, candidate: ParsedResume | dict) -> MatchResult:
    payload = candidate if isinstance(candidate, ParsedResume) else ParsedResume.model_validate(candidate)
    jd_tokens = {token.lower() for token in re.findall(r"[A-Za-z][A-Za-z+#.-]{2,}", job_description)}
    candidate_skills = set(map(str.lower, payload.skills.hard + payload.skills.tools + payload.keywords))
    overlap = sorted(jd_tokens.intersection(candidate_skills))
    missing = sorted(token for token in jd_tokens if token in {"python", "react", "sql", "aws", "docker", "fastapi", "typescript"} and token not in candidate_skills)
    score = min(98, 35 + len(overlap) * 9 + len(payload.experience) * 4)
    return MatchResult(
        candidate_id="inline",
        score=score,
        missing_skills=missing,
        strengths=overlap[:8],
        recommendation="Interview ready" if score >= 80 else "Review gaps before shortlist",
    )


def to_jsonable(parsed: ParsedResume) -> dict:
    return json.loads(parsed.model_dump_json())
