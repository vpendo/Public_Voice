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


def _utc_now_comparable_with(dt: datetime | None):
    """Return current UTC time in the same tz awareness as dt (naive for SQLite, aware for PostgreSQL)."""
    now_utc = datetime.now(timezone.utc)
    if dt is not None and getattr(dt, "tzinfo", None) is not None:
        return now_utc
    return now_utc.replace(tzinfo=None)
from typing import Annotated

from fastapi import APIRouter, Depends, File, Form, HTTPException, UploadFile, status
from sqlalchemy.orm import Session

from core.config import settings
from core.security import hash_password, verify_password, create_access_token
from core.email import send_otp_email
from core.deps import get_current_user, CurrentUser
from models.base import get_db
from models.user import User
from models.otp import OTP
from schemas.auth import (
    UserRegister,
    UserLogin,
    LoginResponse,
    LoginRequiresOtpResponse,
    LoginVerifyOtpRequest,
    UserResponse,
    RegisterResponse,
    VerifyEmailRequest,
    ResendOtpRequest,
    ForgotPasswordRequest,
    ForgotPasswordResponse,
    ResetPasswordRequest,
)

router = APIRouter(prefix="/api/auth", tags=["auth"])


OTP_EXPIRE_MINUTES = 15


def _generate_otp_code() -> str:
    return "".join(secrets.choice("0123456789") for _ in range(6))


@router.post("/register", response_model=RegisterResponse)
def register(
    payload: UserRegister,
    db: Annotated[Session, Depends(get_db)],
) -> RegisterResponse:
    """Register a new user (citizen). Sends OTP to email for verification. Role is automatically 'User'."""
    email = payload.email.lower().strip()
    existing = db.query(User).filter(User.email == email).first()
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered",
        )
    user = User(
        full_name=payload.full_name.strip(),
        email=email,
        hashed_password=hash_password(payload.password),
        role="User",
        email_verified=False,
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    code = _generate_otp_code()
    expires_at = datetime.now(timezone.utc) + timedelta(minutes=OTP_EXPIRE_MINUTES)
    otp_row = OTP(email=email, code=code, purpose="register", expires_at=expires_at)
    db.add(otp_row)
    db.commit()
    if settings.email_configured:
        try:
            send_otp_email(email, code, purpose="register")
        except Exception as e:
            import logging
            logging.getLogger(__name__).exception("Failed to send OTP email: %s", e)
    if settings.DEBUG:
        import logging
        logging.getLogger(__name__).info("DEBUG: Registration OTP for %s is: %s", email, code)
    return RegisterResponse(
        message="Check your email for the verification code.",
        email=email,
        dev_otp=code if settings.DEBUG else None,
    )


def _build_login_response(user: User) -> LoginResponse:
    token = create_access_token(subject=user.id)
    role = (user.role or "User").strip()
    is_admin = role.lower() == "admin"
    user_payload = UserResponse(
        id=user.id,
        full_name=user.full_name,
        email=user.email,
        role=role,
        email_verified=getattr(user, "email_verified", True),
        admin_category=getattr(user, "admin_category", None),
        admin_scope_level=getattr(user, "admin_scope_level", None),
        scope_district=getattr(user, "scope_district", None),
        scope_sector=getattr(user, "scope_sector", None),
        scope_cell=getattr(user, "scope_cell", None),
        profile_image=user.profile_image,
    )
    return LoginResponse(
        access_token=token,
        token_type="bearer",
        expires_in_minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES,
        user=user_payload,
        is_admin=is_admin,
    )


@router.post("/login")
def login(
    payload: UserLogin,
    db: Annotated[Session, Depends(get_db)],
) -> LoginResponse | LoginRequiresOtpResponse:
    """Login with email/password. Sends OTP for 2FA and returns requires_otp + email; frontend then calls /login/verify-otp with code. Rejects if email not verified."""
    user = db.query(User).filter(User.email == payload.email.lower().strip()).first()
    if not user or not verify_password(payload.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password",
        )
    if not getattr(user, "email_verified", True):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Email not verified. Check your inbox for the verification code.",
        )
    email = user.email
    code = _generate_otp_code()
    expires_at = datetime.now(timezone.utc) + timedelta(minutes=OTP_EXPIRE_MINUTES)
    db.query(OTP).filter(OTP.email == email, OTP.purpose == "login").delete()
    otp_row = OTP(email=email, code=code, purpose="login", expires_at=expires_at)
    db.add(otp_row)
    db.commit()
    if settings.email_configured:
        try:
            send_otp_email(email, code, purpose="login")
        except Exception as e:
            import logging
            logging.getLogger(__name__).exception("Failed to send login OTP: %s", e)
    if settings.DEBUG:
        import logging
        logging.getLogger(__name__).info("DEBUG: Login OTP for %s is: %s", email, code)
    return LoginRequiresOtpResponse(
        requires_otp=True,
        email=email,
        dev_otp=code if settings.DEBUG else None,
    )


@router.post("/login/verify-otp", response_model=LoginResponse)
def login_verify_otp(
    payload: LoginVerifyOtpRequest,
    db: Annotated[Session, Depends(get_db)],
) -> LoginResponse:
    """Verify 2FA OTP sent to email and return JWT + user."""
    email = payload.email.lower().strip()
    code = payload.code.strip()
    otp_row = (
        db.query(OTP)
        .filter(OTP.email == email, OTP.purpose == "login", OTP.code == code)
        .order_by(OTP.created_at.desc())
        .first()
    )
    if not otp_row:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid or expired code.")
    if otp_row.expires_at < _utc_now_comparable_with(otp_row.expires_at):
        db.delete(otp_row)
        db.commit()
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Code expired. Sign in again and request a new code.")
    user = db.query(User).filter(User.email == email).first()
    if not user:
        db.delete(otp_row)
        db.commit()
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="User not found.")
    db.query(OTP).filter(OTP.email == email, OTP.purpose == "login").delete()
    db.commit()
    return _build_login_response(user)


