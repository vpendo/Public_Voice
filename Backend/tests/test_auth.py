"""
Auth API tests: register (name, email, password), verify-email, login (email, password), verify-otp.
Run: pytest tests/test_auth.py -v
"""
import pytest
from fastapi.testclient import TestClient


def test_register_success(client: TestClient) -> None:
    r = client.post(
        "/api/auth/register",
        json={
            "full_name": "Jane Doe",
            "email": "jane@example.com",
            "password": "Pass1234",
        },
    )
    assert r.status_code == 200
    data = r.json()
    assert data["email"] == "jane@example.com"
    assert "message" in data


def test_register_duplicate_email(client: TestClient) -> None:
    payload = {
        "full_name": "First User",
        "email": "dup@example.com",
        "password": "Pass1234",
    }
    client.post("/api/auth/register", json=payload)
    r = client.post("/api/auth/register", json=payload)
    assert r.status_code == 400
    assert "already registered" in r.json().get("detail", "").lower()


def test_login_requires_otp(client: TestClient) -> None:
    """Register, verify email, then login returns requires_otp and email; verify-otp returns token."""
    from models.base import SessionLocal
    from models.user import User
    from models.otp import OTP

    client.post(
        "/api/auth/register",
        json={"full_name": "Log Me In", "email": "login@example.com", "password": "Pass1234"},
    )
    db = SessionLocal()
    try:
        otp_row = db.query(OTP).filter(OTP.email == "login@example.com", OTP.purpose == "register").order_by(OTP.created_at.desc()).first()
        assert otp_row is not None
        code = otp_row.code
    finally:
        db.close()
    client.post("/api/auth/verify-email", json={"email": "login@example.com", "code": code})
    r = client.post(
        "/api/auth/login",
        json={"email": "login@example.com", "password": "Pass1234"},
    )
    assert r.status_code == 200
    data = r.json()
    assert data.get("requires_otp") is True
    assert data["email"] == "login@example.com"
    db = SessionLocal()
    try:
        otp_row = db.query(OTP).filter(OTP.email == "login@example.com", OTP.purpose == "login").order_by(OTP.created_at.desc()).first()
        assert otp_row is not None
        code = otp_row.code
    finally:
        db.close()
    r2 = client.post("/api/auth/login/verify-otp", json={"email": "login@example.com", "code": code})
    assert r2.status_code == 200
    data2 = r2.json()
    assert "access_token" in data2
    assert data2["user"]["email"] == "login@example.com"


def test_login_invalid_password(client: TestClient) -> None:
    from models.base import SessionLocal
    from models.otp import OTP
    client.post(
        "/api/auth/register",
        json={"full_name": "User", "email": "wrongpass@example.com", "password": "Pass1234"},
    )
    db = SessionLocal()
    try:
        otp_row = db.query(OTP).filter(OTP.email == "wrongpass@example.com", OTP.purpose == "register").order_by(OTP.created_at.desc()).first()
        if otp_row:
            client.post("/api/auth/verify-email", json={"email": "wrongpass@example.com", "code": otp_row.code})
    finally:
        db.close()
    r = client.post(
        "/api/auth/login",
        json={"email": "wrongpass@example.com", "password": "WrongPass1"},
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
