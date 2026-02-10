"""
Report request/response schemas. Aligned with frontend form fields.
"""
from datetime import datetime
from typing import Optional

from pydantic import BaseModel, Field


# Allowed values for validation (optional extra layer)
ALLOWED_INSTITUTIONS = {
    "district", "sector", "cell", "village",
    "mininfra", "mineduc", "minisante", "localGov", "other"
}
ALLOWED_CATEGORIES = {
    "roads", "water", "security", "sanitation",
    "electricity", "health", "education", "other"
}


class ReportCreate(BaseModel):
    """Citizen submits a report – public endpoint."""

    name: str = Field(..., min_length=1, max_length=255, strip_whitespace=True)
    phone: str = Field(..., min_length=1, max_length=50, strip_whitespace=True)
    location: str = Field(..., min_length=1, max_length=500, strip_whitespace=True)
    institution: str = Field(..., min_length=1, max_length=100, strip_whitespace=True)
    category: str = Field(..., min_length=1, max_length=100, strip_whitespace=True)
    description: str = Field(..., min_length=1, max_length=10_000, strip_whitespace=True)


class ReportResponse(BaseModel):
    """Single report – for list and detail."""

    id: int
    name: str
    phone: str
    location: str
    institution: str
    category: str
    raw_description: str
    structured_description: Optional[str] = None
    status: str
    created_at: datetime

    class Config:
        from_attributes = True
