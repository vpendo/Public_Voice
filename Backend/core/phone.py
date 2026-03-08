"""
Phone number normalization for Rwanda (+250).
Ensures register and login use the same format so lookups succeed.
"""


def normalize_phone_rwanda(phone: str) -> str:
    """
    Normalize Rwanda phone to canonical form +250XXXXXXXXX (9 digits after +250).
    Accepts: 0782130814, 250782130814, +250782130814, 782130814.
    """
    if not phone or not isinstance(phone, str):
        return phone
    cleaned = phone.strip().replace(" ", "").replace("-", "")
    if not cleaned:
        return phone
    # Already +250 and digits only
    if cleaned.startswith("+250") and len(cleaned) == 13 and cleaned[4:].isdigit():
        return cleaned
    # 250... (no +)
    if cleaned.startswith("250") and len(cleaned) == 12 and cleaned[3:].isdigit():
        return "+" + cleaned
    # 0... (local format)
    if cleaned.startswith("0") and len(cleaned) == 10 and cleaned[1:].isdigit():
        return "+250" + cleaned[1:]
    # 9 digits only (no 0 prefix)
    if len(cleaned) == 9 and cleaned.isdigit():
        return "+250" + cleaned
    # Fallback: return cleaned so we don't break other formats
    return cleaned
