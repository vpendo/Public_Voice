"""
Quick script to check SMS credentials and test connection.
Run: python -m scripts.check_sms_credentials
"""
import os
import sys

sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from dotenv import load_dotenv
load_dotenv()

from core.config import settings

print("=" * 60)
print("SMS Credentials Check")
print("=" * 60)
print(f"\nUsername: {settings.AFRICAS_TALKING_USERNAME or '[NOT SET]'}")
if settings.AFRICAS_TALKING_API_KEY:
    masked = settings.AFRICAS_TALKING_API_KEY[:8] + "..." + settings.AFRICAS_TALKING_API_KEY[-4:]
    print(f"API Key: {masked}")
else:
    print("API Key: [NOT SET]")

print(f"\nSMS Configured: {settings.sms_configured}")

if settings.AFRICAS_TALKING_USERNAME and settings.AFRICAS_TALKING_API_KEY:
    print("\n" + "=" * 60)
    print("Troubleshooting 'Invalid Authentication' Error:")
    print("=" * 60)
    print("\n1. Check your Africa's Talking Dashboard:")
    print("   - Go to https://account.africastalking.com")
    print("   - Login to your account")
    print("   - Go to Settings -> API")
    print("\n2. For SANDBOX (Testing):")
    print("   - Username should be: sandbox")
    print("   - Get Sandbox API Key from dashboard")
    print("   - Update .env:")
    print("     AFRICAS_TALKING_USERNAME=sandbox")
    print("     AFRICAS_TALKING_API_KEY=your_sandbox_key")
    print("\n3. For PRODUCTION:")
    print("   - Username should match your account username (usually lowercase)")
    print("   - Get Production API Key from dashboard")
    print("   - Make sure username matches the API key")
    print("\n4. Common Issues:")
    print("   - Username case matters (usually lowercase)")
    print("   - API key must match the username (sandbox key for sandbox, production for production)")
    print("   - Make sure you restarted backend after updating .env")
    print("\n5. Current username 'PublicVoice' might be wrong.")
    print("   - Try using 'sandbox' for testing")
    print("   - Or check your dashboard for the correct username")

print("\n" + "=" * 60)
