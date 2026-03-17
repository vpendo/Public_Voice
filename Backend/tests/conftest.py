"""
Pytest fixtures for PublicVoice API tests.
Uses PostgreSQL (test DB or DATABASE_URL). Run from Backend folder: pytest tests/ -v
Creates the test database if it does not exist.
"""
import os
import sys
from urllib.parse import urlparse, urlunparse

import pytest

# Use test DB and test secret before any app imports. Set DATABASE_URL to override (e.g. CI).
os.environ.setdefault("DATABASE_URL", "postgresql://postgres:postgres@localhost:5432/publicvoice_test")
os.environ["SECRET_KEY"] = "test-secret-key-for-pytest"
os.environ.setdefault("DEBUG", "false")


def _ensure_test_database() -> None:
    """Create the test database if it does not exist (connect to 'postgres' and CREATE DATABASE)."""
    import psycopg2
    from psycopg2 import sql
    url = os.environ.get("DATABASE_URL", "")
    parsed = urlparse(url)
    path = (parsed.path or "/").strip("/")
    dbname = path.split("/")[0] if path else "publicvoice_test"
    admin_url = urlunparse((parsed.scheme, parsed.netloc, "/postgres", parsed.params, parsed.query, parsed.fragment))
    try:
        conn = psycopg2.connect(admin_url)
    except Exception:
        return  # e.g. PostgreSQL not running; init_db() will raise a clear error later
    conn.autocommit = True
    try:
        cur = conn.cursor()
        cur.execute("SELECT 1 FROM pg_database WHERE datname = %s", (dbname,))
        if cur.fetchone() is None:
            cur.execute(sql.SQL("CREATE DATABASE {}").format(sql.Identifier(dbname)))
    finally:
        conn.close()


_ensure_test_database()

# Ensure Backend root is on path
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from fastapi.testclient import TestClient

from main import app
from models.base import init_db, SessionLocal, engine
from models.user import User
from models.otp import OTP
from sqlalchemy import text

# Create tables immediately so they exist before any request (avoids "no such table")
init_db()


def _ensure_reporter_national_id_column() -> None:
    """Add reporter_national_id to reports if missing (e.g. test DB created before this column existed)."""
    try:
        with engine.connect() as conn:
            conn.execute(text("ALTER TABLE reports ADD COLUMN IF NOT EXISTS reporter_national_id VARCHAR(16)"))
            conn.commit()
    except Exception:
        pass  # table might not exist yet or column already there


_ensure_reporter_national_id_column()


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
    If the user already exists (e.g. from a previous test), skip register and just login.
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
        reg_data = reg.json()
        code = reg_data.get("dev_otp")
        if not code:
            db = SessionLocal()
            try:
                otp_row = db.query(OTP).filter(OTP.email == email, OTP.purpose == "register").order_by(OTP.created_at.desc()).first()
                assert otp_row is not None
                code = otp_row.code
            finally:
                db.close()
        client.post("/api/auth/verify-email", json={"email": email, "code": code})
    else:
        # User already exists (e.g. from a previous run); skip register/verify
        assert reg.status_code == 400 and "already registered" in (reg.json().get("detail") or "").lower()
    r = client.post(
        "/api/auth/login",
        json={"email": email, "password": password},
    )
    assert r.status_code == 200, r.text
    data = r.json()
    assert data.get("requires_otp") is True, "Expected OTP step"
    email = data["email"]
    code = data.get("dev_otp")
    if not code:
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
