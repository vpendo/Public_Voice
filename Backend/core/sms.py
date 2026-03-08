"""
SMS service for sending OTP codes to phone numbers.
Supports Twilio and Africa's Talking.
"""
import logging
import warnings
from typing import Optional

from core.config import settings

logger = logging.getLogger(__name__)

# Suppress urllib3 SSL warnings when SSL verification is disabled (development only)
warnings.filterwarnings('ignore', message='Unverified HTTPS request')


def send_otp_sms(phone: str, code: str, purpose: str = "register") -> bool:
    """
    Send OTP code via SMS to phone number.
    Returns True if sent successfully, False otherwise.
    
    Args:
        phone: Phone number (e.g., "+250788123456")
        code: 6-digit OTP code
        purpose: "register" | "login" | "reset_password"
    """
    if not phone or not code:
        logger.warning("Cannot send SMS: phone or code is empty")
        return False

    # Format phone number (ensure it starts with +)
    formatted_phone = phone.strip()
    if not formatted_phone.startswith("+"):
        # Assume Rwanda number if no country code
        if formatted_phone.startswith("0"):
            formatted_phone = "+250" + formatted_phone[1:]
        else:
            formatted_phone = "+250" + formatted_phone

    # Determine message based on purpose
    app_name = settings.APP_NAME
    if purpose == "login":
        message = f"Your {app_name} login code is: {code}. Valid for 15 minutes."
    elif purpose == "reset_password":
        message = f"Your {app_name} password reset code is: {code}. Valid for 15 minutes."
    else:  # register
        message = f"Your {app_name} verification code is: {code}. Valid for 15 minutes."

    # Try Twilio first if configured
    if settings.TWILIO_ACCOUNT_SID and settings.TWILIO_AUTH_TOKEN:
        try:
            return _send_via_twilio(formatted_phone, message)
        except Exception as e:
            logger.error("Twilio SMS failed: %s", e)
            # Fall through to next provider

    # Try Africa's Talking if configured
    if settings.AFRICAS_TALKING_API_KEY and settings.AFRICAS_TALKING_USERNAME:
        try:
            return _send_via_africas_talking(formatted_phone, message)
        except Exception as e:
            logger.error("Africa's Talking SMS failed: %s", e)
            # Fall through

    # If no SMS provider configured, log and return False
    logger.warning(
        "No SMS provider configured. OTP code for %s is: %s (not sent via SMS)",
        formatted_phone,
        code,
    )
    return False


def _send_via_twilio(phone: str, message: str) -> bool:
    """Send SMS via Twilio."""
    try:
        from twilio.rest import Client

        client = Client(settings.TWILIO_ACCOUNT_SID, settings.TWILIO_AUTH_TOKEN)
        from_number = settings.TWILIO_PHONE_NUMBER or settings.TWILIO_FROM_NUMBER
        
        if not from_number:
            logger.error("Twilio phone number not configured (TWILIO_PHONE_NUMBER or TWILIO_FROM_NUMBER)")
            return False

        message_obj = client.messages.create(
            body=message,
            from_=from_number,
            to=phone,
        )
        logger.info("SMS sent via Twilio to %s (SID: %s)", phone, message_obj.sid)
        return True
    except ImportError:
        logger.error("twilio package not installed. Install with: pip install twilio")
        return False
    except Exception as e:
        logger.error("Twilio SMS error: %s", e)
        raise


