"""
Users: list (admin only).
"""
from typing import Annotated, List

from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session

from core.deps import CurrentAdmin
from models.base import get_db
from models.user import User
from schemas.auth import UserResponse

router = APIRouter(prefix="/api/users", tags=["users"])


@router.get("", response_model=List[UserResponse])
def list_users(
    db: Annotated[Session, Depends(get_db)],
    current_admin: CurrentAdmin,
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=500),
    include_admin: bool = Query(False, description="Include the admin in the list"),
) -> List[User]:
    """
    List all users. Admin only.
    By default, the single admin is excluded unless include_admin=True.
    """
    query = db.query(User)
    if not include_admin:
        query = query.filter(User.role != "Admin")
    return query.order_by(User.created_at.desc()).offset(skip).limit(limit).all()
