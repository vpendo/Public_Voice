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
            "email": "jane@test.rw",
            "password": "SecurePass123!",
        },
    )
    assert r.status_code == 200
    data = r.json()
    assert data["email"] == "jane@test.rw"
    assert data["full_name"] == "Jane Doe"
    assert data["role"] == "User"
    assert "id" in data


def test_register_duplicate_email(client: TestClient) -> None:
    payload = {
        "full_name": "First User",
        "email": "same@test.rw",
        "password": "Pass123!",
    }
    client.post("/api/auth/register", json=payload)
    r = client.post("/api/auth/register", json=payload)
    assert r.status_code == 400
    assert "already registered" in r.json().get("detail", "").lower()


def test_login_success(client: TestClient) -> None:
    client.post(
        "/api/auth/register",
        json={"full_name": "Log Me In", "email": "login@test.rw", "password": "Pass123!"},
    )
    r = client.post(
        "/api/auth/login",
        json={"email": "login@test.rw", "password": "Pass123!"},
    )
    assert r.status_code == 200
    data = r.json()
    assert "access_token" in data
    assert data["user"]["email"] == "login@test.rw"


def test_login_invalid_password(client: TestClient) -> None:
    client.post(
        "/api/auth/register",
        json={"full_name": "User", "email": "user@test.rw", "password": "GoodPass123!"},
    )
    r = client.post(
        "/api/auth/login",
        json={"email": "user@test.rw", "password": "WrongPass"},
    )
    assert r.status_code == 401
    assert "invalid" in r.json().get("detail", "").lower()


def test_login_unknown_email(client: TestClient) -> None:
    r = client.post(
        "/api/auth/login",
        json={"email": "nobody@test.rw", "password": "AnyPass123!"},
    )
    assert r.status_code == 401


def test_me_requires_auth(client: TestClient) -> None:
    r = client.get("/api/auth/me")
    assert r.status_code == 401


def test_me_success(client: TestClient, auth_headers: dict) -> None:
    r = client.get("/api/auth/me", headers=auth_headers)
    assert r.status_code == 200
    assert r.json()["email"] == "citizen@test.rw"