def _send_via_africas_talking(phone: str, message: str) -> bool:
    """Send SMS via Africa's Talking using direct HTTP API (bypasses SDK SSL issues)."""
    try:
        import requests
        import base64

        username = settings.AFRICAS_TALKING_USERNAME
        api_key = settings.AFRICAS_TALKING_API_KEY
        
        # Validate credentials are present
        if not username or not api_key:
            logger.error("Africa's Talking credentials missing. Check AFRICAS_TALKING_USERNAME and AFRICAS_TALKING_API_KEY in .env")
            return False

        # Determine API endpoint (sandbox vs production)
        if username.lower() == "sandbox":
            api_url = "https://api.sandbox.africastalking.com/version1/messaging"
        else:
            api_url = "https://api.africastalking.com/version1/messaging"

        # Prepare authentication header
        auth_string = f"{username}:{api_key}"
        auth_bytes = auth_string.encode('ascii')
        auth_b64 = base64.b64encode(auth_bytes).decode('ascii')

        # Prepare request data
        headers = {
            "Accept": "application/json",
            "Content-Type": "application/x-www-form-urlencoded",
            "apiKey": api_key,
        }

        data = {
            "username": username,
            "to": phone,
            "message": message,
        }

        # Send SMS via direct HTTP request
        try:
            response = requests.post(
                api_url,
                headers=headers,
                data=data,
                timeout=30,
                verify=True  # SSL verification
            )
            
            if response.status_code == 201:
                result = response.json()
                recipients = result.get("SMSMessageData", {}).get("Recipients", [])
                
                if recipients:
                    status = recipients[0].get("status", "Unknown")
                    if status == "Success" or status == "Sent":
                        logger.info("SMS sent via Africa's Talking to %s", phone)
                        return True
                    else:
                        error_msg = recipients[0].get("message", "Unknown error")
                        status_code = recipients[0].get("statusCode", "Unknown")
                        logger.error("Africa's Talking SMS failed: Status=%s, Code=%s, Message=%s", status, status_code, error_msg)
                        return False
                else:
                    logger.error("Africa's Talking: No recipients in response. Full response: %s", result)
                    return False
            else:
                error_text = response.text
                logger.error("Africa's Talking HTTP error %d: %s", response.status_code, error_text)
                return False
                
        except requests.exceptions.SSLError as ssl_error:
            error_msg = str(ssl_error)
            logger.error(
                "Africa's Talking SSL error. This might be due to:\n"
                "  1. Network/firewall blocking the connection\n"
                "  2. Proxy settings interfering\n"
                "  3. SSL/TLS version mismatch\n"
                "  Try: Check your internet connection, disable VPN/proxy if active\n"
                "  Error: %s", error_msg
            )
            # Try with SSL verification disabled as fallback (not recommended for production)
            try:
                logger.info("Retrying with SSL verification disabled (development only)...")
                # Suppress urllib3 warning for this request
                with warnings.catch_warnings():
                    warnings.filterwarnings('ignore', message='Unverified HTTPS request')
                    response = requests.post(
                        api_url,
                        headers=headers,
                        data=data,
                        timeout=30,
                        verify=False  # Disable SSL verification (development only)
                    )
                logger.debug("Retry response status: %d, body: %s", response.status_code, response.text[:200])
                if response.status_code == 201:
                    result = response.json()
                    recipients = result.get("SMSMessageData", {}).get("Recipients", [])
                    if recipients:
                        status = recipients[0].get("status", "Unknown")
                        if status == "Success" or status == "Sent":
                            logger.info("SMS sent via Africa's Talking to %s", phone)
                            return True
                        else:
                            error_msg = recipients[0].get("message", "Unknown error")
                            logger.warning("SMS retry returned status %s: %s", status, error_msg)
                    else:
                        logger.warning("SMS retry: No recipients in response. Full: %s", result)
                else:
                    logger.warning("SMS retry failed with status %d: %s", response.status_code, response.text[:200])
            except Exception as retry_error:
                logger.error("Retry also failed: %s", retry_error)
            return False
        except requests.exceptions.RequestException as req_error:
            error_msg = str(req_error)
            if "authentication" in error_msg.lower() or "invalid" in error_msg.lower() or "401" in error_msg or "403" in error_msg:
                logger.error(
                    "Africa's Talking authentication failed. Please check:\n"
                    "  1. Username is correct (use 'sandbox' for testing)\n"
                    "  2. API key is correct and matches your username\n"
                    "  3. Credentials are in your .env file\n"
                    "  4. You've restarted the backend after updating .env\n"
                    "Error: %s", error_msg
                )
            else:
                logger.error("Africa's Talking request error: %s", error_msg)
            return False
    except ImportError:
        logger.error("requests package not installed. Install with: pip install requests")
        return False
    except Exception as e:
        logger.error("Africa's Talking SMS error: %s", e)
        return False  # Don't raise, just return False
