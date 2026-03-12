"""
Report model – Community Problem Report (Cell level).
Aligned with Rwanda decentralised governance: district → sector → cell → village.
"""
from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey, Boolean
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from models.base import Base


class Report(Base):
    __tablename__ = "reports"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=True, index=True)

    # Tracking (generated on submit)
    tracking_id = Column(String(50), unique=True, nullable=True, index=True)

    # —— 1. Reporter information (optional for privacy) ——
    name = Column(String(255), nullable=True)
    phone = Column(String(50), nullable=True)
    gender = Column(String(20), nullable=True)
    # Reporter's location (for follow-up)
    reporter_village = Column(String(255), nullable=True)
    reporter_cell = Column(String(255), nullable=True)
    reporter_sector = Column(String(255), nullable=True)
    reporter_district = Column(String(255), nullable=True)

    # —— 2 & 3. Problem classification ——
    category = Column(String(100), nullable=False)
    problem_type = Column(String(100), nullable=True)

    # —— 4. Description (main AI input) ——
    title = Column(String(255), nullable=True)
    raw_description = Column(Text, nullable=False)
    structured_description = Column(Text, nullable=True)

    # —— 5. Location of problem (for dashboard mapping) ——
    province = Column(String(100), nullable=True)
    district = Column(String(255), nullable=True)
    sector = Column(String(255), nullable=True)
    cell = Column(String(255), nullable=True)
    village = Column(String(255), nullable=True)
    landmark = Column(String(500), nullable=True)
    # Legacy single location string (kept for backward compatibility)
    location = Column(String(500), nullable=True)

    # —— 6. Urgency ——
    urgency = Column(String(50), nullable=True, default="medium")

    # —— 7. Evidence (paths stored after upload) ——
    evidence_photo = Column(String(500), nullable=True)
    evidence_video = Column(String(500), nullable=True)
    evidence_voice = Column(String(500), nullable=True)

    # —— 8. Responsible institution (auto-suggested or selected) ——
    institution = Column(String(100), nullable=False)

    # —— 9. Consent ——
    consent = Column(Boolean, nullable=False, default=False)

    # Status & admin response
    status = Column(String(50), nullable=False, default="pending")  # pending, in_review, resolved, rejected
    admin_response = Column(Text, nullable=True)
    admin_notes = Column(Text, nullable=True)  # internal notes for follow-up

    created_at = Column(DateTime(timezone=True), server_default=func.now())

    user = relationship("User", back_populates="reports")
