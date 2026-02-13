"""
Auth request/response schemas with validation.
"""
from pydantic import BaseModel, EmailStr, Field, field_validator


class UserRegister(BaseModel):
    """User registration – validated input."""

    full_name: str = Field(..., min_length=1, max_length=255, strip_whitespace=True)
    email: EmailStr
    password: str = Field(..., min_length=8, max_length=128)

    @field_validator("email")
    @classmethod
    def normalize_email(cls, v: str) -> str:
        """Normalize email to lowercase and strip whitespace."""
        return v.lower().strip()

    @field_validator("password")
    @classmethod
    def password_strength(cls, v: str) -> str:
        """Ensure password has at least 8 characters, one letter, and one digit."""
        if len(v) < 8:
            raise ValueError("Password must be at least 8 characters")
        if not any(c.isdigit() for c in v):
            raise ValueError("Password must contain at least one digit")
        if not any(c.isalpha() for c in v):
            raise ValueError("Password must contain at least one letter")
        return v


class UserLogin(BaseModel):
    """Login – email + password. Accept any non-empty string for email to avoid 422 from strict EmailStr."""

    email: str = Field(..., min_length=1, strip_whitespace=True)
    password: str = Field(..., min_length=1)


class TokenResponse(BaseModel):
    """JWT access token response."""

    access_token: str
    token_type: str = "bearer"
    expires_in_minutes: int


class UserResponse(BaseModel):
    """User info (no password) for /me and similar."""

    id: int
    full_name: str
    email: str
    role: str

    class Config:
        from_attributes = True


class LoginResponse(BaseModel):
    """Login: token + user so frontend can redirect Admin vs User without a second request."""

    access_token: str
    token_type: str = "bearer"
    expires_in_minutes: int
    user: UserResponse
    is_admin: bool = False  # True when user.role is Admin – frontend uses this for redirect
