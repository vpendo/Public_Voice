"""
Users: list, create, delete (admin only).
"""
from typing import Annotated, List

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy import distinct
from sqlalchemy.orm import Session

from core.deps import CurrentAdmin
from core.security import hash_password
from models.base import get_db
from models.user import User
from models.report import Report
from schemas.auth import CreateAdminRequest, UserResponse

router = APIRouter(prefix="/api/users", tags=["users"])


def _apply_user_scope_filter(query, admin: User, db: Session):
    """
    Filter users based on admin scope:
    - SuperAdmin: See all users and admins
    - General Admin (scope_level="all"): See all users and admins
    - Scoped Admin (cell/sector/district): See only users who reported problems in their scope
    """
    # SuperAdmin sees everything
    if admin.role == "SuperAdmin":
        return query
    
    # General admin (scope_level="all") sees everything
    scope_level = (getattr(admin, "admin_scope_level", None) or "").strip().lower() or "all"
    if scope_level == "all":
        return query
    
    # Scoped admins: Only show users who have reports in their scope
    district = (getattr(admin, "scope_district", None) or "").strip() or None
    sector = (getattr(admin, "scope_sector", None) or "").strip() or None
    cell = (getattr(admin, "scope_cell", None) or "").strip() or None
    
    # Build report query based on scope level - use subquery for better performance
    report_subquery = db.query(distinct(Report.user_id)).filter(Report.user_id.isnot(None))
    
    if scope_level == "district" and district:
        report_subquery = report_subquery.filter(Report.district.ilike(district))
    elif scope_level == "sector" and district and sector:
        report_subquery = report_subquery.filter(
            Report.district.ilike(district),
            Report.sector.ilike(sector)
        )
    elif scope_level == "cell" and district and sector and cell:
        report_subquery = report_subquery.filter(
            Report.district.ilike(district),
            Report.sector.ilike(sector),
            Report.cell.ilike(cell)
        )
    else:
        # Invalid scope, return empty
        return query.filter(User.id == -1)
    
    # Use subquery directly instead of loading into memory - much faster
    # Only show users (not admins) who have reports in this scope
    query = query.filter(
        User.id.in_(report_subquery),
        User.role == "User"  # Only regular users, not admins
    )
    
    return query


@router.get("", response_model=List[UserResponse])
def list_users(
    db: Annotated[Session, Depends(get_db)],
    current_admin: CurrentAdmin,
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=500),
    include_admin: bool = Query(True, description="Include admins in the list"),
) -> List[User]:
    """
    List users based on admin scope:
    - SuperAdmin: See all users and admins (can manage all)
    - General Admin (scope_level="all"): See all users and admins (can manage all)
    - Scoped Admin (cell/sector/district): See ONLY regular users who reported problems in their scope (cannot see other admins)
    """
    query = db.query(User)
    
    # Apply scope filtering
    query = _apply_user_scope_filter(query, current_admin, db)
    
    # Filter out admins if requested
    if not include_admin:
        query = query.filter(User.role != "Admin", User.role != "SuperAdmin")
    
    return query.order_by(User.created_at.desc()).offset(skip).limit(limit).all()


@router.post("/admin", response_model=UserResponse, status_code=status.HTTP_201_CREATED)
def create_admin(
    admin_data: CreateAdminRequest,
    db: Annotated[Session, Depends(get_db)],
    current_admin: CurrentAdmin,
) -> User:
    """Create a new admin user. Only existing admins can create other admins."""
    existing = db.query(User).filter(User.email == admin_data.email).first()
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="User with this email already exists",
        )

    user = User(
        full_name=admin_data.full_name,
        email=admin_data.email,
        hashed_password=hash_password(admin_data.password),
        role="Admin",
        admin_category=admin_data.admin_category,
        admin_scope_level=admin_data.admin_scope_level or "all",
        scope_district=admin_data.scope_district,
        scope_sector=admin_data.scope_sector,
        scope_cell=admin_data.scope_cell,
        phone_verified=True,
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    return user


@router.delete("/admin/{user_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_admin(
    user_id: int,
    db: Annotated[Session, Depends(get_db)],
    current_admin: CurrentAdmin,
) -> None:
    """Delete an admin user. Cannot delete yourself."""
    if user_id == current_admin.id:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Cannot delete your own account",
        )

    user = db.query(User).filter(User.id == user_id, User.role == "Admin").first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Admin user not found",
        )

    db.delete(user)
    db.commit()
    return None
