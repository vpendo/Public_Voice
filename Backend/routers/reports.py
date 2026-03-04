import logging
from collections import defaultdict
from datetime import datetime, timedelta
from typing import Annotated, List, Optional

from fastapi import APIRouter, Depends, HTTPException, status, Query
from fastapi.responses import StreamingResponse
from sqlalchemy import func
from sqlalchemy.orm import Session

from core.deps import get_current_user, get_current_admin, CurrentUser, CurrentAdmin
from models.base import get_db
from models.report import Report
from models.user import User
from schemas.report import (
    ReportCreate,
    ReportResponse,
    ReportUpdate,
    ReportUserUpdate,
    ReportStatsResponse,
)
from services.ai_processor import process_issue_text
from services.notify import send_new_report_notification
import csv
import io

router = APIRouter(prefix="/api/reports", tags=["reports"])


def _generate_tracking_id(db: Session) -> str:
    """Generate unique tracking ID: PV-YYYYMMDD-NNNN (e.g. PV-20250302-0001)."""
    today = datetime.utcnow().strftime("%Y%m%d")
    prefix = f"PV-{today}-"
    last = (
        db.query(Report)
        .filter(Report.tracking_id.isnot(None), Report.tracking_id.like(f"{prefix}%"))
        .order_by(Report.id.desc())
        .first()
    )
    if last and last.tracking_id:
        try:
            num = int(last.tracking_id.split("-")[-1])
            next_num = num + 1
        except (IndexError, ValueError):
            next_num = 1
    else:
        next_num = 1
    return f"{prefix}{next_num:04d}"


def _build_location_string(
    district: Optional[str],
    sector: Optional[str],
    cell: Optional[str],
    village: Optional[str],
    landmark: Optional[str],
) -> Optional[str]:
    """Build legacy location string for backward compatibility."""
    parts = [p for p in (district, sector, cell, village) if p and p.strip()]
    if landmark and landmark.strip():
        parts.append(landmark.strip())
    return ", ".join(parts) if parts else None


def _apply_admin_scope(query, admin: User):
    """Filter report query by admin's geographic scope (cell, sector, district)."""
    level = (getattr(admin, "admin_scope_level", None) or "").strip().lower() or "all"
    if level == "all":
        return query
    district = (getattr(admin, "scope_district", None) or "").strip() or None
    sector = (getattr(admin, "scope_sector", None) or "").strip() or None
    cell = (getattr(admin, "scope_cell", None) or "").strip() or None
    if level == "district" and district:
        query = query.filter(Report.district.ilike(district))
    elif level == "sector" and district and sector:
        query = query.filter(Report.district.ilike(district), Report.sector.ilike(sector))
    elif level == "cell" and district and sector and cell:
        query = query.filter(
            Report.district.ilike(district),
            Report.sector.ilike(sector),
            Report.cell.ilike(cell),
        )
    return query


