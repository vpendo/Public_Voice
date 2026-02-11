"""
Application configuration from environment variables.
Never commit .env; use env.example as template.
"""
import os
from typing import List


class Settings:
    """Load settings from environment."""

    def __init__(self) -> None:
        # App info
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

        # Server
        self.HOST: str = os.getenv("HOST", "127.0.0.1")
        self.PORT: int = int(os.getenv("PORT", "8000"))

        # Security check
        if self.ENVIRONMENT == "production" and self.SECRET_KEY.startswith("change-me"):
            raise ValueError("SECRET_KEY must be set in production")

        # CORS
        self.CORS_ORIGINS: List[str] = [
            o.strip()
            for o in os.getenv(
                "CORS_ORIGINS",
                "http://localhost:5173,http://localhost:3000,http://127.0.0.1:5173"
            ).split(",")
            if o.strip()
        ]

    def _to_bool(self, value: str) -> bool:
        return value.lower() in ("true", "1", "yes")

    # Property for FastAPI CORS middleware
    @property
    def cors_origin_list(self) -> List[str]:
        return self.CORS_ORIGINS


settings = Settings()
