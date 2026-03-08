"""
Test SMS sending with Africa's Talking.
Run from Backend folder: python -m scripts.test_sms
"""
import os
import sys

sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from dotenv import load_dotenv
load_dotenv()

from core.config import settings
from core.sms import send_otp_sms


def main():
    print("=" * 60)
    print("SMS Configuration Test")
    print("=" * 60)
    
    # Check configuration
    print("\n1. Checking configuration...")
    print(f"   AFRICAS_TALKING_USERNAME: {'[OK] Set' if settings.AFRICAS_TALKING_USERNAME else '[NOT SET]'}")
    if settings.AFRICAS_TALKING_USERNAME:
        print(f"   Username value: {settings.AFRICAS_TALKING_USERNAME}")
    
    print(f"   AFRICAS_TALKING_API_KEY: {'[OK] Set' if settings.AFRICAS_TALKING_API_KEY else '[NOT SET]'}")
    if settings.AFRICAS_TALKING_API_KEY:
        masked_key = settings.AFRICAS_TALKING_API_KEY[:8] + "..." + settings.AFRICAS_TALKING_API_KEY[-4:] if len(settings.AFRICAS_TALKING_API_KEY) > 12 else "***"
        print(f"   API Key (masked): {masked_key}")
    
    print(f"   SMS Configured: {'[OK] Yes' if settings.sms_configured else '[NOT CONFIGURED] No'}")
    
    if not settings.sms_configured:
        print("\n[ERROR] SMS is not configured!")
        print("\nTo configure Africa's Talking:")
        print("1. Sign up at https://africastalking.com")
        print("2. Get your username and API key from the dashboard")
        print("3. Add to your .env file:")
        print("   AFRICAS_TALKING_USERNAME=your_username")
        print("   AFRICAS_TALKING_API_KEY=your_api_key")
        print("4. Restart the backend")
        return
    
    # Test SMS sending
    print("\n2. Testing SMS sending...")
    print("   Enter a phone number to test (e.g., +250788123456 or 0788123456):")
    test_phone = input("   Phone: ").strip()
    
    if not test_phone:
        print("   No phone number provided. Exiting.")
        return
    
    test_code = "123456"
    print(f"\n   Sending test OTP code '{test_code}' to {test_phone}...")
    
    result = send_otp_sms(test_phone, test_code, "register")
    
    if result:
        print("\n[SUCCESS] SMS sent successfully!")
        print(f"   Check your phone ({test_phone}) for the message.")
    else:
        print("\n[FAILED] SMS sending failed!")
        print("   Check the error messages above for details.")
        print("\n   Common issues:")
        print("   - Wrong username or API key")
        print("   - Sandbox mode: Make sure you're using 'sandbox' as username")
        print("   - Production: Make sure your account is activated")
        print("   - Phone number format: Should be +250788123456")
    
    print("\n" + "=" * 60)


if __name__ == "__main__":
    main()
