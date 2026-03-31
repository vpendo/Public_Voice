"""
Application configuration from environment variables.
Never commit .env; use env.example as template.
"""
import os
from pathlib import Path
from typing import List, Optional
from urllib.parse import urlparse
from dotenv import load_dotenv

# Load .env: first from cwd (when you run from Backend/), then from Backend folder explicitly
_backend_dir = Path(__file__).resolve().parent.parent
_env_file = _backend_dir / ".env"
load_dotenv()  # cwd – e.g. when running from Backend/
load_dotenv(_env_file)  # explicit – so Backend/.env is always tried


class Settings:
    """Load settings from environment."""

    def __init__(self) -> None:
        # ---------------- App Info ----------------
        self.APP_NAME: str = os.getenv("APP_NAME", "PublicVoice")
        self.APP_VERSION: str = os.getenv("APP_VERSION", "1.0.0")
        self.ENVIRONMENT: str = os.getenv("ENVIRONMENT", "development")
        self.DEBUG: bool = self._to_bool(os.getenv("DEBUG", "false"))
        # Demo/support toggle: when true, OTP endpoints may include dev_otp in responses.
        # Keep false in real production.
        self.ALLOW_DEV_OTP_RESPONSE: bool = self._to_bool(
            os.getenv("ALLOW_DEV_OTP_RESPONSE", "false")
        )

        # ---------------- Database ----------------
        # PostgreSQL only. Set DATABASE_URL in .env (e.g. postgresql://user:pass@host:5432/dbname).
        self.DATABASE_URL: str = os.getenv(
            "DATABASE_URL",
            "postgresql://postgres:postgres@localhost:5432/publicvoice"
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

        # ---------------- AI / NLP (OpenAI) ----------------
        self.OPENAI_API_KEY: str = os.getenv("OPENAI_API_KEY", "").strip()
        self.OPENAI_API_BASE: Optional[str] = (
            os.getenv("OPENAI_API_BASE", "").strip() or None
        )  # optional, e.g., Azure endpoint
        self.OPENAI_MODEL: str = os.getenv("OPENAI_MODEL", "gpt-4o-mini")

        # ---------------- Production Security Check ----------------
        if self.ENVIRONMENT == "production" and self.SECRET_KEY.startswith("change-me"):
            raise ValueError("SECRET_KEY must be set in production")

        # ---------------- CORS ----------------
        # Default includes both local development and deployed frontend URLs
        _cors_default = "http://localhost:5173,http://127.0.0.1:5173,http://localhost:3000,http://127.0.0.1:3000,https://publicvoice1.netlify.app,https://publicvoice.rw,https://www.publicvoice.rw"
        _cors_raw = os.getenv("CORS_ORIGINS", _cors_default)
        self.CORS_ORIGINS = [o.strip() for o in _cors_raw.split(",") if o.strip()]
        if not self.CORS_ORIGINS:
            self.CORS_ORIGINS = []
        
        # Always ensure localhost origins are included for local development
        # This ensures local frontend can connect even if CORS_ORIGINS only has production URL
        _dev_origins = ["http://localhost:5173", "http://127.0.0.1:5173", "http://localhost:3000", "http://127.0.0.1:3000"]
        for origin in _dev_origins:
            if origin not in self.CORS_ORIGINS:
                self.CORS_ORIGINS.append(origin)
        
        # Always ensure deployed frontend URL is included
        _prod_frontends = [
            "https://publicvoice1.netlify.app",
            "https://publicvoice.rw",
            "https://www.publicvoice.rw",
        ]
        for origin in _prod_frontends:
            if origin not in self.CORS_ORIGINS:
                self.CORS_ORIGINS.append(origin)

        # ---------------- Email (Forgot-password / reset) ----------------
        self.FRONTEND_URL: str = os.getenv("FRONTEND_URL", "http://localhost:5173").rstrip("/")
        # Support both legacy SMTP_* and EMAIL_* variable names.
        self.SMTP_HOST: str = (os.getenv("SMTP_HOST") or os.getenv("EMAIL_SMTP_SERVER") or "").strip()
        self.SMTP_PORT: int = self._to_int(
            os.getenv("SMTP_PORT") or os.getenv("EMAIL_SMTP_PORT"),
            default=587,
        )
        self.SMTP_USER: str = (os.getenv("SMTP_USER") or os.getenv("EMAIL_LOGIN") or "").strip()
        # Strip all spaces (Gmail app passwords are often pasted with spaces)
        self.SMTP_PASSWORD: str = (os.getenv("SMTP_PASSWORD") or os.getenv("EMAIL_SENDER_PASSWORD") or "").strip().replace(" ", "")
        self.SMTP_FROM_EMAIL: str = os.getenv(
            "SMTP_FROM_EMAIL", (os.getenv("EMAIL_SENDER_EMAIL") or self.SMTP_USER or "noreply@publicvoice.rw")
        ).strip()
        self.SMTP_USE_TLS: bool = self._to_bool(os.getenv("SMTP_USE_TLS", "true"))
        # Comma-separated emails to notify when a new report is submitted (optional)
        self.ADMIN_NOTIFY_EMAILS: str = os.getenv("ADMIN_NOTIFY_EMAILS", "").strip()
        # Inbox for public website contact form (override via .env if needed)
        self.CONTACT_INBOX_EMAIL: str = os.getenv(
            "CONTACT_INBOX_EMAIL", "publicvoicerwanda@gmail.com"
        ).strip()

    @property
    def email_configured(self) -> bool:
        """True if SMTP is configured for OTP and password-reset emails."""
        return bool(self.SMTP_HOST and self.SMTP_USER and self.SMTP_PASSWORD)

    def _to_bool(self, value: str) -> bool:
        """Convert string env variable to bool. Strips whitespace so ' true ' works."""
        return (value or "").strip().lower() in ("true", "1", "yes")

    def _to_int(self, value: Optional[str], default: int) -> int:
        """Convert env variable to int safely; fallback to default on invalid input."""
        try:
            return int((value or "").strip())
        except (TypeError, ValueError):
            return default

    @property
    def cors_origin_list(self) -> List[str]:
        """Used by FastAPI main.py to configure CORS middleware."""
        return self.CORS_ORIGINS

    def is_allowed_origin(self, origin: str) -> bool:
        """Check whether an Origin header should be allowed for CORS."""
        value = (origin or "").strip()
        if not value:
            return False
        if value in self.CORS_ORIGINS:
            return True
        try:
            parsed = urlparse(value)
            host = (parsed.hostname or "").lower()
        except Exception:
            return False
        # Allow Netlify subdomains for previews and custom branch deploy URLs.
        if host.endswith(".netlify.app"):
            return True
        return False


# Singleton instance
settings = Settings()