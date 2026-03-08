"""
Pytest fixtures for PublicVoice API tests.
Uses in-memory SQLite so tests don't touch your dev database.
Run from Backend folder: pytest tests/ -v
"""
import os
import sys

import pytest

# Use in-memory DB and test secret before any app imports
os.environ["DATABASE_URL"] = "sqlite:///:memory:"
os.environ["SECRET_KEY"] = "test-secret-key-for-pytest"
os.environ.setdefault("DEBUG", "false")

# Ensure Backend root is on path
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from fastapi.testclient import TestClient

from main import app
from models.base import init_db, SessionLocal
from models.user import User
from models.otp import OTP

# Create tables immediately so they exist before any request (avoids "no such table")
init_db()


def get_client() -> TestClient:
    return TestClient(app)


@pytest.fixture
def client() -> TestClient:
    return get_client()


@pytest.fixture
def auth_headers(client: TestClient) -> dict:
    """Register a user, verify phone, login (OTP), verify OTP, then return Bearer token."""
    # Register user with phone and national_id
    client.post(
        "/api/auth/register",
        json={
            "full_name": "Test Citizen",
            "phone": "+250788123456",
            "national_id": "1234567890123456",
        },
    )
    db = SessionLocal()
    try:
        user = db.query(User).filter(User.phone == "+250788123456").first()
        if user:
            user.phone_verified = True
            db.commit()
    finally:
        db.close()
    # Login with phone and full_name
    r = client.post(
        "/api/auth/login",
        json={"phone": "+250788123456", "full_name": "Test Citizen"},
    )
    assert r.status_code == 200, r.text
    data = r.json()
    assert data.get("requires_otp") is True, "Expected OTP step"
    phone = data["phone"]
    # Get OTP from database
    db = SessionLocal()
    try:
        otp_row = db.query(OTP).filter(OTP.phone == phone, OTP.purpose == "login").order_by(OTP.created_at.desc()).first()
        assert otp_row is not None
        code = otp_row.code
    finally:
        db.close()
    # Verify OTP
    r2 = client.post("/api/auth/login/verify-otp", json={"phone": phone, "code": code})
    assert r2.status_code == 200, r2.text
    token = r2.json()["access_token"]
    return {"Authorization": f"Bearer {token}"}
