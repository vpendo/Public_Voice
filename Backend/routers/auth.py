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
    """Return current UTC time in the same tz awareness as dt (for PostgreSQL)."""
    now_utc = datetime.now(timezone.utc)
    if dt is not None and getattr(dt, "tzinfo", None) is not None:
        return now_utc
    return now_utc.replace(tzinfo=None)
from typing import Annotated

from fastapi import APIRouter, Body, Depends, File, Form, HTTPException, UploadFile, status
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
    ResetPasswordResponse,
)

router = APIRouter(prefix="/api/auth", tags=["auth"])


OTP_EXPIRE_MINUTES = 15


def _generate_otp_code() -> str:
    return "".join(secrets.choice("0123456789") for _ in range(6))


def _get_user_by_email(db: Session, email: str) -> User | None:
    """Find user by email (lowercase)."""
    return db.query(User).filter(User.email == email.lower().strip()).first()


@router.post("/register", response_model=RegisterResponse)
def register(
    payload: UserRegister,
    db: Annotated[Session, Depends(get_db)],
) -> RegisterResponse:
    """Register a new user with name, email, and password. Sends OTP to email for verification. Role is 'User'."""
    import logging
    logger = logging.getLogger(__name__)
    try:
        email = payload.email.lower().strip()
        if db.query(User).filter(User.email == email).first():
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
        db.query(OTP).filter(OTP.email == email, OTP.purpose == "register").delete()
        otp_row = OTP(email=email, code=code, purpose="register", expires_at=expires_at)
        db.add(otp_row)
        db.commit()
        email_sent = False
        if settings.email_configured:
            try:
                send_otp_email(email, code, "register")
                email_sent = True
                logger.info("Registration OTP email sent to %s", email)
            except Exception as e:
                logger.exception("Failed to send registration OTP email to %s: %s", email, e)
        else:
            logger.warning("SMTP not configured: OTP not sent by email. Set SMTP_HOST, SMTP_USER, SMTP_PASSWORD in .env")
        if is_dev := (settings.ENVIRONMENT == "development" or settings.DEBUG):
            logger.info("DEBUG: Registration OTP for %s is: %s (email_sent=%s)", email, code, email_sent)
        message = "OTP sent to your email. Check your inbox and enter the code on the next screen."
        if not email_sent:
            message = "Email could not be sent (e.g. SMTP 535). Use the code below to verify."
        # When email fails, return OTP so user can still verify and use the app.
        return RegisterResponse(
            message=message,
            email=email,
            email_sent=email_sent,
            dev_otp=code if not email_sent else None,
        )
    except HTTPException:
        raise
    except Exception as e:
        logger.exception("Registration error: %s", str(e))
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Registration failed: {str(e)}",
        )


def _build_login_response(user: User) -> LoginResponse:
    token = create_access_token(subject=user.id)
    role = (user.role or "User").strip()
    is_admin = role.lower() in ("admin", "superadmin")
    user_payload = UserResponse(
        id=user.id,
        full_name=user.full_name,
        phone=getattr(user, "phone", None),
        national_id=getattr(user, "national_id", None),
        email=getattr(user, "email", None),
        role=role,
        phone_verified=getattr(user, "phone_verified", True),
        email_verified=getattr(user, "email_verified", False),
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
) -> LoginRequiresOtpResponse:
    """Login with email and password. Backend sends OTP to email; then call POST /api/auth/login/verify-otp with email and code. Forgot password? Use POST /api/auth/forgot-password then /api/auth/reset-password."""
    import logging
    logger = logging.getLogger(__name__)
    email = payload.email.lower().strip()
    user = _get_user_by_email(db, email)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="No account found with this email address",
        )
    if not user.hashed_password:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="This account has no password set. Use forgot-password to set one.",
        )
    if not verify_password(payload.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid password",
        )
    # Require email verification for regular users before they can complete login
    if (user.role or "User").strip().lower() in ("user",) and not getattr(user, "email_verified", False):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Email not verified. Please verify your email first (check your inbox for the code).",
        )
    code = _generate_otp_code()
    expires_at = datetime.now(timezone.utc) + timedelta(minutes=OTP_EXPIRE_MINUTES)
    db.query(OTP).filter(OTP.email == email, OTP.purpose == "login").delete()
    otp_row = OTP(email=email, code=code, purpose="login", expires_at=expires_at)
    db.add(otp_row)
    db.commit()
    email_sent = False
    if settings.email_configured:
        try:
            send_otp_email(email, code, "login")
            email_sent = True
            logger.info("Login OTP email sent to %s", email)
        except Exception as e:
            logger.exception("Failed to send login OTP email to %s: %s", email, e)
    include_dev_otp = settings.ALLOW_DEV_OTP_RESPONSE or settings.ENVIRONMENT == "development" or settings.DEBUG
    if include_dev_otp:
        logger.info("DEBUG: Login OTP for %s is: %s (email_sent=%s)", email, code, email_sent)
    # When explicitly enabled (demo mode), include fallback dev_otp if email fails.
    return LoginRequiresOtpResponse(
        requires_otp=True,
        email=email,
        dev_otp=code if (include_dev_otp and not email_sent) else None,
    )


