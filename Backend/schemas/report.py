"""
Report request/response schemas. Cell-level Community Problem Report.
Aligned with Rwanda decentralised governance and frontend form.
"""
from datetime import datetime
from typing import Optional

from pydantic import BaseModel, Field, field_validator

# —— Categories (real Cell-level complaints) ——
ALLOWED_CATEGORIES = {
    "service_delivery",
    "land_property",
    "infrastructure_utilities",
    "social_community",
    "administrative",
}

# —— Problem types per category (dynamic on frontend) ——
ALLOWED_PROBLEM_TYPES = {
    "service_delivery": {"delay_assistance", "no_response", "service_not_delivered", "other"},
    "land_property": {"boundary_conflict", "ownership_dispute", "inheritance", "registration_issue"},
    "infrastructure_utilities": {"water_shortage", "road_damage", "drainage", "electricity", "waste_management"},
    "social_community": {"gbv", "family_conflict", "child_protection", "community_dispute"},
    "administrative": {"not_followed_up", "poor_communication", "delayed_decision", "misconduct"},
}

# —— Responsible institutions (Cell level) ——
ALLOWED_INSTITUTIONS = {
    "cell_office",
    "sector_office",
    "district_authority",
    "social_affairs_officer",
    "land_bureau",
    "other",
}

ALLOWED_URGENCY = {"low", "medium", "high", "emergency"}


def _flatten_problem_types() -> set:
    out = set()
    for types in ALLOWED_PROBLEM_TYPES.values():
        out |= types
    return out


ALL_PROBLEM_TYPES_FLAT = _flatten_problem_types()


class ReportCreate(BaseModel):
    """Citizen submits a community problem report (cell-level form)."""

    # Reporter (optional for privacy)
    name: Optional[str] = Field(None, max_length=255, strip_whitespace=True)
    phone: Optional[str] = Field(None, max_length=50, strip_whitespace=True)
    gender: Optional[str] = Field(None, max_length=20, strip_whitespace=True)
    reporter_village: Optional[str] = Field(None, max_length=255, strip_whitespace=True)
    reporter_cell: Optional[str] = Field(None, max_length=255, strip_whitespace=True)
    reporter_sector: Optional[str] = Field(None, max_length=255, strip_whitespace=True)
    reporter_district: Optional[str] = Field(None, max_length=255, strip_whitespace=True)

    # Problem classification
    category: str = Field(..., min_length=1, max_length=100, strip_whitespace=True)
    problem_type: Optional[str] = Field(None, max_length=100, strip_whitespace=True)

    # Description (main AI input)
    title: Optional[str] = Field(None, max_length=255, strip_whitespace=True)
    description: str = Field(..., min_length=1, max_length=10_000, strip_whitespace=True)

    # Location of problem
    province: Optional[str] = Field(None, max_length=100, strip_whitespace=True)
    district: Optional[str] = Field(None, max_length=255, strip_whitespace=True)
    sector: Optional[str] = Field(None, max_length=255, strip_whitespace=True)
    cell: Optional[str] = Field(None, max_length=255, strip_whitespace=True)
    village: Optional[str] = Field(None, max_length=255, strip_whitespace=True)
    landmark: Optional[str] = Field(None, max_length=500, strip_whitespace=True)

    # Urgency
    urgency: Optional[str] = Field("medium", max_length=50, strip_whitespace=True)

    # Evidence paths (set by backend after upload; optional in create)
    evidence_photo: Optional[str] = Field(None, max_length=500)
    evidence_video: Optional[str] = Field(None, max_length=500)
    evidence_voice: Optional[str] = Field(None, max_length=500)

    # Responsible institution (can be auto-suggested by AI)
    institution: str = Field(..., min_length=1, max_length=100, strip_whitespace=True)

    # Consent
    consent: bool = Field(..., description="User agrees report can be used to improve public services")

    @field_validator("category")
    @classmethod
    def validate_category(cls, v: str) -> str:
        v_lower = v.lower().strip().replace(" ", "_")
        if v_lower not in ALLOWED_CATEGORIES:
            raise ValueError(f"Category must be one of: {', '.join(sorted(ALLOWED_CATEGORIES))}")
        return v_lower

    @field_validator("problem_type")
    @classmethod
    def validate_problem_type(cls, v: Optional[str]) -> Optional[str]:
        if not v:
            return None
        v_lower = v.lower().strip().replace(" ", "_")
        if v_lower not in ALL_PROBLEM_TYPES_FLAT:
            raise ValueError(f"Problem type must be one of the allowed types for the selected category")
        return v_lower

    @field_validator("institution")
    @classmethod
    def validate_institution(cls, v: str) -> str:
        v_lower = v.lower().strip().replace(" ", "_")
        if v_lower not in ALLOWED_INSTITUTIONS:
            raise ValueError(f"Institution must be one of: {', '.join(sorted(ALLOWED_INSTITUTIONS))}")
        return v_lower

    @field_validator("urgency")
    @classmethod
    def validate_urgency(cls, v: Optional[str]) -> Optional[str]:
        if not v:
            return "medium"
        v_lower = v.lower().strip()
        if v_lower not in ALLOWED_URGENCY:
            raise ValueError(f"Urgency must be one of: {', '.join(sorted(ALLOWED_URGENCY))}")
        return v_lower


