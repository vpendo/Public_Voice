"""
Application configuration from environment variables.
Never commit .env; use env.example as template.
"""
import os
from typing import List


class Settings:
    """Load settings from environment."""

    def __init__(self) -> None:
        self.APP_NAME: str = os.getenv("APP_NAME", "PublicVoice")
        self.APP_VERSION: str = os.getenv("APP_VERSION", "1.0.0")
        self.DEBUG: bool = os.getenv("DEBUG", "false").lower() in ("true", "1")
        self.ENVIRONMENT: str = os.getenv("ENVIRONMENT", "development")

        # Database: default SQLite for dev; use PostgreSQL in production
        self.DATABASE_URL: str = os.getenv(
            "DATABASE_URL",
            "sqlite:///./publicvoice.db"
        )

        # JWT – must be set in production (min 32 chars)
        self.SECRET_KEY: str = os.getenv(
            "SECRET_KEY",
            "change-me-in-production-use-openssl-rand-hex-32"
        )
        self.ALGORITHM: str = os.getenv("ALGORITHM", "HS256")
        self.ACCESS_TOKEN_EXPIRE_MINUTES: int = int(
            os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", "30")
        )

        # CORS
        self.CORS_ORIGINS: str = os.getenv(
            "CORS_ORIGINS",
            "http://localhost:5173,http://localhost:3000,http://127.0.0.1:5173"
        )

    @property
    def cors_origin_list(self) -> List[str]:
        return [o.strip() for o in self.CORS_ORIGINS.split(",") if o.strip()]


settings = Settings()
