"""
OTP (one-time password) for email verification and optional login.
"""
from sqlalchemy import Column, Integer, String, DateTime, Index
from sqlalchemy.sql import func

from models.base import Base


class OTP(Base):
    __tablename__ = "otps"

    id = Column(Integer, primary_key=True, index=True)
    phone = Column(String(50), nullable=True, index=True)  # Phone number for OTP
    email = Column(String(255), nullable=True, index=True)  # Email for OTP (legacy/admin support)
    code = Column(String(10), nullable=False)  # 6-digit string
    purpose = Column(String(20), nullable=False, default="register")  # register | login | reset_password
    expires_at = Column(DateTime(timezone=True), nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    __table_args__ = (Index("ix_otps_phone_purpose", "phone", "purpose"), Index("ix_otps_email_purpose", "email", "purpose"))
