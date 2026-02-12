from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey, CheckConstraint
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from models.base import Base

class Report(Base):
    __tablename__ = "reports"
    __table_args__ = (
        CheckConstraint(
            "status IN ('pending', 'resolved', 'rejected')",
            name="check_status_valid"
        ),
        CheckConstraint(
            "category IN ('roads','water','security','sanitation','electricity','health','education','other')",
            name="check_category_valid"
        ),
    )

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=True, index=True)

    title = Column(String(255), nullable=True)
    name = Column(String(255), nullable=False)
    phone = Column(String(50), nullable=False)
    location = Column(String(500), nullable=False)

    institution = Column(String(100), nullable=False)
    category = Column(String(100), nullable=False)

    raw_description = Column(Text, nullable=False)
    structured_description = Column(Text, nullable=True)
    admin_response = Column(Text, nullable=True)

    status = Column(String(50), nullable=False, default="pending")

    created_at = Column(DateTime(timezone=True), server_default=func.now())

    user = relationship("User", back_populates="reports")
