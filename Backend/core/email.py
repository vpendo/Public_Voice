"""
Send emails (e.g. password reset link) via SMTP.
Uses Python standard library only; no extra dependencies.
"""
import smtplib
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText

from core.config import settings


def send_password_reset_email(to_email: str, reset_link: str) -> None:
    """
    Send an email with the password reset link.
    Raises on failure; caller should catch and log or return generic message.
    """
    app_name = settings.APP_NAME
    subject = f"{app_name} – Reset your password"
    html_body = f"""
    <p>You requested a password reset for your {app_name} account.</p>
    <p>Click the link below to set a new password (valid for 1 hour):</p>
    <p><a href="{reset_link}" style="color: #004C97;">{reset_link}</a></p>
    <p>If you didn't request this, you can ignore this email.</p>
    <p>— {app_name}</p>
    """
    text_body = f"""
    You requested a password reset for your {app_name} account.
    Open this link in your browser to set a new password (valid for 1 hour):
    {reset_link}
    If you didn't request this, you can ignore this email.
    — {app_name}
    """

    msg = MIMEMultipart("alternative")
    msg["Subject"] = subject
    msg["From"] = settings.SMTP_FROM_EMAIL
    msg["To"] = to_email
    msg.attach(MIMEText(text_body.strip(), "plain"))
    msg.attach(MIMEText(html_body.strip(), "html"))

    use_tls = settings.SMTP_USE_TLS
    port = settings.SMTP_PORT
    with smtplib.SMTP(settings.SMTP_HOST, port) as server:
        if use_tls:
            server.starttls()
        server.login(settings.SMTP_USER, settings.SMTP_PASSWORD)
        server.sendmail(settings.SMTP_FROM_EMAIL, [to_email], msg.as_string())
