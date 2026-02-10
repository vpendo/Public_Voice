"""
Auth: register (admin only), login, me.
"""
from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from core.config import settings
from core.security import hash_password, verify_password, create_access_token
from core.deps import get_current_user, CurrentUser
from models.base import get_db
from models.user import User
from schemas.auth import UserRegister, UserLogin, TokenResponse, UserResponse

router = APIRouter(prefix="/api/auth", tags=["auth"])


@router.post("/register", response_model=UserResponse)
def register(
    payload: UserRegister,
    db: Annotated[Session, Depends(get_db)],
) -> User:
    """Register a new admin. Only admin role is created."""
    existing = db.query(User).filter(User.email == payload.email.lower()).first()
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered",
        )
    user = User(
        full_name=payload.full_name.strip(),
        email=payload.email.lower().strip(),
        hashed_password=hash_password(payload.password),
        role="Admin",
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    return user


@router.post("/login", response_model=TokenResponse)
def login(
    payload: UserLogin,
    db: Annotated[Session, Depends(get_db)],
) -> TokenResponse:
    """Login with email/password. Returns JWT access token."""
    user = db.query(User).filter(User.email == payload.email.lower().strip()).first()
    if not user or not verify_password(payload.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password",
        )
    if user.role != "Admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Admin access only",
        )
    token = create_access_token(subject=user.id)
    return TokenResponse(
        access_token=token,
        token_type="bearer",
        expires_in_minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES,
    )


@router.get("/me", response_model=UserResponse)
def me(current_user: CurrentUser) -> User:
    """Return current authenticated admin user."""
    return current_user
