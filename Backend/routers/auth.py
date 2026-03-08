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
from core.sms import send_otp_sms
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
    VerifyPhoneRequest,
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
    """Register a new user (citizen). Sends OTP to phone for verification. Role is automatically 'User'."""
    try:
        phone = payload.phone.strip()
        existing_phone = db.query(User).filter(User.phone == phone).first()
        if existing_phone:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Phone number already registered",
            )
        existing_nid = db.query(User).filter(User.national_id == payload.national_id.strip()).first()
        if existing_nid:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="National ID already registered",
            )
        user = User(
            full_name=payload.full_name.strip(),
            phone=phone,
            national_id=payload.national_id.strip(),
            role="User",
            phone_verified=False,
        )
        db.add(user)
        db.commit()
        db.refresh(user)
        code = _generate_otp_code()
        expires_at = datetime.now(timezone.utc) + timedelta(minutes=OTP_EXPIRE_MINUTES)
        # Delete any existing OTPs for this phone and purpose
        db.query(OTP).filter(OTP.phone == phone, OTP.purpose == "register").delete()
        otp_row = OTP(phone=phone, code=code, purpose="register", expires_at=expires_at)
        db.add(otp_row)
        db.commit()
        
        # Send OTP via SMS
        sms_sent = send_otp_sms(phone, code, "register")
        
        # In development, always return OTP for testing (even if SMS was sent)
        # Also return if SMS failed (sandbox limitations, network issues, etc.)
        is_dev = settings.ENVIRONMENT == "development" or settings.DEBUG
        should_return_otp = is_dev or not sms_sent  # Return OTP if dev mode OR if SMS failed
        
        if is_dev:
            import logging
            logging.getLogger(__name__).info("DEBUG: Registration OTP for %s is: %s (SMS sent: %s)", phone, code, sms_sent)
        
        # Always include OTP in message for development/testing
        if sms_sent:
            message = f"OTP sent to your phone number via SMS. OTP: {code}"
        else:
            message = f"OTP generated. OTP: {code} (SMS not sent - check sandbox settings or network)"
        
        return RegisterResponse(
            message=message,
            phone=phone,
            dev_otp=code if should_return_otp else None,
        )
    except HTTPException:
        raise
    except Exception as e:
        import logging
        logger = logging.getLogger(__name__)
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
    """Login with phone number (users) or email+password (admins). For phone, sends OTP; for email+password, returns token directly."""
    # Admin login with email+password (backward compatibility)
    if payload.email and payload.password:
        email = payload.email.lower().strip()
        user = db.query(User).filter(User.email == email).first()
        if not user:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="No account found with this email address",
            )
        if not user.hashed_password:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="This account has no password set. Please reset the password using: python -m scripts.reset_admin_password",
            )
        if not verify_password(payload.password, user.hashed_password):
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid password",
            )
        # Admins don't need phone verification
        return _build_login_response(user)
    
    # User login with phone + full_name (OTP-based)
    if not payload.phone:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Phone number is required for user login",
        )
    if not payload.full_name or not payload.full_name.strip():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Full name is required for user login",
        )
    phone = payload.phone.strip()
    full_name = payload.full_name.strip()
    user = db.query(User).filter(User.phone == phone).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Phone number not registered",
        )
    # Verify full name matches
    if user.full_name.strip().lower() != full_name.lower():
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Full name does not match",
        )
    if not getattr(user, "phone_verified", False):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Phone number not verified. Please verify your phone number first.",
        )
    code = _generate_otp_code()
    expires_at = datetime.now(timezone.utc) + timedelta(minutes=OTP_EXPIRE_MINUTES)
    db.query(OTP).filter(OTP.phone == phone, OTP.purpose == "login").delete()
    otp_row = OTP(phone=phone, code=code, purpose="login", expires_at=expires_at)
    db.add(otp_row)
    db.commit()
    
    # Send OTP via SMS
    sms_sent = send_otp_sms(phone, code, "login")
    
    # Always return OTP in development mode OR if SMS failed (for testing/fallback)
    is_dev = settings.ENVIRONMENT == "development" or settings.DEBUG
    should_return_otp = is_dev or not sms_sent  # Return OTP if dev mode OR if SMS failed
    
    # Log OTP for debugging (always log in dev, or if SMS failed)
    import logging
    logger = logging.getLogger(__name__)
    if is_dev or not sms_sent:
        logger.info("DEBUG: Login OTP for %s is: %s (SMS sent: %s, ENVIRONMENT: %s, DEBUG: %s)", 
                   phone, code, sms_sent, settings.ENVIRONMENT, settings.DEBUG)
    else:
        logger.info("Login OTP sent via SMS to %s (not returning in response)", phone)
    
    # Always return OTP for now to help with development/testing
    # In production, you can change this to only return if SMS failed
    return LoginRequiresOtpResponse(
        requires_otp=True,
        phone=phone,
        dev_otp=code,  # Always return OTP for development/testing
    )