# ---------------- User endpoints ----------------
@router.post("", response_model=ReportResponse, status_code=status.HTTP_201_CREATED)
def create_report(
    payload: ReportCreate,
    db: Annotated[Session, Depends(get_db)],
    current_user: CurrentUser,
) -> ReportResponse:
    """
    Submit a community problem report (cell-level form).
    Auth required. Raw text is sent to AI for translation/structuring.
    Generates tracking_id; status = pending.
    """
    raw_description = payload.description
    structured_description = None
    title = payload.title or None
    institution = payload.institution
    category = payload.category
    problem_type = payload.problem_type
    urgency = payload.urgency or "medium"

    # AI: structure/translate description (Kinyarwanda → English), optionally suggest title, institution, category
    ai_result = process_issue_text(raw_description, category=category)
    if ai_result:
        structured_description = ai_result.get("structured_description") or structured_description
        title = ai_result.get("suggested_title") or title
        institution = ai_result.get("suggested_institution") or institution
        category = ai_result.get("suggested_category") or category
        if ai_result.get("suggested_problem_type"):
            problem_type = ai_result.get("suggested_problem_type") or problem_type
        if not structured_description:
            logging.getLogger(__name__).warning("AI returned no structured_description for report (first 50 chars): %s", raw_description[:50])
    else:
        logging.getLogger(__name__).warning(
            "Report saved WITHOUT AI translation. Check: 1) OPENAI_API_KEY in Backend/.env 2) Backend terminal for 'OPENAI_API_KEY is empty' or 'AI processing failed'. Raw (50 chars): %s",
            raw_description[:50],
        )

    tracking_id = _generate_tracking_id(db)
    location_str = _build_location_string(
        payload.district, payload.sector, payload.cell, payload.village, payload.landmark
    )

    report = Report(
        user_id=current_user.id,
        tracking_id=tracking_id,
        name=payload.name or "",
        phone=payload.phone,
        gender=payload.gender,
        reporter_village=payload.reporter_village,
        reporter_cell=payload.reporter_cell,
        reporter_sector=payload.reporter_sector,
        reporter_district=payload.reporter_district,
        category=category,
        problem_type=problem_type,
        title=title,
        raw_description=raw_description,
        structured_description=structured_description,
        province=payload.province,
        district=payload.district,
        sector=payload.sector,
        cell=payload.cell,
        village=payload.village,
        landmark=payload.landmark,
        location=location_str,
        urgency=urgency,
        evidence_photo=payload.evidence_photo,
        evidence_video=payload.evidence_video,
        evidence_voice=payload.evidence_voice,
        institution=institution,
        consent=payload.consent,
        status="pending",
    )
    db.add(report)
    db.commit()
    db.refresh(report)
    try:
        send_new_report_notification(report)
    except Exception:
        pass  # do not fail report creation if notification fails
    return report


# ---------------- Other endpoints remain unchanged ----------------
@router.get("/mine", response_model=List[ReportResponse])
def list_my_reports(
    db: Annotated[Session, Depends(get_db)],
    current_user: CurrentUser,
    skip: int = Query(0, ge=0),
    limit: int = Query(50, ge=1, le=200),
) -> List[ReportResponse]:
    """List reports submitted by the current user only."""
    return (
        db.query(Report)
        .filter(Report.user_id == current_user.id)
        .order_by(Report.created_at.desc())
        .offset(skip)
        .limit(limit)
        .all()
    )


@router.patch("/mine/{report_id}", response_model=ReportResponse)
def update_my_report(
    report_id: int,
    payload: ReportUserUpdate,
    db: Annotated[Session, Depends(get_db)],
    current_user: CurrentUser,
) -> ReportResponse:
    """Update own report. Only the report owner can update (title, description, category, etc.)."""
    report = db.query(Report).filter(Report.id == report_id).first()
    if not report:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Report not found",
        )
    if report.user_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not allowed to update this report",
        )
    if payload.name is not None:
        report.name = payload.name
    if payload.phone is not None:
        report.phone = payload.phone
    if payload.description is not None:
        report.raw_description = payload.description
    if payload.category is not None:
        report.category = payload.category
    if payload.problem_type is not None:
        report.problem_type = payload.problem_type
    if payload.district is not None:
        report.district = payload.district
    if payload.sector is not None:
        report.sector = payload.sector
    if payload.cell is not None:
        report.cell = payload.cell
    if payload.village is not None:
        report.village = payload.village
    if payload.urgency is not None:
        report.urgency = payload.urgency
    if payload.institution is not None:
        report.institution = payload.institution
    if report.district or report.sector or report.cell or report.village or report.landmark:
        report.location = _build_location_string(
            report.district, report.sector, report.cell, report.village, report.landmark
        )
    db.commit()
    db.refresh(report)
    return report


