"""
Application configuration from environment variables.
Never commit .env; use env.example as template.
"""
import os
from typing import List, Optional


class Settings:
    """Load settings from environment."""

    def __init__(self) -> None:
        self.APP_NAME: str = os.getenv("APP_NAME", "PublicVoice")
        self.APP_VERSION: str = os.getenv("APP_VERSION", "1.0.0")
        self.ENVIRONMENT: str = os.getenv("ENVIRONMENT", "development")

        self.DEBUG: bool = self._to_bool(os.getenv("DEBUG", "false"))

        # Database
        self.DATABASE_URL: str = os.getenv(
            "DATABASE_URL",
            "sqlite:///./publicvoice.db"
        )

        # JWT
        self.SECRET_KEY: str = os.getenv(
            "SECRET_KEY",
            "change-me-in-production-use-openssl-rand-hex-32"
        )
        self.ALGORITHM: str = os.getenv("ALGORITHM", "HS256")
        self.ACCESS_TOKEN_EXPIRE_MINUTES: int = int(
            os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", "30")
        )

        # AI / NLP processing (OpenAI or compatible API)
        self.OPENAI_API_KEY: str = os.getenv("OPENAI_API_KEY", "").strip()
        self.OPENAI_API_BASE: Optional[str] = (os.getenv("OPENAI_API_BASE", "").strip() or None)  # e.g. Azure
        self.OPENAI_MODEL: str = os.getenv("OPENAI_MODEL", "gpt-4o-mini")

        # Security check
        if self.ENVIRONMENT == "production" and self.SECRET_KEY.startswith("change-me"):
            raise ValueError("SECRET_KEY must be set in production")

        # CORS (stored as list)
        self.CORS_ORIGINS: List[str] = [
            o.strip()
            for o in os.getenv(
                "CORS_ORIGINS",
                "http://localhost:5173,http://localhost:3000,http://127.0.0.1:5173"
            ).split(",")
            if o.strip()
        ]

        # Email (for forgot-password reset link)
        self.FRONTEND_URL: str = os.getenv("FRONTEND_URL", "http://localhost:5173").rstrip("/")
        self.SMTP_HOST: str = os.getenv("SMTP_HOST", "").strip()
        self.SMTP_PORT: int = int(os.getenv("SMTP_PORT", "587"))
        self.SMTP_USER: str = os.getenv("SMTP_USER", "").strip()
        self.SMTP_PASSWORD: str = os.getenv("SMTP_PASSWORD", "").strip()
        self.SMTP_FROM_EMAIL: str = os.getenv("SMTP_FROM_EMAIL", self.SMTP_USER or "noreply@publicvoice.rw").strip()
        self.SMTP_USE_TLS: bool = self._to_bool(os.getenv("SMTP_USE_TLS", "true"))

    @property
    def email_configured(self) -> bool:
        """True if SMTP is configured so we can send password-reset emails."""
        return bool(self.SMTP_HOST and self.SMTP_USER and self.SMTP_PASSWORD)

    def _to_bool(self, value: str) -> bool:
        return value.lower() in ("true", "1", "yes")

    # 🔥 IMPORTANT: property used by FastAPI main.py
    @property
    def cors_origin_list(self) -> List[str]:
        return self.CORS_ORIGINS


settings = Settings()
