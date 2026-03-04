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


def send_otp_email(to_email: str, code: str, purpose: str = "register") -> None:
    """
    Send an email with a 6-digit OTP.
    purpose: "register" | "login" | "reset_password"
    """
    app_name = settings.APP_NAME
    if purpose == "login":
        subject = f"{app_name} – Your login code"
        intro = f"Use this code to log in to your {app_name} account:"
    elif purpose == "reset_password":
        subject = f"{app_name} – Password reset code"
        intro = f"Use this code to reset your {app_name} password:"
    else:
        subject = f"{app_name} – Verify your email"
        intro = f"Your verification code for {app_name} is:"
    html_body = f"""
    <p>{intro}</p>
    <p style="font-size: 24px; font-weight: bold; letter-spacing: 4px;">{code}</p>
    <p>This code expires in 15 minutes. If you didn't request this, you can ignore this email.</p>
    <p>— {app_name}</p>
    """
    text_body = f"""
    {intro}
    {code}
    This code expires in 15 minutes. If you didn't request this, you can ignore this email.
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
