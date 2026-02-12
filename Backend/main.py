"""
PublicVoice API – FastAPI app with JWT auth and report endpoints.
"""
import logging
from contextlib import asynccontextmanager

from fastapi import FastAPI, Request
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)
from fastapi.middleware.cors import CORSMiddleware
from fastapi.exceptions import RequestValidationError
from fastapi.responses import JSONResponse
from dotenv import load_dotenv

from core.config import settings
from models.base import init_db
from routers import auth, reports, users

load_dotenv()


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Create DB tables on startup."""
    init_db()
    yield
    # shutdown: nothing to close for SQLite/PSQL with current setup


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


@app.exception_handler(RequestValidationError)
async def validation_exception_handler(_request: Request, exc: RequestValidationError):
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
    )


app.include_router(auth.router)
app.include_router(reports.router)
app.include_router(users.router)


@app.get("/")
async def root():
    return {
        "message": "Welcome to PublicVoice API",
        "status": "running",
        "version": settings.APP_VERSION,
    }


@app.get("/api")
async def health_check():
    return {
        "status": "healthy",
        "message": "PublicVoice API is running",
    }


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=int(__import__("os").getenv("PORT", "8000")),
        reload=settings.DEBUG,
    )
