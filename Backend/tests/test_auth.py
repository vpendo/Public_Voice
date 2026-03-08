"""
Auth API tests: register, login, validation.
Run: pytest tests/test_auth.py -v
"""
import pytest
from fastapi.testclient import TestClient


def test_register_success(client: TestClient) -> None:
    r = client.post(
        "/api/auth/register",
        json={
            "full_name": "Jane Doe",
            "phone": "+250788111111",
            "national_id": "1111111111111111",
        },
    )
    assert r.status_code == 200
    data = r.json()
    assert data["phone"] == "+250788111111"
    assert "message" in data


def test_register_duplicate_phone(client: TestClient) -> None:
    payload = {
        "full_name": "First User",
        "phone": "+250788222222",
        "national_id": "2222222222222222",
    }
    client.post("/api/auth/register", json=payload)
    r = client.post("/api/auth/register", json=payload)
    assert r.status_code == 400
    assert "already registered" in r.json().get("detail", "").lower()


def test_login_requires_otp(client: TestClient) -> None:
    """Login returns requires_otp and phone; verify-otp with code returns token."""
    from models.base import SessionLocal
    from models.user import User
    from models.otp import OTP

    client.post(
        "/api/auth/register",
        json={"full_name": "Log Me In", "phone": "+250788333333", "national_id": "3333333333333333"},
    )
    db = SessionLocal()
    try:
        user = db.query(User).filter(User.phone == "+250788333333").first()
        if user:
            user.phone_verified = True
            db.commit()
    finally:
        db.close()
    r = client.post(
        "/api/auth/login",
        json={"phone": "+250788333333", "full_name": "Log Me In"},
    )
    assert r.status_code == 200
    data = r.json()
    assert data.get("requires_otp") is True
    assert data["phone"] == "+250788333333"
    db = SessionLocal()
    try:
        otp_row = db.query(OTP).filter(OTP.phone == "+250788333333", OTP.purpose == "login").order_by(OTP.created_at.desc()).first()
        assert otp_row is not None
        code = otp_row.code
    finally:
        db.close()
    r2 = client.post("/api/auth/login/verify-otp", json={"phone": "+250788333333", "code": code})
    assert r2.status_code == 200
    data2 = r2.json()
    assert "access_token" in data2
    assert data2["user"]["phone"] == "+250788333333"


def test_login_invalid_full_name(client: TestClient) -> None:
    from models.base import SessionLocal
    from models.user import User
    
    client.post(
        "/api/auth/register",
        json={"full_name": "User", "phone": "+250788444444", "national_id": "4444444444444444"},
    )
    db = SessionLocal()
    try:
        user = db.query(User).filter(User.phone == "+250788444444").first()
        if user:
            user.phone_verified = True
            db.commit()
    finally:
        db.close()
    r = client.post(
        "/api/auth/login",
        json={"phone": "+250788444444", "full_name": "Wrong Name"},
    )
    assert r.status_code == 401
    assert "match" in r.json().get("detail", "").lower()


def test_login_unknown_phone(client: TestClient) -> None:
    r = client.post(
        "/api/auth/login",
        json={"phone": "+250788999999", "full_name": "Nobody"},
    )
    assert r.status_code == 401


def test_me_requires_auth(client: TestClient) -> None:
    r = client.get("/api/auth/me")
    assert r.status_code == 401


def test_me_success(client: TestClient, auth_headers: dict) -> None:
    r = client.get("/api/auth/me", headers=auth_headers)
    assert r.status_code == 200
    assert r.json()["phone"] == "+250788123456"