@router.post("/login/verify-otp", response_model=LoginResponse)
def login_verify_otp(
    payload: LoginVerifyOtpRequest,
    db: Annotated[Session, Depends(get_db)],
) -> LoginResponse:
    """Verify OTP sent to email and return JWT + user."""
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
    user = _get_user_by_email(db, email)
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
    user = _get_user_by_email(db, email)
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
    import logging
    logger = logging.getLogger(__name__)
    email = payload.email.lower().strip()
    user = _get_user_by_email(db, email)
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="No account found for this email.")
    if getattr(user, "email_verified", False):
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Email already verified. You can log in.")
    code = _generate_otp_code()
    expires_at = datetime.now(timezone.utc) + timedelta(minutes=OTP_EXPIRE_MINUTES)
    db.query(OTP).filter(OTP.email == email, OTP.purpose == "register").delete()
    otp_row = OTP(email=email, code=code, purpose="register", expires_at=expires_at)
    db.add(otp_row)
    db.commit()
    email_sent = False
    if settings.email_configured:
        try:
            send_otp_email(email, code, "register")
            email_sent = True
            logger.info("Resend OTP email sent to %s", email)
        except Exception as e:
            logger.exception("Failed to resend OTP email to %s: %s", email, e)
    if settings.ENVIRONMENT == "development" or settings.DEBUG:
        logger.info("DEBUG: Resend OTP for %s is: %s (email_sent=%s)", email, code, email_sent)
    message = "Verification code sent to your email. Check your inbox." if email_sent else "Email could not be sent. Use the code below to verify."
    return {"message": message, "dev_otp": code if not email_sent else None}


def _user_to_response(user: User) -> UserResponse:
    return UserResponse(
        id=user.id,
        full_name=user.full_name,
        phone=getattr(user, "phone", None),
        national_id=getattr(user, "national_id", None),
        email=getattr(user, "email", None),
        role=user.role or "User",
        phone_verified=getattr(user, "phone_verified", True),
        email_verified=getattr(user, "email_verified", False),
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
    """Request a password reset (use from login page 'Forgot password?'). Sends 6-digit OTP to email. Then call POST /api/auth/reset-password with email, code, and new_password."""
    import logging
    logger = logging.getLogger(__name__)
    email = payload.email.lower().strip()
    message = "If an account exists for this email, we've sent a verification code to reset your password. Check your inbox."
    dev_otp = None
    user_found = False
    user = db.query(User).filter(User.email == email).first()
    if user:
        user_found = True
        code = _generate_otp_code()
        expires_at = datetime.now(timezone.utc) + timedelta(minutes=OTP_EXPIRE_MINUTES)
        db.query(OTP).filter(OTP.email == email, OTP.purpose == "reset_password").delete()
        otp_row = OTP(email=email, code=code, purpose="reset_password", expires_at=expires_at)
        db.add(otp_row)
        db.commit()
        email_sent = False
        if settings.email_configured:
            try:
                send_otp_email(email, code, purpose="reset_password")
                email_sent = True
            except Exception as e:
                logger.exception("Failed to send reset OTP email: %s", e)
        is_dev = settings.ENVIRONMENT == "development" or settings.DEBUG
        if is_dev or not email_sent:
            dev_otp = code
        if is_dev:
            logger.info("DEBUG: Password reset OTP for %s is: %s", email, code)
    return ForgotPasswordResponse(message=message, email=email, user_found=user_found, dev_otp=dev_otp)


@router.post("/reset-password", response_model=ResetPasswordResponse)
def reset_password(
    payload: ResetPasswordRequest,
    db: Annotated[Session, Depends(get_db)],
) -> ResetPasswordResponse:
    """Reset password. Use email + code (from forgot-password) + new_password. Then sign in with POST /api/auth/login."""
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
    return ResetPasswordResponse()
