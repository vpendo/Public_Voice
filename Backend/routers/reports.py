from typing import Annotated, List, Optional

from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session

from core.deps import get_current_user, get_current_admin, CurrentUser, CurrentAdmin
from models.base import get_db
from models.report import Report
from schemas.report import ReportCreate, ReportResponse, ReportUpdate
from services.ai_processor import process_issue_text

router = APIRouter(prefix="/api/reports", tags=["reports"])


# ---------------- User endpoints ----------------
@router.post("", response_model=ReportResponse, status_code=status.HTTP_201_CREATED)
def create_report(
    payload: ReportCreate,
    db: Annotated[Session, Depends(get_db)],
    current_user: CurrentUser,
) -> ReportResponse:
    """Submit a report. Auth required (user or admin). Raw text is sent to AI for translation, formal rewriting, and structuring; result stored as structured_description."""
    raw_description = payload.description
    structured_description = None
    title = payload.title or None
    institution = payload.institution
    category = payload.category

    ai_result = process_issue_text(raw_description)
    if ai_result:
        structured_description = ai_result.get("structured_description")
        if ai_result.get("suggested_title"):
            title = ai_result["suggested_title"]
        if ai_result.get("suggested_institution"):
            institution = ai_result["suggested_institution"]
        if ai_result.get("suggested_category"):
            category = ai_result["suggested_category"]

    report = Report(
        user_id=current_user.id,
        title=title,
        name=payload.name,
        phone=payload.phone,
        location=payload.location,
        institution=institution,
        category=category,
        raw_description=raw_description,
        structured_description=structured_description,
        status="pending",
    )
    db.add(report)
    db.commit()
    db.refresh(report)
    return report


@router.get("/mine", response_model=List[ReportResponse])
def list_my_reports(
    db: Annotated[Session, Depends(get_db)],
    current_user: CurrentUser,
    skip: int = Query(0, ge=0),
    limit: int = Query(50, ge=1, le=200),
) -> List[ReportResponse]:
    """List reports submitted by the current user."""
    return (
        db.query(Report)
        .filter(Report.user_id == current_user.id)
        .order_by(Report.created_at.desc())
        .offset(skip)
        .limit(limit)
        .all()
    )


@router.get("/{report_id}", response_model=ReportResponse)
def get_report(
    report_id: int,
    db: Annotated[Session, Depends(get_db)],
    current_user: CurrentUser,
) -> ReportResponse:
    """Get one report by id. Admin can see any; user can see only their own."""
    report = db.query(Report).filter(Report.id == report_id).first()
    if not report:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Report not found",
        )
    if current_user.role != "Admin" and report.user_id != current_user.id:
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
    skip: int = Query(0, ge=0),
    limit: int = Query(50, ge=1, le=200),
) -> List[ReportResponse]:
    """List all reports. Admin only. Optional filters: status, category."""
    query = db.query(Report)
    if status_filter:
        query = query.filter(Report.status == status_filter)
    if category_filter:
        query = query.filter(Report.category == category_filter)
    return query.order_by(Report.created_at.desc()).offset(skip).limit(limit).all()


@router.patch("/{report_id}", response_model=ReportResponse)
def update_report(
    report_id: int,
    payload: ReportUpdate,
    db: Annotated[Session, Depends(get_db)],
    current_admin: CurrentAdmin,
) -> ReportResponse:
    """Update report status and/or admin response. Admin only."""
    report = db.query(Report).filter(Report.id == report_id).first()
    if not report:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Report not found",
        )

    # Pydantic now validates status
    if payload.status is not None:
        report.status = payload.status

    if payload.admin_response is not None:
        report.admin_response = payload.admin_response

    db.commit()
    db.refresh(report)
    return report
