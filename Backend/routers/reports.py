"""
Reports: POST (public), GET list and GET by id (admin only).
"""
from typing import Annotated, List

from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session

from core.deps import get_current_user, CurrentUser
from models.base import get_db
from models.report import Report
from schemas.report import ReportCreate, ReportResponse

router = APIRouter(prefix="/api/reports", tags=["reports"])


@router.post("", response_model=ReportResponse, status_code=status.HTTP_201_CREATED)
def create_report(
    payload: ReportCreate,
    db: Annotated[Session, Depends(get_db)],
) -> Report:
    """Citizens submit a report. No auth required."""
    report = Report(
        name=payload.name,
        phone=payload.phone,
        location=payload.location,
        institution=payload.institution,
        category=payload.category,
        raw_description=payload.description,
        status="new",
    )
    db.add(report)
    db.commit()
    db.refresh(report)
    return report


@router.get("", response_model=List[ReportResponse])
def list_reports(
    db: Annotated[Session, Depends(get_db)],
    current_user: CurrentUser,
    skip: int = Query(0, ge=0),
    limit: int = Query(50, ge=1, le=200),
) -> List[Report]:
    """List all reports. Admin only."""
    return db.query(Report).order_by(Report.created_at.desc()).offset(skip).limit(limit).all()


@router.get("/{report_id}", response_model=ReportResponse)
def get_report(
    report_id: int,
    db: Annotated[Session, Depends(get_db)],
    current_user: CurrentUser,
) -> Report:
    """Get one report by id. Admin only."""
    report = db.query(Report).filter(Report.id == report_id).first()
    if not report:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Report not found",
        )
    return report
