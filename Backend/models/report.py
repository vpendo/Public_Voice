"""
Citizen report model. Raw description + optional AI-structured version.
"""
from sqlalchemy import Column, Integer, String, Text, DateTime
from sqlalchemy.sql import func

from models.base import Base


class Report(Base):
    __tablename__ = "reports"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), nullable=False)
    phone = Column(String(50), nullable=False)
    location = Column(String(500), nullable=False)
    institution = Column(String(100), nullable=False)  # tagged institution
    category = Column(String(100), nullable=False)
    raw_description = Column(Text, nullable=False)  # as submitted (e.g. Kinyarwanda)
    structured_description = Column(Text, nullable=True)  # AI-formalized, filled later
    status = Column(String(50), nullable=False, default="new")  # new, in_progress, resolved
    created_at = Column(DateTime(timezone=True), server_default=func.now())
