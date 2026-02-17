"""
Auth: user registration, login, forgot/reset password, profile update, and current user info.
- Users can self-register.
- Admin is created manually via script.
- Both can login and access their respective dashboards.
"""
import secrets
import uuid
from datetime import datetime, timedelta, timezone
from pathlib import Path
from typing import Annotated

from fastapi import APIRouter, Depends, File, Form, HTTPException, UploadFile, status
from sqlalchemy.orm import Session

from core.config import settings
from core.security import hash_password, verify_password, create_access_token
from core.email import send_password_reset_email
from core.deps import get_current_user, CurrentUser
from models.base import get_db
from models.user import User
from schemas.auth import (
    UserRegister,
    UserLogin,
    LoginResponse,
    UserResponse,
    ForgotPasswordRequest,
    ForgotPasswordResponse,
    ResetPasswordRequest,
)

router = APIRouter(prefix="/api/auth", tags=["auth"])


@router.post("/register", response_model=UserResponse)
def register(
    payload: UserRegister,
    db: Annotated[Session, Depends(get_db)],
) -> User:
    """Register a new user (citizen). Role is automatically 'User'."""
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
        role="User",  # Always 'User' for self-registration
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    return user


@router.post("/login", response_model=LoginResponse)
def login(
    payload: UserLogin,
    db: Annotated[Session, Depends(get_db)],
) -> LoginResponse:
    """Login with email/password. Returns JWT and user (including role) so frontend can redirect Admin vs User."""
    user = db.query(User).filter(User.email == payload.email.lower().strip()).first()
    if not user or not verify_password(payload.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password",
        )
    token = create_access_token(subject=user.id)
    role = (user.role or "User").strip()
    is_admin = role.lower() == "admin"
    user_payload = UserResponse(
        id=user.id,
        full_name=user.full_name,
        email=user.email,
        role=role,
        profile_image=user.profile_image,
    )
    return LoginResponse(
        access_token=token,
        token_type="bearer",
        expires_in_minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES,
        user=user_payload,
        is_admin=is_admin,
    )


def _user_to_response(user: User) -> UserResponse:
    return UserResponse(
        id=user.id,
        full_name=user.full_name,
        email=user.email,
        role=user.role or "User",
        profile_image=user.profile_image,
    )


@router.get("/me", response_model=UserResponse)
def me(current_user: CurrentUser) -> UserResponse:
    """Return current authenticated user (User or Admin). Explicit payload so role is always included."""
    return _user_to_response(current_user)


UPLOAD_DIR = Path(__file__).resolve().parent.parent / "uploads" / "avatars"
ALLOWED_IMAGE_EXTENSIONS = {".jpg", ".jpeg", ".png", ".gif", ".webp"}
MAX_IMAGE_SIZE = 5 * 1024 * 1024  # 5 MB


@router.patch("/me", response_model=UserResponse)
def update_me(
    current_user: CurrentUser,
    db: Annotated[Session, Depends(get_db)],
    full_name: str | None = Form(None),
    profile_image: UploadFile | None = File(None),
) -> UserResponse:
    """Update current user profile: full_name and/or profile image."""
    if full_name is not None and full_name.strip():
        current_user.full_name = full_name.strip()
    if profile_image is not None and profile_image.filename:
        ext = Path(profile_image.filename).suffix.lower()
        if ext not in ALLOWED_IMAGE_EXTENSIONS:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Allowed image types: JPG, PNG, GIF, WEBP",
            )
        content = profile_image.file.read()
        if len(content) > MAX_IMAGE_SIZE:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Image must be under 5 MB",
            )
        UPLOAD_DIR.mkdir(parents=True, exist_ok=True)
        safe_name = f"{current_user.id}_{uuid.uuid4().hex[:12]}{ext}"
        file_path = UPLOAD_DIR / safe_name
        with open(file_path, "wb") as f:
            f.write(content)
        rel_path = f"uploads/avatars/{safe_name}"
        if current_user.profile_image:
            old_path = Path(__file__).resolve().parent.parent / current_user.profile_image
            if old_path.exists():
                try:
                    old_path.unlink()
                except OSError:
                    pass
        current_user.profile_image = rel_path
    db.add(current_user)
    db.commit()
    db.refresh(current_user)
    return _user_to_response(current_user)


@router.post("/forgot-password", response_model=ForgotPasswordResponse)
def forgot_password(
    payload: ForgotPasswordRequest,
    db: Annotated[Session, Depends(get_db)],
) -> ForgotPasswordResponse:
    """Request a password reset. If the email exists, a reset token is created and an email with the link is sent (if SMTP configured). Same message either way (no email enumeration)."""
    user = db.query(User).filter(User.email == payload.email.lower().strip()).first()
    message = "If an account exists for this email, we've sent instructions to reset your password. Check your inbox."
    reset_token = None
    if user:
        reset_token = secrets.token_urlsafe(32)
        user.reset_token = reset_token
        user.reset_token_expires = datetime.now(timezone.utc) + timedelta(hours=1)
        db.add(user)
        db.commit()
        if settings.email_configured:
            reset_link = f"{settings.FRONTEND_URL}/reset-password?token={reset_token}"
            try:
                send_password_reset_email(user.email, reset_link)
            except Exception as e:
                import logging
                logging.getLogger(__name__).exception("Failed to send password reset email: %s", e)
    if settings.DEBUG and reset_token and not settings.email_configured:
        return ForgotPasswordResponse(message=message, reset_token=reset_token)
    return ForgotPasswordResponse(message=message)


@router.post("/reset-password")
def reset_password(
    payload: ResetPasswordRequest,
    db: Annotated[Session, Depends(get_db)],
) -> dict:
    """Reset password using the token from forgot-password. Token is single-use and expires in 1 hour."""
    user = (
        db.query(User)
        .filter(
            User.reset_token == payload.token,
            User.reset_token_expires.isnot(None),
            User.reset_token_expires > datetime.now(timezone.utc),
        )
        .first()
    )
    if not user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid or expired reset link. Please request a new one.",
        )
    user.hashed_password = hash_password(payload.new_password)
    user.reset_token = None
    user.reset_token_expires = None
    db.add(user)
    db.commit()
    return {"message": "Password has been reset. You can sign in with your new password."}
