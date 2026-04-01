"""
Quick SMTP credential verification script.
Run this to test if your email/password work with Dynadot.
"""
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from dotenv import load_dotenv
import os

# Load .env
load_dotenv()

# Get email config
SMTP_HOST = os.getenv("EMAIL_SMTP_SERVER", "").strip() or os.getenv("SMTP_HOST", "").strip()
SMTP_PORT = int(os.getenv("EMAIL_SMTP_PORT", "587") or 587)
SMTP_USER = os.getenv("EMAIL_LOGIN", "").strip() or os.getenv("SMTP_USER", "").strip()
SMTP_PASSWORD = os.getenv("EMAIL_SENDER_PASSWORD", "").strip().replace(" ", "") or os.getenv("SMTP_PASSWORD", "").strip()
SMTP_FROM_EMAIL = os.getenv("EMAIL_SENDER_EMAIL", "").strip() or SMTP_USER
SMTP_USE_TLS = os.getenv("SMTP_USE_TLS", "true").lower() in ("true", "1", "yes")

print("=" * 60)
print("SMTP CREDENTIAL TEST")
print("=" * 60)
print(f"SMTP Host: {SMTP_HOST}")
print(f"SMTP Port: {SMTP_PORT}")
print(f"SMTP User: {SMTP_USER}")
print(f"SMTP From Email: {SMTP_FROM_EMAIL}")
print(f"Use TLS: {SMTP_USE_TLS}")
print(f"Password: {'✓ SET' if SMTP_PASSWORD else '✗ NOT SET'}")
print("=" * 60)

# Check if all required fields are set
if not all([SMTP_HOST, SMTP_USER, SMTP_PASSWORD]):
    print("\n❌ ERROR: Missing required SMTP configuration")
    print(f"   Missing: {', '.join([k for k, v in [('SMTP_HOST', SMTP_HOST), ('SMTP_USER', SMTP_USER), ('SMTP_PASSWORD', SMTP_PASSWORD)] if not v])}")
    exit(1)

print("\n🔄 Testing SMTP connection...")
try:
    with smtplib.SMTP(SMTP_HOST, SMTP_PORT, timeout=10) as server:
        print("   ✓ Connected to SMTP server")
        
        if SMTP_USE_TLS:
            server.starttls()
            print("   ✓ TLS enabled")
        
        # Try to login
        server.login(SMTP_USER, SMTP_PASSWORD)
        print("   ✓ Login successful!")
        
        # Try to send a test email
        print("\n🔄 Sending test email...")
        msg = MIMEMultipart("alternative")
        msg["Subject"] = "SMTP Test from PublicVoice"
        msg["From"] = SMTP_FROM_EMAIL
        msg["To"] = SMTP_USER  # Send to self for testing
        
        text_body = "This is a test email from PublicVoice SMTP configuration."
        html_body = "<p>This is a test email from <b>PublicVoice</b> SMTP configuration.</p>"
        
        msg.attach(MIMEText(text_body, "plain"))
        msg.attach(MIMEText(html_body, "html"))
        
        server.sendmail(SMTP_FROM_EMAIL, [SMTP_USER], msg.as_string())
        print("   ✓ Test email sent!")
        
        print("\n" + "=" * 60)
        print("✅ SUCCESS: All SMTP tests passed!")
        print("=" * 60)
        print(f"A test email was sent to {SMTP_USER}")
        print("Check your inbox to confirm SMTP is working.\n")

except smtplib.SMTPAuthenticationError as e:
    print(f"\n❌ AUTHENTICATION FAILED: {e}")
    print("   → Check your EMAIL_LOGIN and EMAIL_SENDER_PASSWORD")
    print("   → Make sure password has no extra spaces")
    exit(1)

except smtplib.SMTPException as e:
    print(f"\n❌ SMTP ERROR: {e}")
    print("   → Verify SMTP_HOST and SMTP_PORT are correct")
    print("   → Check firewall/network settings")
    exit(1)

except Exception as e:
    print(f"\n❌ ERROR: {e}")
    exit(1)
