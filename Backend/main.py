"""
PublicVoice API – JWT auth and report endpoints.
Main report flow uses AI processing in services.ai_processor.
"""
from dotenv import load_dotenv
load_dotenv()  # Load .env before config so API keys etc. are available

import logging
from contextlib import asynccontextmanager

from fastapi import FastAPI, Request, HTTPException
from fastapi.staticfiles import StaticFiles
from pathlib import Path
from pydantic import BaseModel, Field
import httpx
import os
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)
from fastapi.middleware.cors import CORSMiddleware
from fastapi.exceptions import RequestValidationError
from fastapi.responses import JSONResponse

from core.config import settings
from models.base import init_db
from routers import auth, contact, reports, users, upload


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Create DB tables on startup; log AI/NLP status and CORS origins."""
    init_db()
    logger.info("CORS allowed origins: %s", settings.CORS_ORIGINS)
    if (os.getenv("ANTHROPIC_API_KEY") or "").strip():
        logger.info("AI/NLP enabled (Claude): citizen reports will be translated, rewritten formally, and structured.")
    else:
        logger.info("AI/NLP disabled. Set ANTHROPIC_API_KEY in Backend/.env to enable report translation/structuring.")
    if settings.email_configured:
        logger.info("Contact form inbox: %s", settings.CONTACT_INBOX_EMAIL)
        logger.info("SMTP configured: OTP and password-reset emails will be sent to users.")
        logger.info("SMTP login as: %s (app password length: %d; use 16-char Gmail App Password if 535)", settings.SMTP_USER, len(settings.SMTP_PASSWORD))
    else:
        logger.warning(
            "SMTP not configured. OTP emails will NOT be sent. Set SMTP_HOST, SMTP_USER, SMTP_PASSWORD in .env to send OTP to email."
        )
    yield
    # shutdown: nothing to close for PostgreSQL with current setup


app = FastAPI(
    title=settings.APP_NAME,
    description="Civic engagement platform API – admin auth (JWT), citizen reports.",
    version=settings.APP_VERSION,
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origin_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
    expose_headers=["*"],
)


def _first_validation_message(detail: list) -> str:
    """Get first user-facing message from Pydantic validation detail."""
    for item in detail:
        if isinstance(item, dict) and "msg" in item:
            return str(item["msg"])
    return "Invalid request"


def _get_validation_errors(exc: RequestValidationError) -> list:
    """Get error list from RequestValidationError (FastAPI/Starlette)."""
    if hasattr(exc, "errors") and callable(exc.errors):
        return exc.errors()
    return getattr(exc, "detail", []) or []


def _cors_headers(request: Request):
    """Return CORS headers for the request origin if allowed (so errors still have CORS)."""
    origin = request.headers.get("origin", "").strip()
    if origin and origin in settings.cors_origin_list:
        return {"Access-Control-Allow-Origin": origin, "Access-Control-Allow-Credentials": "true"}
    return {}


@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request: Request, exc: RequestValidationError):
    """Return 422 with a single clear message for the frontend."""
    try:
        detail = _get_validation_errors(exc)
        message = _first_validation_message(detail)
        logger.info("Validation failed (422): %s", message)
    except Exception:
        message = "Invalid request"
    return JSONResponse(
        status_code=422,
        content={"detail": message},
        headers=_cors_headers(request),
    )


@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    """Ensure 500 responses include CORS headers so the browser doesn't show a CORS error."""
    from fastapi import HTTPException
    if isinstance(exc, HTTPException):
        return JSONResponse(
            status_code=exc.status_code,
            content={"detail": exc.detail} if isinstance(exc.detail, str) else exc.detail,
            headers=_cors_headers(request),
        )
    logger.exception("Unhandled exception: %s", exc)
    return JSONResponse(
        status_code=500,
        content={"detail": "Internal server error"},
        headers=_cors_headers(request),
    )


app.include_router(auth.router)
app.include_router(contact.router)
app.include_router(reports.router)
app.include_router(users.router)
app.include_router(upload.router)

# Serve uploaded files (profile images, evidence)
uploads_dir = Path(__file__).resolve().parent / "uploads"
uploads_dir.mkdir(exist_ok=True)
(uploads_dir / "evidence").mkdir(exist_ok=True)
app.mount("/uploads", StaticFiles(directory=str(uploads_dir)), name="uploads")


@app.get("/")
async def root():
    return {
        "message": "Welcome to PublicVoice API",
        "status": "running",
        "version": settings.APP_VERSION,
    }


@app.get("/api")
async def health_check():
    ai_key_set = bool((os.getenv("ANTHROPIC_API_KEY") or "").strip())
    return {
        "status": "healthy",
        "message": "PublicVoice API is running",
        "ai_translation_enabled": ai_key_set,
    }


class TestTransRequest(BaseModel):
    text: str = Field(..., title="Text to format", example="make this formal")
    model: str = Field("claude-sonnet-4-5", title="Model id to call")
    stream: bool = Field(False, title="Stream flag")
    mode: str = Field("translate", title="Mode: 'translate' (default)")


class TestTransResponse(BaseModel):
    formatted_text: str
    raw_response: dict


ANTHROPIC_API_KEY = os.getenv("ANTHROPIC_API_KEY")
MODEL = os.getenv("CLAUDE_MODEL", "claude-sonnet-4-5")


@app.post("/api/test-trans", response_model=TestTransResponse)
async def test_trans(request: TestTransRequest):

    mode = request.mode.lower().strip()

    # Default behavior: translate to English and make it formal.
    if mode != "translate":
        logger.info("Unsupported mode '%s'; using translate mode.", mode)

    prompt = f"""You are a professional translator and editor.

Translate the text into English and rewrite it in a formal and professional tone.

Rules:
- Return ONLY the final text.
- No explanations, no labels, no quotes.

Text:
{request.text}
"""

    headers = {
        "x-api-key": ANTHROPIC_API_KEY,
        "anthropic-version": "2023-06-01",
        "content-type": "application/json",
    }

    body = {
        "model": MODEL,
        "max_tokens": 200,
        "temperature": 0.2,
        "messages": [
            {
                "role": "user",
                "content": prompt
            }
        ]
    }

    try:
        async with httpx.AsyncClient(timeout=20.0) as client:
            resp = await client.post(
                "https://api.anthropic.com/v1/messages",
                headers=headers,
                json=body
            )
            resp.raise_for_status()
            data = resp.json()

        formatted_text = data["content"][0]["text"].strip()

        return TestTransResponse(
            formatted_text=formatted_text,
            raw_response=data
        )

    except httpx.HTTPStatusError as e:
        logger.error("Claude API error: %s", e.response.text)
        raise HTTPException(status_code=e.response.status_code, detail=e.response.text)

    except Exception as e:
        logger.exception("Claude API failure: %s", e)
        raise HTTPException(status_code=500, detail="Claude API request failed")


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=int(__import__("os").getenv("PORT", "8000")),
        reload=settings.DEBUG,
    )
