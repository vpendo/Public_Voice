"""
Database engine and session. Supports SQLite and PostgreSQL.
"""
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base
from sqlalchemy.pool import StaticPool

from core.config import settings

# SQLite needs check_same_thread=False for FastAPI
connect_args = {}
if settings.DATABASE_URL.startswith("sqlite"):
    connect_args["check_same_thread"] = False

# In-memory SQLite: use one connection so create_all() and all sessions share the same DB
engine_kw: dict = {
    "connect_args": connect_args,
    "echo": settings.DEBUG,
}
if ":memory:" in settings.DATABASE_URL:
    engine_kw["poolclass"] = StaticPool

engine = create_engine(
    settings.DATABASE_URL,
    **engine_kw,
    pool_pre_ping=":memory:" not in settings.DATABASE_URL,  # skip for in-memory
)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()


def get_db():
    """Yield a DB session for FastAPI Depends."""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def init_db() -> None:
    """
    Create tables (development only).
    In production, use Alembic migrations instead.
    """
    from models import user, report, otp  # register models

    Base.metadata.create_all(bind=engine)
