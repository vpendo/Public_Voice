"""
Auth request/response schemas with validation.
Register: name, email, password. Login: email, password; then OTP sent to email for verification.
"""
from pydantic import BaseModel, EmailStr, Field, field_validator, model_validator


def _password_strength(v: str) -> str:
    """Ensure password has at least 8 characters, one letter, and one digit."""
    if len(v) < 8:
        raise ValueError("Password must be at least 8 characters")
    if not any(c.isdigit() for c in v):
        raise ValueError("Password must contain at least one digit")
    if not any(c.isalpha() for c in v):
        raise ValueError("Password must contain at least one letter")
    return v


class UserRegister(BaseModel):
    """User registration – name, email, password. OTP sent to email for verification."""

    full_name: str = Field(..., min_length=1, max_length=255, strip_whitespace=True)
    email: EmailStr
    password: str = Field(..., min_length=8, max_length=128)

    @field_validator("email")
    @classmethod
    def normalize_email(cls, v: str) -> str:
        return v.lower().strip()

    @field_validator("password")
    @classmethod
    def validate_password(cls, v: str) -> str:
        return _password_strength(v)


class UserLogin(BaseModel):
    """Login – email + password. Backend sends OTP to email; then call verify-otp with email + code."""

    email: str = Field(..., min_length=1, strip_whitespace=True)
    password: str = Field(..., min_length=1)

    @field_validator("email")
    @classmethod
    def normalize_email(cls, v: str) -> str:
        return v.lower().strip()


class TokenResponse(BaseModel):
    """JWT access token response."""

    access_token: str
    token_type: str = "bearer"
    expires_in_minutes: int


class VerifyEmailRequest(BaseModel):
    """Verify email with OTP sent after registration."""

    email: str = Field(..., min_length=1, strip_whitespace=True)
    code: str = Field(..., min_length=6, max_length=6, strip_whitespace=True)

    @field_validator("email")
    @classmethod
    def normalize_email(cls, v: str) -> str:
        return v.lower().strip()


class ResendOtpRequest(BaseModel):
    """Resend verification OTP to email."""

    email: str = Field(..., min_length=1, strip_whitespace=True)

    @field_validator("email")
    @classmethod
    def normalize_email(cls, v: str) -> str:
        return v.lower().strip()


class UserResponse(BaseModel):
    """User info (no password) for /me and similar."""

    id: int
    full_name: str
    phone: str | None = None
    national_id: str | None = None
    email: str | None = None
    role: str
    phone_verified: bool = False
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
    """After email+password OK, OTP sent to email."""

    requires_otp: bool = True
    email: str
    dev_otp: str | None = None  # Only set when DEBUG=true for development


class LoginVerifyOtpRequest(BaseModel):
    """Verify login OTP – email + code."""

    email: str = Field(..., min_length=1, strip_whitespace=True)
    code: str = Field(..., min_length=6, max_length=6, strip_whitespace=True)

    @field_validator("email")
    @classmethod
    def normalize_email(cls, v: str) -> str:
        return v.lower().strip()


class ForgotPasswordRequest(BaseModel):
    """Request password reset by email. Used from login page 'Forgot password?'."""

    email: EmailStr

    @field_validator("email")
    @classmethod
    def normalize_email(cls, v: str) -> str:
        return v.lower().strip()


class ForgotPasswordResponse(BaseModel):
    """Response for forgot-password. OTP sent to email; use email + code + new_password on reset-password."""

    message: str
    email: str  # Echo so frontend can show reset form with email pre-filled
    dev_otp: str | None = None  # Only in development or when email not sent (for testing)


class RegisterResponse(BaseModel):
    """After registration we send OTP to email; frontend should show verify-email page."""

    message: str = "OTP sent to your email."
    email: str
    email_sent: bool = False  # True if OTP was sent to email (SMTP worked)
    dev_otp: str | None = None  # Only set when DEBUG or email not sent (fallback)


class ResetPasswordRequest(BaseModel):
    """Reset password after forgot-password: send email + code (OTP from email) + new_password."""

    token: str | None = None  # from reset link (legacy, optional)
    email: str | None = None  # for OTP flow (from forgot-password)
    code: str | None = None   # 6-digit OTP sent to email
    new_password: str = Field(..., min_length=8, max_length=128)

    @field_validator("email")
    @classmethod
    def normalize_email(cls, v: str | None) -> str | None:
        return v.lower().strip() if v and v.strip() else None

    @model_validator(mode="after")
    def require_token_or_otp(self):
        has_token = self.token and self.token.strip()
        has_otp = self.email and self.email.strip() and self.code and len((self.code or "").strip()) == 6
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


class ResetPasswordResponse(BaseModel):
    """After successful password reset."""

    message: str = "Password has been reset. You can sign in with your new password."


class CreateAdminRequest(BaseModel):
    """Create an admin user with optional geographic scope."""

    full_name: str = Field(..., min_length=1, max_length=255, strip_whitespace=True)
    email: EmailStr
    password: str = Field(..., min_length=8, max_length=128)
    admin_category: str | None = Field(None, description="Category filter (optional)")
    admin_scope_level: str | None = Field(None, description="Scope level: all, district, sector, cell")
    scope_district: str | None = Field(None, description="District name")
    scope_sector: str | None = Field(None, description="Sector name")
    scope_cell: str | None = Field(None, description="Cell name")

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

    @field_validator("admin_scope_level")
    @classmethod
    def validate_scope_level(cls, v: str | None) -> str | None:
        """Validate scope level."""
        if v and v not in ("all", "district", "sector", "cell"):
            raise ValueError("admin_scope_level must be one of: all, district, sector, cell")
        return v