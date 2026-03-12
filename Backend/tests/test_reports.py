"""
Reports API tests: create, list mine, get one; different data values.
Run: pytest tests/test_reports.py -v
"""
import pytest
from fastapi.testclient import TestClient

# Allowed by schemas/report.py (cell-level)
ALLOWED_CATEGORIES = (
    "service_delivery",
    "land_property",
    "infrastructure_utilities",
    "social_community",
    "administrative",
)
ALLOWED_INSTITUTIONS = (
    "cell_office",
    "sector_office",
    "district_authority",
    "social_affairs_officer",
    "land_bureau",
    "other",
)


def _report_payload(**overrides) -> dict:
    base = {
        "name": "Test User",
        "phone": "+250788123456",
        "district": "Gasabo",
        "sector": "Remera",
        "institution": "district_authority",
        "category": "infrastructure_utilities",
        "description": "Potholes on the main road near the market.",
        "consent": True,
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
    assert data["category"] == "infrastructure_utilities"
    assert data["status"] == "pending"
    assert "id" in data
    assert "created_at" in data


def test_create_report_different_data(client: TestClient, auth_headers: dict) -> None:
    r = client.post(
        "/api/reports",
        json=_report_payload(
            category="infrastructure_utilities",
            institution="sector_office",
            district="Musanze",
            sector="Nyabihu",
            description="No water supply in the village for two weeks.",
        ),
        headers=auth_headers,
    )
    assert r.status_code == 201
    data = r.json()
    assert data["category"] == "infrastructure_utilities"
    assert data["institution"] == "sector_office"
    assert data.get("district") == "Musanze"
    assert data.get("sector") == "Nyabihu"


def test_create_report_unauthorized(client: TestClient) -> None:
    r = client.post("/api/reports", json=_report_payload())
    assert r.status_code == 401


def test_list_my_reports_empty(client: TestClient) -> None:
    """Use a fresh user with no reports so /api/reports/mine returns []."""
    from models.base import SessionLocal
    from models.otp import OTP

    client.post(
        "/api/auth/register",
        json={
            "full_name": "Empty Reports User",
            "email": "emptyreports@example.com",
            "password": "Pass1234",
        },
    )
    db = SessionLocal()
    try:
        otp_row = db.query(OTP).filter(OTP.email == "emptyreports@example.com", OTP.purpose == "register").order_by(OTP.created_at.desc()).first()
        assert otp_row is not None
        client.post("/api/auth/verify-email", json={"email": "emptyreports@example.com", "code": otp_row.code})
    finally:
        db.close()

    login_r = client.post(
        "/api/auth/login",
        json={"email": "emptyreports@example.com", "password": "Pass1234"},
    )
    assert login_r.status_code == 200
    data = login_r.json()
    assert data.get("requires_otp") is True
    email = data["email"]

    db = SessionLocal()
    try:
        otp_row = (
            db.query(OTP)
            .filter(OTP.email == email, OTP.purpose == "login")
            .order_by(OTP.created_at.desc())
            .first()
        )
        assert otp_row is not None
        code = otp_row.code
    finally:
        db.close()

    verify_r = client.post("/api/auth/login/verify-otp", json={"email": email, "code": code})
    assert verify_r.status_code == 200
    token = verify_r.json()["access_token"]
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


def test_create_report_ai_failure(client: TestClient, auth_headers: dict, monkeypatch) -> None:
    """If the AI step fails (e.g. quota), report is still saved with raw description."""
    monkeypatch.setattr("services.ai_processor.process_issue_text", lambda text, category=None: None)
    monkeypatch.setattr("routers.reports.process_issue_text", lambda text, category=None: None)
    payload = _report_payload()
    r = client.post("/api/reports", json=payload, headers=auth_headers)
    assert r.status_code == 201
    data = r.json()
    assert "tracking_id" in data
    assert data.get("raw_description") == payload["description"]
