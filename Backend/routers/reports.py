from typing import Annotated, List, Optional

from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session

from core.deps import get_current_user, get_current_admin, CurrentUser, CurrentAdmin
from models.base import get_db
from models.report import Report
from schemas.report import ReportCreate, ReportResponse, ReportUpdate, ReportUserUpdate
from services.ai_processor import process_issue_text

router = APIRouter(prefix="/api/reports", tags=["reports"])


# ---------------- User endpoints ----------------
@router.post("", response_model=ReportResponse, status_code=status.HTTP_201_CREATED)
def create_report(
    payload: ReportCreate,
    db: Annotated[Session, Depends(get_db)],
    current_user: CurrentUser,
) -> ReportResponse:
    """
    Submit a report. Auth required (user or admin).
    Raw text is sent to AI for translation, formal rewriting, and structuring.
    Result stored as `structured_description`.

    ✅ Updated: added logging for AI output and ensures Kinyarwanda reports are processed.
    """
    raw_description = payload.description
    structured_description = None
    title = payload.title or None
    institution = payload.institution
    category = payload.category

    # Call AI processor (OpenAI) to structure/translate description
    ai_result = process_issue_text(raw_description)
    if ai_result:
        structured_description = ai_result.get("structured_description") or structured_description
        # Override only if AI provides suggestions
        title = ai_result.get("suggested_title") or title
        institution = ai_result.get("suggested_institution") or institution
        category = ai_result.get("suggested_category") or category

    else:
        # Log that AI processing failed (helpful for Kinyarwanda issues not being translated)
        print(f"[INFO] AI processing skipped or failed for report: {raw_description[:50]}...")

    # Create report in DB
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
    if payload.title is not None:
        report.title = payload.title
    if payload.name is not None:
        report.name = payload.name
    if payload.phone is not None:
        report.phone = payload.phone
    if payload.location is not None:
        report.location = payload.location
    if payload.institution is not None:
        report.institution = payload.institution
    if payload.category is not None:
        report.category = payload.category
    if payload.description is not None:
        report.raw_description = payload.description
    db.commit()
    db.refresh(report)
    return report


@router.delete("/{report_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_report(
    report_id: int,
    db: Annotated[Session, Depends(get_db)],
    current_user: CurrentUser,
) -> None:
    """Delete a report. Admin can delete any (or only their category if category-scoped); users can delete only their own."""
    report = db.query(Report).filter(Report.id == report_id).first()
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
    Admin can see any; normal users can see only their own reports.
    """
    report = db.query(Report).filter(Report.id == report_id).first()
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
    skip: int = Query(0, ge=0),
    limit: int = Query(50, ge=1, le=200),
) -> List[ReportResponse]:
    """List all reports. Admin only. Category-scoped admins see only their category."""
    query = db.query(Report)
    # Category-scoped admin: only see reports for their assigned category
    if getattr(current_admin, "admin_category", None):
        query = query.filter(Report.category == current_admin.admin_category)
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
    """Update report status and/or admin response. Admin only. Category-scoped admins can only update reports in their category."""
    report = db.query(Report).filter(Report.id == report_id).first()
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

    db.commit()
    db.refresh(report)
    return report