@router.post("/verify-email")
def verify_email(
    payload: VerifyEmailRequest,
    db: Annotated[Session, Depends(get_db)],
) -> dict:
    """Verify email with the 6-digit OTP sent after registration."""
    email = payload.email.lower().strip()
    code = payload.code.strip()
    otp_row = (
        db.query(OTP)
        .filter(OTP.email == email, OTP.purpose == "register", OTP.code == code)
        .order_by(OTP.created_at.desc())
        .first()
    )
    if not otp_row:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid or expired code.")
    if otp_row.expires_at < _utc_now_comparable_with(otp_row.expires_at):
        db.delete(otp_row)
        db.commit()
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Code expired. Request a new one.")
    user = db.query(User).filter(User.email == email).first()
    if not user:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="User not found.")
    user.email_verified = True
    db.query(OTP).filter(OTP.email == email, OTP.purpose == "register").delete()
    db.commit()
    return {"message": "Email verified. You can now log in."}


@router.post("/resend-otp")
def resend_otp(
    payload: ResendOtpRequest,
    db: Annotated[Session, Depends(get_db)],
) -> dict:
    """Resend verification OTP to email."""
    email = payload.email.lower().strip()
    user = db.query(User).filter(User.email == email).first()
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="No account found for this email.")
    if getattr(user, "email_verified", True):
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Email already verified. You can log in.")
    code = _generate_otp_code()
    expires_at = datetime.now(timezone.utc) + timedelta(minutes=OTP_EXPIRE_MINUTES)
    db.query(OTP).filter(OTP.email == email, OTP.purpose == "register").delete()
    otp_row = OTP(email=email, code=code, purpose="register", expires_at=expires_at)
    db.add(otp_row)
    db.commit()
    if settings.email_configured:
        try:
            send_otp_email(email, code, purpose="register")
        except Exception as e:
            import logging
            logging.getLogger(__name__).exception("Failed to send OTP email: %s", e)
    if settings.DEBUG:
        import logging
        logging.getLogger(__name__).info("DEBUG: Resend OTP for %s is: %s", email, code)
    return {"message": "Verification code sent. Check your email."}


def _user_to_response(user: User) -> UserResponse:
    return UserResponse(
        id=user.id,
        full_name=user.full_name,
        email=user.email,
        role=user.role or "User",
        email_verified=getattr(user, "email_verified", True),
        admin_category=getattr(user, "admin_category", None),
        admin_scope_level=getattr(user, "admin_scope_level", None),
        scope_district=getattr(user, "scope_district", None),
        scope_sector=getattr(user, "scope_sector", None),
        scope_cell=getattr(user, "scope_cell", None),
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
    """Request a password reset. If the email exists, an OTP is sent to that email. User then uses the code on the reset-password page (with email + code + new password). Same message either way (no email enumeration)."""
    email = payload.email.lower().strip()
    message = "If an account exists for this email, we've sent a verification code to reset your password. Check your inbox."
    user = db.query(User).filter(User.email == email).first()
    if user:
        code = _generate_otp_code()
        expires_at = datetime.now(timezone.utc) + timedelta(minutes=OTP_EXPIRE_MINUTES)
        db.query(OTP).filter(OTP.email == email, OTP.purpose == "reset_password").delete()
        otp_row = OTP(email=email, code=code, purpose="reset_password", expires_at=expires_at)
        db.add(otp_row)
        db.commit()
        if settings.email_configured:
            try:
                send_otp_email(email, code, purpose="reset_password")
            except Exception as e:
                import logging
                logging.getLogger(__name__).exception("Failed to send reset OTP: %s", e)
        if settings.DEBUG:
            import logging
            logging.getLogger(__name__).info("DEBUG: Password reset OTP for %s is: %s", email, code)
    return ForgotPasswordResponse(message=message)


@router.post("/reset-password")
def reset_password(
    payload: ResetPasswordRequest,
    db: Annotated[Session, Depends(get_db)],
) -> dict:
    """Reset password using either (1) token from link or (2) email + OTP code. OTP is preferred (sent by forgot-password)."""
    user = None
    if payload.token and payload.token.strip():
        user = (
            db.query(User)
            .filter(
                User.reset_token == payload.token.strip(),
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
    else:
        email = (payload.email or "").lower().strip()
        code = (payload.code or "").strip()
        if not email or len(code) != 6:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Email and 6-digit code are required.",
            )
        otp_row = (
            db.query(OTP)
            .filter(OTP.email == email, OTP.purpose == "reset_password", OTP.code == code)
            .order_by(OTP.created_at.desc())
            .first()
        )
        if not otp_row:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid or expired code.")
        if otp_row.expires_at < _utc_now_comparable_with(otp_row.expires_at):
            db.delete(otp_row)
            db.commit()
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Code expired. Request a new one from the login page.")
        user = db.query(User).filter(User.email == email).first()
        if not user:
            db.delete(otp_row)
            db.commit()
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="User not found.")
        user.hashed_password = hash_password(payload.new_password)
        db.query(OTP).filter(OTP.email == email, OTP.purpose == "reset_password").delete()
    db.add(user)
    db.commit()
    return {"message": "Password has been reset. You can sign in with your new password."}
