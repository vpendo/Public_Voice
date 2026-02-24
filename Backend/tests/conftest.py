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
from models.base import init_db

# Create tables immediately so they exist before any request (avoids "no such table")
init_db()


def get_client() -> TestClient:
    return TestClient(app)


@pytest.fixture
def client() -> TestClient:
    return get_client()


@pytest.fixture
def auth_headers(client: TestClient) -> dict:
    """Register a user, then login to get Bearer token."""
    client.post(
        "/api/auth/register",
        json={
            "full_name": "Test Citizen",
            "email": "citizen@test.rw",
            "password": "TestPass123!",
        },
    )
    r = client.post(
        "/api/auth/login",
        json={"email": "citizen@test.rw", "password": "TestPass123!"},
    )
    assert r.status_code == 200, r.text
    token = r.json()["access_token"]
    return {"Authorization": f"Bearer {token}"}
