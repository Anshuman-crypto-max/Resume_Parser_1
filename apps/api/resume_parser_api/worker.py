from celery import Celery

from .config import get_settings
from .services import parse_resume_text

settings = get_settings()
celery_app = Celery("resume_parser", broker=settings.redis_url, backend=settings.redis_url)


@celery_app.task(name="resume_parser.parse_text")
def parse_text_task(text: str) -> dict:
    return parse_resume_text(text).model_dump()
