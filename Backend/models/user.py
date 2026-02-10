"""
Admin user model. Only admins can register/login.
"""
from sqlalchemy import Column, Integer, String, DateTime, Enum
from sqlalchemy.sql import func
import enum

from models.base import Base


class UserRole(str, enum.Enum):
    ADMIN = "Admin"


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    full_name = Column(String(255), nullable=False)
    email = Column(String(255), unique=True, index=True, nullable=False)
    hashed_password = Column(String(255), nullable=False)
    role = Column(String(50), nullable=False, default=UserRole.ADMIN.value)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
