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

@pytest.fixture(autouse=True)
def stub_ai(monkeypatch):
    """Replace process_issue_text with a deterministic stub during tests.

    Most tests don't care about actual translation; they simply need the
    function to return a valid result so that report creation succeeds.  We
    also add a separate test to exercise the failure path.
    """
    def fake_process(text, category=None):
        # return minimal valid structure expected by create_report
        # leave suggested_institution as None so the original value is preserved
        return {
            "structured_description": f"[stubbed] {text[:50]}",
            "suggested_title": "stub title",
            "suggested_category": category or "service_delivery",
            "suggested_institution": None,
            "suggested_problem_type": "other",
            "suggested_urgency": "low",
        }

    monkeypatch.setattr("services.ai_processor.process_issue_text", fake_process)
    # the reports router imported the function at module level, so patch that too
    try:
        monkeypatch.setattr("routers.reports.process_issue_text", fake_process)
    except Exception:
        pass

@pytest.fixture
def auth_headers(client: TestClient) -> dict:
    """Register a user (name, email, password), verify email, login, verify OTP, then return Bearer token.
    If the user already exists (e.g. from a previous test using the same in-memory DB), skip register and just login.
    """
    email = "authuser@example.com"
    password = "Pass1234"
    reg = client.post(
        "/api/auth/register",
        json={
            "full_name": "Test Citizen",
            "email": email,
            "password": password,
        },
    )
    if reg.status_code == 200:
        db = SessionLocal()
        try:
            otp_row = db.query(OTP).filter(OTP.email == email, OTP.purpose == "register").order_by(OTP.created_at.desc()).first()
            assert otp_row is not None
            client.post("/api/auth/verify-email", json={"email": email, "code": otp_row.code})
        finally:
            db.close()
    else:
        # User already exists (e.g. test_me_success ran first); skip register/verify
        assert reg.status_code == 400 and "already registered" in (reg.json().get("detail") or "").lower()
    r = client.post(
        "/api/auth/login",
        json={"email": email, "password": password},
    )
    assert r.status_code == 200, r.text
    data = r.json()
    assert data.get("requires_otp") is True, "Expected OTP step"
    email = data["email"]
    db = SessionLocal()
    try:
        otp_row = db.query(OTP).filter(OTP.email == email, OTP.purpose == "login").order_by(OTP.created_at.desc()).first()
        assert otp_row is not None
        code = otp_row.code
    finally:
        db.close()
    r2 = client.post("/api/auth/login/verify-otp", json={"email": email, "code": code})
    assert r2.status_code == 200, r2.text
    token = r2.json()["access_token"]
    return {"Authorization": f"Bearer {token}"}
