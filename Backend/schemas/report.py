"""
Report request/response schemas. Aligned with frontend form fields.
"""
from datetime import datetime
from typing import Optional

from pydantic import BaseModel, Field, field_validator


# Allowed values for validation – all lowercase to match AI normalization.
# Keep in sync with Frontend src/constants/categories.ts REPORT_CATEGORIES.
ALLOWED_INSTITUTIONS = {
    "district", "sector", "cell", "village",
    "mininfra", "mineduc", "minisante", "localgov", "other"
}
ALLOWED_CATEGORIES = {
    "roads", "water", "security", "sanitation",
    "electricity", "health", "education", "other"
}


class ReportCreate(BaseModel):
    """Citizen submits a report. Auth required for dashboard; name/phone can come from user."""

    title: Optional[str] = Field(None, max_length=255, strip_whitespace=True)
    name: str = Field(..., min_length=1, max_length=255, strip_whitespace=True)
    phone: str = Field(..., min_length=1, max_length=50, strip_whitespace=True)
    location: str = Field(..., min_length=1, max_length=500, strip_whitespace=True)
    institution: str = Field(..., min_length=1, max_length=100, strip_whitespace=True)
    category: str = Field(..., min_length=1, max_length=100, strip_whitespace=True)
    description: str = Field(..., min_length=1, max_length=10_000, strip_whitespace=True)

    @field_validator("institution")
    @classmethod
    def validate_institution(cls, v: str) -> str:
        v_lower = v.lower()
        if v_lower not in ALLOWED_INSTITUTIONS:
            raise ValueError(f"Institution must be one of: {', '.join(ALLOWED_INSTITUTIONS)}")
        return v_lower

    @field_validator("category")
    @classmethod
    def validate_category(cls, v: str) -> str:
        v_lower = v.lower()
        if v_lower not in ALLOWED_CATEGORIES:
            raise ValueError(f"Category must be one of: {', '.join(ALLOWED_CATEGORIES)}")
        return v_lower


class ReportUpdate(BaseModel):
    """Admin updates status and response."""

    status: Optional[str] = Field(
        None,
        description="Status must be one of: pending, resolved, rejected"
    )
    admin_response: Optional[str] = Field(None, max_length=10_000, strip_whitespace=True)

    @field_validator("status")
    @classmethod
    def validate_status(cls, v: Optional[str]) -> Optional[str]:
        if v:
            v_lower = v.lower()
            if v_lower not in ("pending", "resolved", "rejected"):
                raise ValueError("Status must be pending, resolved, or rejected")
            return v_lower
        return v


class ReportUserUpdate(BaseModel):
    """User updates their own report (owner only). All fields optional."""

    title: Optional[str] = Field(None, max_length=255, strip_whitespace=True)
    name: Optional[str] = Field(None, min_length=1, max_length=255, strip_whitespace=True)
    phone: Optional[str] = Field(None, min_length=1, max_length=50, strip_whitespace=True)
    location: Optional[str] = Field(None, min_length=1, max_length=500, strip_whitespace=True)
    institution: Optional[str] = Field(None, min_length=1, max_length=100, strip_whitespace=True)
    category: Optional[str] = Field(None, min_length=1, max_length=100, strip_whitespace=True)
    description: Optional[str] = Field(None, min_length=1, max_length=10_000, strip_whitespace=True)

    @field_validator("institution")
    @classmethod
    def validate_institution(cls, v: Optional[str]) -> Optional[str]:
        if not v:
            return v
        v_lower = v.lower()
        if v_lower not in ALLOWED_INSTITUTIONS:
            raise ValueError(f"Institution must be one of: {', '.join(ALLOWED_INSTITUTIONS)}")
        return v_lower

    @field_validator("category")
    @classmethod
    def validate_category(cls, v: Optional[str]) -> Optional[str]:
        if not v:
            return v
        v_lower = v.lower()
        if v_lower not in ALLOWED_CATEGORIES:
            raise ValueError(f"Category must be one of: {', '.join(ALLOWED_CATEGORIES)}")
        return v_lower


class ReportResponse(BaseModel):
    """Single report – for list and detail."""

    id: int
    user_id: Optional[int] = None
    title: Optional[str] = None
    name: str
    phone: str
    location: str
    institution: str
    category: str
    raw_description: str
    structured_description: Optional[str] = None
    admin_response: Optional[str] = None
    status: str
    created_at: datetime

    class Config:
        from_attributes = True  # Pydantic v2 proper attribute mapping