# ---------------- Admin-only routes (must be before /{report_id}) ----------------
@router.get("/stats", response_model=ReportStatsResponse)
def get_report_stats(
    db: Annotated[Session, Depends(get_db)],
    current_admin: CurrentAdmin,
    months: int = Query(6, ge=1, le=24, description="Months of trend data"),
) -> ReportStatsResponse:
    """Dashboard stats: total, by status, category, urgency, monthly trend. Admin only."""
    base = db.query(Report)
    if getattr(current_admin, "admin_category", None):
        base = base.filter(Report.category == current_admin.admin_category)
    base = _apply_admin_scope(base, current_admin)
    reports = base.all()
    total = len(reports)
    by_status = defaultdict(int)
    by_category = defaultdict(int)
    by_urgency = defaultdict(int)
    for r in reports:
        by_status[r.status or "pending"] += 1
        by_category[r.category or "other"] += 1
        by_urgency[r.urgency or "medium"] += 1
    monthly = defaultdict(int)
    cutoff = datetime.utcnow() - timedelta(days=months * 31)
    for r in reports:
        if r.created_at and r.created_at.replace(tzinfo=None) >= cutoff:
            key = r.created_at.strftime("%Y-%m")
            monthly[key] += 1
    months_list = sorted(monthly.keys())
    monthly_trend = [{"month": m, "count": monthly[m]} for m in months_list]
    return ReportStatsResponse(
        total=total,
        by_status=dict(by_status),
        by_category=dict(by_category),
        by_urgency=dict(by_urgency),
        monthly_trend=monthly_trend,
    )


@router.get("/export")
def export_reports(
    db: Annotated[Session, Depends(get_db)],
    current_admin: CurrentAdmin,
    format: str = Query("csv", description="Export format: csv"),
    status_filter: Optional[str] = Query(None),
    category_filter: Optional[str] = Query(None),
    date_from: Optional[str] = Query(None),
    date_to: Optional[str] = Query(None),
):
    """Export reports as CSV. Admin only. Same filters as list_reports."""
    query = db.query(Report)
    if getattr(current_admin, "admin_category", None):
        query = query.filter(Report.category == current_admin.admin_category)
    query = _apply_admin_scope(query, current_admin)
    if status_filter:
        query = query.filter(Report.status == status_filter)
    if category_filter:
        query = query.filter(Report.category == category_filter)
    if date_from:
        try:
            d = datetime.strptime(date_from, "%Y-%m-%d")
            query = query.filter(func.date(Report.created_at) >= d.date())
        except ValueError:
            pass
    if date_to:
        try:
            d = datetime.strptime(date_to, "%Y-%m-%d")
            query = query.filter(func.date(Report.created_at) <= d.date())
        except ValueError:
            pass
    reports = query.order_by(Report.created_at.desc()).limit(5000).all()
    if format != "csv":
        raise HTTPException(status_code=400, detail="Only format=csv is supported")
    buf = io.StringIO()
    w = csv.writer(buf)
    w.writerow([
        "id", "tracking_id", "name", "phone", "category", "problem_type", "urgency",
        "status", "district", "sector", "cell", "village", "created_at", "institution",
    ])
    for r in reports:
        w.writerow([
            r.id,
            r.tracking_id or "",
            r.name or "",
            r.phone or "",
            r.category or "",
            r.problem_type or "",
            r.urgency or "",
            r.status or "",
            r.district or "",
            r.sector or "",
            r.cell or "",
            r.village or "",
            r.created_at.isoformat() if r.created_at else "",
            r.institution or "",
        ])
    buf.seek(0)
    return StreamingResponse(
        iter([buf.getvalue()]),
        media_type="text/csv",
        headers={"Content-Disposition": "attachment; filename=publicvoice_reports.csv"},
    )


@router.delete("/{report_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_report(
    report_id: int,
    db: Annotated[Session, Depends(get_db)],
    current_user: CurrentUser,
) -> None:
    """Delete a report. Admin can delete any (or only their category/scope if scoped); users can delete only their own."""
    query = db.query(Report).filter(Report.id == report_id)
    if current_user.role == "Admin":
        query = _apply_admin_scope(query, current_user)
    report = query.first()
    if not report:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Report not found",
        )
    if current_user.role == "Admin":
        admin_cat = getattr(current_user, "admin_category", None)
        if admin_cat and report.category != admin_cat:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Not allowed to delete reports outside your category",
            )
    elif report.user_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not allowed to delete this report",
        )
    db.delete(report)
    db.commit()
    return None


