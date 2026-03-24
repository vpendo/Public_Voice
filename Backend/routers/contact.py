"""Public contact form: POST forwards message to CONTACT_INBOX_EMAIL via SMTP."""
import logging

from fastapi import APIRouter, HTTPException, status
from pydantic import BaseModel, EmailStr, Field

from core.config import settings
from core.email import send_contact_form_email

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/api/contact", tags=["contact"])


class ContactBody(BaseModel):
    name: str = Field(..., min_length=1, max_length=200)
    email: EmailStr
    message: str = Field(..., min_length=3, max_length=10_000)


@router.post("", status_code=status.HTTP_200_OK)
def submit_contact(payload: ContactBody) -> dict:
    if not settings.email_configured:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="Email is not configured on the server. Please write to publicvoicerwanda@gmail.com directly.",
        )
    try:
        send_contact_form_email(
            sender_name=payload.name.strip(),
            sender_email=str(payload.email).strip(),
            message=payload.message.strip(),
        )
    except Exception:
        logger.exception("Failed to send contact form email")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Could not send your message. Please try again later or email publicvoicerwanda@gmail.com.",
        )
    return {"ok": True}