class ReportUpdate(BaseModel):
    """Admin updates status, response, and optional internal notes."""

    status: Optional[str] = Field(
        None,
        description="Status: pending, in_review, resolved, rejected",
    )
    admin_response: Optional[str] = Field(None, max_length=10_000, strip_whitespace=True)
    admin_notes: Optional[str] = Field(None, max_length=5_000, strip_whitespace=True)

    @field_validator("status")
    @classmethod
    def validate_status(cls, v: Optional[str]) -> Optional[str]:
        if v:
            v_lower = v.lower().strip().replace(" ", "_")
            if v_lower not in ("pending", "in_review", "resolved", "rejected"):
                raise ValueError("Status must be pending, in_review, resolved, or rejected")
            return v_lower
        return v


class ReportUserUpdate(BaseModel):
    """User updates their own report (owner only). All fields optional."""

    name: Optional[str] = Field(None, max_length=255, strip_whitespace=True)
    phone: Optional[str] = Field(None, min_length=1, max_length=50, strip_whitespace=True)
    description: Optional[str] = Field(None, min_length=1, max_length=10_000, strip_whitespace=True)
    category: Optional[str] = Field(None, max_length=100, strip_whitespace=True)
    problem_type: Optional[str] = Field(None, max_length=100, strip_whitespace=True)
    district: Optional[str] = Field(None, max_length=255, strip_whitespace=True)
    sector: Optional[str] = Field(None, max_length=255, strip_whitespace=True)
    cell: Optional[str] = Field(None, max_length=255, strip_whitespace=True)
    village: Optional[str] = Field(None, max_length=255, strip_whitespace=True)
    urgency: Optional[str] = Field(None, max_length=50, strip_whitespace=True)
    institution: Optional[str] = Field(None, max_length=100, strip_whitespace=True)

    @field_validator("category")
    @classmethod
    def validate_category(cls, v: Optional[str]) -> Optional[str]:
        if not v:
            return v
        v_lower = v.lower().strip().replace(" ", "_")
        if v_lower not in ALLOWED_CATEGORIES:
            raise ValueError(f"Category must be one of: {', '.join(sorted(ALLOWED_CATEGORIES))}")
        return v_lower

    @field_validator("institution")
    @classmethod
    def validate_institution(cls, v: Optional[str]) -> Optional[str]:
        if not v:
            return v
        v_lower = v.lower().strip().replace(" ", "_")
        if v_lower not in ALLOWED_INSTITUTIONS:
            raise ValueError(f"Institution must be one of: {', '.join(sorted(ALLOWED_INSTITUTIONS))}")
        return v_lower


class ReportResponse(BaseModel):
    """Single report – for list and detail. Includes tracking_id."""

    id: int
    user_id: Optional[int] = None
    tracking_id: Optional[str] = None
    name: Optional[str] = None
    phone: Optional[str] = None
    gender: Optional[str] = None
    reporter_village: Optional[str] = None
    reporter_cell: Optional[str] = None
    reporter_sector: Optional[str] = None
    reporter_district: Optional[str] = None
    category: str
    problem_type: Optional[str] = None
    title: Optional[str] = None
    raw_description: str
    structured_description: Optional[str] = None
    province: Optional[str] = None
    district: Optional[str] = None
    sector: Optional[str] = None
    cell: Optional[str] = None
    village: Optional[str] = None
    landmark: Optional[str] = None
    location: Optional[str] = None
    urgency: Optional[str] = None
    evidence_photo: Optional[str] = None
    evidence_video: Optional[str] = None
    evidence_voice: Optional[str] = None
    institution: str
    consent: bool = False
    status: str
    admin_response: Optional[str] = None
    admin_notes: Optional[str] = None
    created_at: datetime

    class Config:
        from_attributes = True


class ReportStatsResponse(BaseModel):
    """Dashboard stats: totals and breakdowns."""

    total: int
    by_status: dict  # e.g. {"pending": 5, "in_review": 2, "resolved": 10, "rejected": 1}
    by_category: dict  # e.g. {"infrastructure_utilities": 3, ...}
    by_urgency: dict  # e.g. {"low": 2, "medium": 8, "high": 1, "emergency": 0}
    monthly_trend: list  # e.g. [{"month": "2025-01", "count": 12}, ...]
