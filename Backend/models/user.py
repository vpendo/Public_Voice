"""
User model for authentication.
Admins manage the system; users may submit/track reports.
"""
from sqlalchemy import Column, Integer, String, DateTime
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
import enum

from models.base import Base


class UserRole(str, enum.Enum):
    ADMIN = "Admin"
    USER = "User"


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    full_name = Column(String(255), nullable=False)
    email = Column(String(255), unique=True, index=True, nullable=False)
    hashed_password = Column(String(255), nullable=False)

    role = Column(String(50), nullable=False, default=UserRole.USER.value)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    # Relationship
    reports = relationship("Report", back_populates="user")