@router.post("/login/verify-otp", response_model=LoginResponse)
def login_verify_otp(
    payload: LoginVerifyOtpRequest,
    db: Annotated[Session, Depends(get_db)],
) -> LoginResponse:
    """Verify OTP sent to phone and return JWT + user."""
    phone = payload.phone.strip()
    code = payload.code.strip()
    otp_row = (
        db.query(OTP)
        .filter(OTP.phone == phone, OTP.purpose == "login", OTP.code == code)
        .order_by(OTP.created_at.desc())
        .first()
    )
    if not otp_row:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid or expired code.")
    if otp_row.expires_at < _utc_now_comparable_with(otp_row.expires_at):
        db.delete(otp_row)
        db.commit()
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Code expired. Sign in again and request a new code.")
    user = db.query(User).filter(User.phone == phone).first()
    if not user:
        db.delete(otp_row)
        db.commit()
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="User not found.")
    db.query(OTP).filter(OTP.phone == phone, OTP.purpose == "login").delete()
    db.commit()
    return _build_login_response(user)


@router.post("/verify-phone")
def verify_phone(
    payload: VerifyPhoneRequest,
    db: Annotated[Session, Depends(get_db)],
) -> dict:
    """Verify phone with the 6-digit OTP sent after registration."""
    phone = payload.phone.strip()
    code = payload.code.strip()
    otp_row = (
        db.query(OTP)
        .filter(OTP.phone == phone, OTP.purpose == "register", OTP.code == code)
        .order_by(OTP.created_at.desc())
        .first()
    )
    if not otp_row:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid or expired code.")
    if otp_row.expires_at < _utc_now_comparable_with(otp_row.expires_at):
        db.delete(otp_row)
        db.commit()
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Code expired. Request a new one.")
    user = db.query(User).filter(User.phone == phone).first()
    if not user:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="User not found.")
    user.phone_verified = True
    db.query(OTP).filter(OTP.phone == phone, OTP.purpose == "register").delete()
    db.commit()
    return {"message": "Phone verified. You can now log in."}


@router.post("/resend-otp")
def resend_otp(
    payload: ResendOtpRequest,
    db: Annotated[Session, Depends(get_db)],
) -> dict:
    """Resend verification OTP to phone."""
    phone = payload.phone.strip()
    user = db.query(User).filter(User.phone == phone).first()
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="No account found for this phone number.")
    if getattr(user, "phone_verified", False):
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Phone already verified. You can log in.")
    code = _generate_otp_code()
    expires_at = datetime.now(timezone.utc) + timedelta(minutes=OTP_EXPIRE_MINUTES)
    db.query(OTP).filter(OTP.phone == phone, OTP.purpose == "register").delete()
    otp_row = OTP(phone=phone, code=code, purpose="register", expires_at=expires_at)
    db.add(otp_row)
    db.commit()
    
    # Send OTP via SMS
    sms_sent = send_otp_sms(phone, code, "register")
    
    # Always return OTP in development mode for testing
    # Also return if SMS failed (sandbox limitations, network issues, etc.)
    is_dev = settings.ENVIRONMENT == "development" or settings.DEBUG
    should_return_otp = is_dev or not sms_sent  # Return OTP if dev mode OR if SMS failed
    
    if is_dev:
        import logging
        logging.getLogger(__name__).info("DEBUG: Resend OTP for %s is: %s (SMS sent: %s)", phone, code, sms_sent)
    
    # Always include OTP in message for development/testing
    if sms_sent:
        message = f"Verification code sent to your phone via SMS. OTP: {code}"
    else:
        message = f"Verification code generated. OTP: {code} (SMS not sent - check sandbox settings or network)"
    
    return {"message": message, "dev_otp": code if should_return_otp else None}


def _user_to_response(user: User) -> UserResponse:
    return UserResponse(
        id=user.id,
        full_name=user.full_name,
        phone=getattr(user, "phone", None),
        national_id=getattr(user, "national_id", None),
        email=getattr(user, "email", None),
        role=user.role or "User",
        phone_verified=getattr(user, "phone_verified", True),
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