@router.get("/{report_id}", response_model=ReportResponse)
def get_report(
    report_id: int,
    db: Annotated[Session, Depends(get_db)],
    current_user: CurrentUser,
) -> ReportResponse:
    """
    Get one report by ID.
    Admin sees only reports in their category/scope; normal users see only their own.
    """
    query = db.query(Report).filter(Report.id == report_id)
    if current_user.role == "Admin":
        query = _apply_admin_scope(query, current_user)
    report = query.first()
    if not report:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Report not found",
        )
    if current_user.role == "Admin":
        admin_cat = getattr(current_user, "admin_category", None)
        if admin_cat and report.category != admin_cat:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Not allowed to view reports outside your category",
            )
    elif report.user_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not allowed to view this report",
        )
    return report


# ---------------- Admin endpoints ----------------
@router.get("", response_model=List[ReportResponse])
def list_reports(
    db: Annotated[Session, Depends(get_db)],
    current_admin: CurrentAdmin,
    status_filter: Optional[str] = Query(None, description="Filter by status"),
    category_filter: Optional[str] = Query(None, description="Filter by category"),
    problem_type_filter: Optional[str] = Query(None, description="Filter by problem type"),
    urgency_filter: Optional[str] = Query(None, description="Filter by urgency"),
    date_from: Optional[str] = Query(None, description="From date YYYY-MM-DD"),
    date_to: Optional[str] = Query(None, description="To date YYYY-MM-DD"),
    search: Optional[str] = Query(None, description="Search tracking ID or reporter name"),
    skip: int = Query(0, ge=0),
    limit: int = Query(50, ge=1, le=200),
) -> List[ReportResponse]:
    """List all reports. Admin only. Supports filters and search."""
    query = db.query(Report)
    if getattr(current_admin, "admin_category", None):
        query = query.filter(Report.category == current_admin.admin_category)
    query = _apply_admin_scope(query, current_admin)
    if status_filter:
        query = query.filter(Report.status == status_filter)
    if category_filter:
        query = query.filter(Report.category == category_filter)
    if problem_type_filter:
        query = query.filter(Report.problem_type == problem_type_filter)
    if urgency_filter:
        query = query.filter(Report.urgency == urgency_filter)
    if date_from:
        try:
            d = datetime.strptime(date_from, "%Y-%m-%d")
            query = query.filter(func.date(Report.created_at) >= d.date())
        except ValueError:
            pass
    if date_to:
        try:
            d = datetime.strptime(date_to, "%Y-%m-%d")
            query = query.filter(func.date(Report.created_at) <= d.date())
        except ValueError:
            pass
    if search and search.strip():
        q = f"%{search.strip()}%"
        query = query.filter(
            (Report.tracking_id.ilike(q)) | (Report.name.ilike(q))
        )
    return query.order_by(Report.created_at.desc()).offset(skip).limit(limit).all()


@router.patch("/{report_id}", response_model=ReportResponse)
def update_report(
    report_id: int,
    payload: ReportUpdate,
    db: Annotated[Session, Depends(get_db)],
    current_admin: CurrentAdmin,
) -> ReportResponse:
    """Update report status and/or admin response. Admin only. Scope/category-scoped admins can only update reports in their scope."""
    query = db.query(Report).filter(Report.id == report_id)
    query = _apply_admin_scope(query, current_admin)
    report = query.first()
    if not report:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Report not found",
        )
    admin_cat = getattr(current_admin, "admin_category", None)
    if admin_cat and report.category != admin_cat:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not allowed to update reports outside your category",
        )

    # Update fields if provided
    if payload.status is not None:
        report.status = payload.status
    if payload.admin_response is not None:
        report.admin_response = payload.admin_response
    if payload.admin_notes is not None:
        report.admin_notes = payload.admin_notes

    db.commit()
    db.refresh(report)
    return report