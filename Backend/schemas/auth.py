"""
Auth request/response schemas with validation.
"""
from pydantic import BaseModel, EmailStr, Field, field_validator, model_validator


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


class VerifyEmailRequest(BaseModel):
    """Verify email with OTP sent after registration."""

    email: str = Field(..., min_length=1, strip_whitespace=True)
    code: str = Field(..., min_length=6, max_length=6, strip_whitespace=True)


class ResendOtpRequest(BaseModel):
    """Resend OTP to email (for verification)."""

    email: str = Field(..., min_length=1, strip_whitespace=True)


class UserResponse(BaseModel):
    """User info (no password) for /me and similar."""

    id: int
    full_name: str
    email: str
    role: str
    email_verified: bool = False
    admin_category: str | None = None  # When set, admin only sees reports for this category
    admin_scope_level: str | None = None  # all | district | sector | cell – geographic scope
    scope_district: str | None = None
    scope_sector: str | None = None
    scope_cell: str | None = None
    profile_image: str | None = None  # URL path e.g. /uploads/avatars/1_xxx.jpg

    class Config:
        from_attributes = True


class LoginResponse(BaseModel):
    """Login: token + user so frontend can redirect Admin vs User without a second request."""

    access_token: str
    token_type: str = "bearer"
    expires_in_minutes: int
    user: UserResponse
    is_admin: bool = False  # True when user.role is Admin – frontend uses this for redirect


class LoginRequiresOtpResponse(BaseModel):
    """After email+password OK, 2FA required: OTP sent to email."""

    requires_otp: bool = True
    email: str
    dev_otp: str | None = None  # Only set when DEBUG=true for development without real email


class LoginVerifyOtpRequest(BaseModel):
    """Verify login OTP (2FA) – email + code from email."""

    email: str = Field(..., min_length=1, strip_whitespace=True)
    code: str = Field(..., min_length=6, max_length=6, strip_whitespace=True)


class ForgotPasswordRequest(BaseModel):
    """Request password reset by email."""

    email: str = Field(..., min_length=1, strip_whitespace=True)


class ForgotPasswordResponse(BaseModel):
    """Response for forgot-password. reset_token only in DEBUG for development."""

    message: str
    reset_token: str | None = None  # Only set when DEBUG=true so dev can build reset link


class RegisterResponse(BaseModel):
    """After registration we send OTP; frontend should show verify-email page."""

    message: str = "Check your email for the verification code."
    email: str
    dev_otp: str | None = None  # Only set when DEBUG=true so you can use any email in development


class ResetPasswordRequest(BaseModel):
    """Reset password: either token (link) or email+code (OTP)."""

    token: str | None = None  # from reset link (legacy)
    email: str | None = None  # for OTP flow
    code: str | None = None   # 6-digit OTP for reset
    new_password: str = Field(..., min_length=8, max_length=128)

    @model_validator(mode="after")
    def require_token_or_otp(self):
        has_token = self.token and self.token.strip()
        has_otp = self.email and self.email.strip() and self.code and len(self.code.strip()) == 6
        if not has_token and not has_otp:
            raise ValueError("Provide either token or email and code (OTP).")
        if has_token and has_otp:
            raise ValueError("Provide either token or email+code, not both.")
        return self

    @field_validator("new_password")
    @classmethod
    def password_strength(cls, v: str) -> str:
        if len(v) < 8:
            raise ValueError("Password must be at least 8 characters")
        if not any(c.isdigit() for c in v):
            raise ValueError("Password must contain at least one digit")
        if not any(c.isalpha() for c in v):
            raise ValueError("Password must contain at least one letter")
        return v