"""
Auth request/response schemas with validation.
"""
from pydantic import BaseModel, EmailStr, Field, field_validator, model_validator


class UserRegister(BaseModel):
    """User registration – validated input."""

    full_name: str = Field(..., min_length=1, max_length=255, strip_whitespace=True)
    phone: str = Field(..., min_length=10, max_length=20, strip_whitespace=True)
    national_id: str = Field(..., min_length=1, max_length=50, strip_whitespace=True)

    @field_validator("phone")
    @classmethod
    def normalize_phone(cls, v: str) -> str:
        """Normalize phone number - remove spaces and ensure it starts with + or digits."""
        cleaned = v.strip().replace(" ", "").replace("-", "")
        if not cleaned:
            raise ValueError("Phone number cannot be empty")
        return cleaned

    @field_validator("national_id")
    @classmethod
    def validate_national_id(cls, v: str) -> str:
        """Validate Rwanda National ID format - must be exactly 16 digits."""
        cleaned = v.strip().replace(" ", "").replace("-", "")
        if not cleaned:
            raise ValueError("National ID cannot be empty")
        if not cleaned.isdigit():
            raise ValueError("National ID must contain only digits")
        if len(cleaned) != 16:
            raise ValueError("Rwanda National ID must be exactly 16 digits")
        return cleaned


class UserLogin(BaseModel):
    """Login – phone number + full name (users) or email+password (admins). For phone, OTP will be sent."""

    phone: str | None = Field(None, min_length=10, max_length=20, strip_whitespace=True)
    full_name: str | None = Field(None, min_length=1, max_length=255, strip_whitespace=True)
    email: str | None = Field(None, min_length=1, strip_whitespace=True)
    password: str | None = Field(None, min_length=1)

    @field_validator("phone")
    @classmethod
    def normalize_phone(cls, v: str | None) -> str | None:
        """Normalize phone number."""
        if v is None:
            return None
        cleaned = v.strip().replace(" ", "").replace("-", "")
        return cleaned if cleaned else None

    @model_validator(mode="after")
    def require_phone_or_email_password(self):
        """Require either phone+full_name (for users) or email+password (for admins)."""
        has_phone = self.phone and self.phone.strip()
        has_email_password = self.email and self.email.strip() and self.password and self.password.strip()
        if not has_phone and not has_email_password:
            raise ValueError("Provide either phone number+full name or email+password")
        if has_phone and has_email_password:
            raise ValueError("Provide either phone number+full name or email+password, not both")
        if has_phone and (not self.full_name or not self.full_name.strip()):
            raise ValueError("Full name is required when using phone login")
        return self


class TokenResponse(BaseModel):
    """JWT access token response."""

    access_token: str
    token_type: str = "bearer"
    expires_in_minutes: int


class VerifyPhoneRequest(BaseModel):
    """Verify phone with OTP sent after registration."""

    phone: str = Field(..., min_length=10, max_length=20, strip_whitespace=True)
    code: str = Field(..., min_length=6, max_length=6, strip_whitespace=True)

    @field_validator("phone")
    @classmethod
    def normalize_phone(cls, v: str) -> str:
        """Normalize phone number."""
        cleaned = v.strip().replace(" ", "").replace("-", "")
        if not cleaned:
            raise ValueError("Phone number cannot be empty")
        return cleaned


class ResendOtpRequest(BaseModel):
    """Resend OTP to phone (for verification)."""

    phone: str = Field(..., min_length=10, max_length=20, strip_whitespace=True)

    @field_validator("phone")
    @classmethod
    def normalize_phone(cls, v: str) -> str:
        """Normalize phone number."""
        cleaned = v.strip().replace(" ", "").replace("-", "")
        if not cleaned:
            raise ValueError("Phone number cannot be empty")
        return cleaned


class UserResponse(BaseModel):
    """User info (no password) for /me and similar."""

    id: int
    full_name: str
    phone: str | None = None
    national_id: str | None = None
    email: str | None = None
    role: str
    phone_verified: bool = False
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
    """After phone OK, OTP sent to phone."""

    requires_otp: bool = True
    phone: str
    dev_otp: str | None = None  # Only set when DEBUG=true for development


class LoginVerifyOtpRequest(BaseModel):
    """Verify login OTP – phone + code."""

    phone: str = Field(..., min_length=10, max_length=20, strip_whitespace=True)
    code: str = Field(..., min_length=6, max_length=6, strip_whitespace=True)

    @field_validator("phone")
    @classmethod
    def normalize_phone(cls, v: str) -> str:
        """Normalize phone number."""
        cleaned = v.strip().replace(" ", "").replace("-", "")
        if not cleaned:
            raise ValueError("Phone number cannot be empty")
        return cleaned


class ForgotPasswordRequest(BaseModel):
    """Request password reset by email."""

    email: str = Field(..., min_length=1, strip_whitespace=True)


class ForgotPasswordResponse(BaseModel):
    """Response for forgot-password. reset_token only in DEBUG for development."""

    message: str
    reset_token: str | None = None  # Only set when DEBUG=true so dev can build reset link


class RegisterResponse(BaseModel):
    """After registration we send OTP; frontend should show verify-phone page."""

    message: str = "OTP sent to your phone number."
    phone: str
    dev_otp: str | None = None  # Only set when DEBUG=true for development


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