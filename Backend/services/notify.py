"""
Optional email notification when a new report is submitted. Uses SMTP from core.config.
"""
import logging
from typing import TYPE_CHECKING

from core.config import settings

if TYPE_CHECKING:
    from models.report import Report

logger = logging.getLogger(__name__)


def send_new_report_notification(report: "Report") -> None:
    """
    If ADMIN_NOTIFY_EMAILS and SMTP are configured, send a short email to admins
    about the new report (tracking_id, category, urgency). Otherwise no-op.
    """
    if not settings.email_configured:
        logger.debug("Email not configured; skipping new-report notification.")
        return
    emails = [e.strip() for e in settings.ADMIN_NOTIFY_EMAILS.split(",") if e.strip()]
    if not emails:
        logger.debug("ADMIN_NOTIFY_EMAILS empty; skipping new-report notification.")
        return

    subject = f"[PublicVoice] New report: {report.tracking_id or report.id}"
    body = (
        f"A new community report has been submitted.\n\n"
        f"Tracking ID: {report.tracking_id or report.id}\n"
        f"Category: {report.category or '—'}\n"
        f"Urgency: {report.urgency or 'medium'}\n"
        f"Description (excerpt): {(report.raw_description or '')[:200]}...\n\n"
        f"Log in to the admin dashboard to view and respond."
    )
    try:
        import smtplib
        from email.mime.text import MIMEText
        from email.mime.multipart import MIMEMultipart

        msg = MIMEMultipart()
        msg["Subject"] = subject
        msg["From"] = settings.SMTP_FROM_EMAIL
        msg.attach(MIMEText(body, "plain"))

        with smtplib.SMTP(settings.SMTP_HOST, settings.SMTP_PORT) as server:
            if settings.SMTP_USE_TLS:
                server.starttls()
            if settings.SMTP_USER and settings.SMTP_PASSWORD:
                server.login(settings.SMTP_USER, settings.SMTP_PASSWORD)
            for to in emails:
                server.sendmail(settings.SMTP_FROM_EMAIL, to, msg.as_string())
        logger.info("New-report notification sent to %d admin(s).", len(emails))
    except Exception as e:
        logger.warning("Failed to send new-report notification: %s", e)
