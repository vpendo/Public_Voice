"""
Reports API tests: create, list mine, get one; different data values.
Run: pytest tests/test_reports.py -v
"""
import pytest
from fastapi.testclient import TestClient


def _report_payload(**overrides: str) -> dict:
    base = {
        "name": "Test User",
        "phone": "+250788123456",
        "location": "Kigali, Gasabo",
        "institution": "district",
        "category": "roads",
        "description": "Potholes on the main road near the market.",
    }
    base.update(overrides)
    return base


def test_create_report_success(client: TestClient, auth_headers: dict) -> None:
    r = client.post(
        "/api/reports",
        json=_report_payload(),
        headers=auth_headers,
    )
    assert r.status_code == 201
    data = r.json()
    assert data["name"] == "Test User"
    assert data["category"] == "roads"
    assert data["status"] == "pending"
    assert "id" in data
    assert "created_at" in data


def test_create_report_different_data(client: TestClient, auth_headers: dict) -> None:
    r = client.post(
        "/api/reports",
        json=_report_payload(
            category="water",
            institution="sector",
            location="Musanze, Nyabihu",
            description="No water supply in the village for two weeks.",
        ),
        headers=auth_headers,
    )
    assert r.status_code == 201
    data = r.json()
    assert data["category"] == "water"
    assert data["institution"] == "sector"
    assert "Musanze" in data["location"]


def test_create_report_unauthorized(client: TestClient) -> None:
    r = client.post("/api/reports", json=_report_payload())
    assert r.status_code == 401


def test_list_my_reports_empty(client: TestClient) -> None:
    """Use a fresh user with no reports so /api/reports/mine returns []."""
    client.post(
        "/api/auth/register",
        json={
            "full_name": "Empty Reports User",
            "email": "empty_reports@test.rw",
            "password": "TestPass123!",
        },
    )
    login_r = client.post(
        "/api/auth/login",
        json={"email": "empty_reports@test.rw", "password": "TestPass123!"},
    )
    assert login_r.status_code == 200
    token = login_r.json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}
    r = client.get("/api/reports/mine", headers=headers)
    assert r.status_code == 200
    assert r.json() == []


def test_list_my_reports_after_create(client: TestClient, auth_headers: dict) -> None:
    client.post("/api/reports", json=_report_payload(description="Issue A"), headers=auth_headers)
    client.post("/api/reports", json=_report_payload(description="Issue B"), headers=auth_headers)
    r = client.get("/api/reports/mine", headers=auth_headers)
    assert r.status_code == 200
    reports = r.json()
    assert len(reports) >= 2
    descriptions = {x["raw_description"] for x in reports}
    assert "Issue A" in descriptions
    assert "Issue B" in descriptions


def test_get_report_own(client: TestClient, auth_headers: dict) -> None:
    create = client.post("/api/reports", json=_report_payload(), headers=auth_headers)
    assert create.status_code == 201
    report_id = create.json()["id"]
    r = client.get(f"/api/reports/{report_id}", headers=auth_headers)
    assert r.status_code == 200
    assert r.json()["id"] == report_id


def test_list_all_reports_requires_admin(client: TestClient, auth_headers: dict) -> None:
    r = client.get("/api/reports", headers=auth_headers)
    assert r.status_code == 403


def test_validation_invalid_category(client: TestClient, auth_headers: dict) -> None:
    r = client.post(
        "/api/reports",
        json=_report_payload(category="invalid_category"),
        headers=auth_headers,
    )
    assert r.status_code == 422


def test_validation_invalid_institution(client: TestClient, auth_headers: dict) -> None:
    r = client.post(
        "/api/reports",
        json=_report_payload(institution="invalid_inst"),
        headers=auth_headers,
    )
    assert r.status_code == 422
