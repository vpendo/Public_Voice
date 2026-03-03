"""
Application configuration from environment variables.
Never commit .env; use env.example as template.
"""
import os
from typing import List, Optional


class Settings:
    """Load settings from environment."""

    def __init__(self) -> None:
        # ---------------- App Info ----------------
        self.APP_NAME: str = os.getenv("APP_NAME", "PublicVoice")
        self.APP_VERSION: str = os.getenv("APP_VERSION", "1.0.0")
        self.ENVIRONMENT: str = os.getenv("ENVIRONMENT", "development")
        self.DEBUG: bool = self._to_bool(os.getenv("DEBUG", "false"))

        # ---------------- Database ----------------
        self.DATABASE_URL: str = os.getenv(
            "DATABASE_URL",
            "sqlite:///./publicvoice.db"  # fallback for dev
        )

        # ---------------- JWT / Security ----------------
        self.SECRET_KEY: str = os.getenv(
            "SECRET_KEY",
            "change-me-in-production-use-openssl-rand-hex-32"
        )
        self.ALGORITHM: str = os.getenv("ALGORITHM", "HS256")
        self.ACCESS_TOKEN_EXPIRE_MINUTES: int = int(
            os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", "30")
        )

        # ---------------- AI / NLP (OpenAI SDK v2) ----------------
        # Make sure OPENAI_API_KEY is set in your .env for AI processing to work
        self.OPENAI_API_KEY: str = os.getenv("OPENAI_API_KEY", "").strip()
        self.OPENAI_API_BASE: Optional[str] = (os.getenv("OPENAI_API_BASE", "").strip() or None)  # optional, e.g., Azure endpoint
        self.OPENAI_MODEL: str = os.getenv("OPENAI_MODEL", "gpt-4o-mini")  # default to GPT-4o-mini

        # ---------------- Production Security Check ----------------
        if self.ENVIRONMENT == "production" and self.SECRET_KEY.startswith("change-me"):
            raise ValueError("SECRET_KEY must be set in production")

        # ---------------- CORS ----------------
        _cors_raw = os.getenv(
            "CORS_ORIGINS",
            "http://localhost:5173,http://localhost:3000,http://127.0.0.1:5173"
        )
        self.CORS_ORIGINS = [o.strip() for o in _cors_raw.split(",") if o.strip()]
        if not self.CORS_ORIGINS:
            self.CORS_ORIGINS = [
                "http://localhost:5173",
                "http://127.0.0.1:5173",
            ]

        # ---------------- Email (Forgot-password / reset) ----------------
        self.FRONTEND_URL: str = os.getenv("FRONTEND_URL", "http://localhost:5173").rstrip("/")
        self.SMTP_HOST: str = os.getenv("SMTP_HOST", "").strip()
        self.SMTP_PORT: int = int(os.getenv("SMTP_PORT", "587"))
        self.SMTP_USER: str = os.getenv("SMTP_USER", "").strip()
        self.SMTP_PASSWORD: str = os.getenv("SMTP_PASSWORD", "").strip()
        self.SMTP_FROM_EMAIL: str = os.getenv("SMTP_FROM_EMAIL", self.SMTP_USER or "noreply@publicvoice.rw").strip()
        self.SMTP_USE_TLS: bool = self._to_bool(os.getenv("SMTP_USE_TLS", "true"))
        # Comma-separated emails to notify when a new report is submitted (optional)
        self.ADMIN_NOTIFY_EMAILS: str = os.getenv("ADMIN_NOTIFY_EMAILS", "").strip()

    @property
    def email_configured(self) -> bool:
        """True if SMTP is configured so we can send password-reset emails."""
        return bool(self.SMTP_HOST and self.SMTP_USER and self.SMTP_PASSWORD)

    def _to_bool(self, value: str) -> bool:
        """Convert string env variable to bool."""
        return value.lower() in ("true", "1", "yes")

    @property
    def cors_origin_list(self) -> List[str]:
        """Used by FastAPI main.py to configure CORS middleware."""
        return self.CORS_ORIGINS


# Singleton instance
settings = Settings()