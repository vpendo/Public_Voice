"""
PublicVoice API – FastAPI app with JWT auth and report endpoints.
"""
from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv

from core.config import settings
from models.base import init_db
from routers import auth, reports

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

app.include_router(auth.router)
app.include_router(reports.router)


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
