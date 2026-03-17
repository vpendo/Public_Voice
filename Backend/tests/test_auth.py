"""
Auth API tests: register (name, email, password), verify-email, login (email, password), verify-otp.
Run: pytest tests/test_auth.py -v
Uses unique emails where a fresh user is needed so tests pass with a persistent test DB.
"""
import uuid
import pytest
from fastapi.testclient import TestClient


def test_register_success(client: TestClient) -> None:
    email = f"jane-{uuid.uuid4().hex[:8]}@example.com"
    r = client.post(
        "/api/auth/register",
        json={
            "full_name": "Jane Doe",
            "email": email,
            "password": "Pass1234",
        },
    )
    assert r.status_code == 200
    data = r.json()
    assert data["email"] == email
    assert "message" in data


def test_register_duplicate_email(client: TestClient) -> None:
    email = f"dup-{uuid.uuid4().hex[:8]}@example.com"
    payload = {
        "full_name": "First User",
        "email": email,
        "password": "Pass1234",
    }
    client.post("/api/auth/register", json=payload)
    r = client.post("/api/auth/register", json=payload)
    assert r.status_code == 400
    assert "already registered" in r.json().get("detail", "").lower()


def test_login_requires_otp(client: TestClient) -> None:
    """Register, verify email, then login returns requires_otp and email; verify-otp returns token."""
    from models.base import SessionLocal
    from models.otp import OTP

    email = f"login-{uuid.uuid4().hex[:8]}@example.com"
    reg = client.post(
        "/api/auth/register",
        json={"full_name": "Log Me In", "email": email, "password": "Pass1234"},
    )
    assert reg.status_code == 200
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
    r = client.post(
        "/api/auth/login",
        json={"email": email, "password": "Pass1234"},
    )
    assert r.status_code == 200
    data = r.json()
    assert data.get("requires_otp") is True
    assert data["email"] == email
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
    assert r2.status_code == 200
    data2 = r2.json()
    assert "access_token" in data2
    assert data2["user"]["email"] == email


def test_login_invalid_password(client: TestClient) -> None:
    from models.base import SessionLocal
    from models.otp import OTP
    email = f"wrongpass-{uuid.uuid4().hex[:8]}@example.com"
    reg = client.post(
        "/api/auth/register",
        json={"full_name": "User", "email": email, "password": "Pass1234"},
    )
    assert reg.status_code == 200
    reg_data = reg.json()
    code = reg_data.get("dev_otp")
    if not code:
        db = SessionLocal()
        try:
            otp_row = db.query(OTP).filter(OTP.email == email, OTP.purpose == "register").order_by(OTP.created_at.desc()).first()
            if otp_row:
                code = otp_row.code
        finally:
            db.close()
    if code:
        client.post("/api/auth/verify-email", json={"email": email, "code": code})
    r = client.post(
        "/api/auth/login",
        json={"email": email, "password": "WrongPass1"},
    )
    assert r.status_code == 401
    assert "password" in r.json().get("detail", "").lower()


def test_login_unknown_email(client: TestClient) -> None:
    r = client.post(
        "/api/auth/login",
        json={"email": "nobody@example.com", "password": "Pass1234"},
    )
    assert r.status_code == 401


def test_me_requires_auth(client: TestClient) -> None:
    r = client.get("/api/auth/me")
    assert r.status_code == 401


def test_me_success(client: TestClient, auth_headers: dict) -> None:
    r = client.get("/api/auth/me", headers=auth_headers)
    assert r.status_code == 200
    assert r.json()["email"] == "authuser@example.com"
