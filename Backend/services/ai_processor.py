"""
AI/NLP smart processing for citizen issue reports.
Uses OpenAI SDK v2 (responses.create).
"""

import logging
from typing import Any, Optional

from core.config import settings

logger = logging.getLogger(__name__)

# ---------------- Allowed categories and institutions ----------------
# Must match DB enums; prevents invalid entries
ALLOWED_CATEGORIES = {
    "roads", "water", "security", "sanitation",
    "electricity", "health", "education", "other",
}

ALLOWED_INSTITUTIONS = {
    "district", "sector", "cell", "village",
    "mininfra", "mineduc", "minisante", "localgov", "other",
}

# ---------------- System prompt ----------------
# Defines AI behavior and JSON output format
SYSTEM_PROMPT = """You are a civic issue processing assistant for PublicVoice, a platform used in Rwanda.

Your task is to process citizen-submitted issue text that may be:
- In Kinyarwanda
- In informal or mixed English
- Unstructured

Output ONLY a single valid JSON object with these keys:
- structured_description
- suggested_title
- suggested_category
- suggested_institution

Use empty string "" if not inferable.
"""

# ---------------- Public function ----------------
def process_issue_text(raw_text: str) -> Optional[dict[str, Any]]:
    """
    Processes raw citizen text via AI and returns a structured dict.

    Returns:
        dict with keys: structured_description, suggested_title,
        suggested_category, suggested_institution
        or None if API key missing or processing fails.
    """
    if not settings.OPENAI_API_KEY:
        logger.info("OPENAI_API_KEY not set — skipping AI processing.")
        return None

    try:
        return _call_openai(raw_text)
    except Exception as e:
        logger.error("AI processing failed: %s", str(e))
        return None

# ---------------- Internal call to OpenAI ----------------
def _call_openai(raw_text: str) -> Optional[dict[str, Any]]:
    """
    Calls OpenAI Responses API (v2) and returns structured output.

    ✅ Uses `output_parsed` to get dict directly.
    """
    from openai import OpenAI

    client = OpenAI(api_key=settings.OPENAI_API_KEY)
    model = settings.OPENAI_MODEL or "gpt-4o-mini"

    user_content = f"""
Process this citizen issue text and return ONLY the JSON object.

--- 
{raw_text}
---
"""

    response = client.responses.create(
        model=model,
        input=[
            {"role": "system", "content": SYSTEM_PROMPT},
            {"role": "user", "content": user_content},
        ],
        temperature=0.2,
        max_output_tokens=1024,
        response_format={"type": "json_object"},  # Ensures AI returns JSON
    )

    # Prefer output_parsed if available; fallback to None
    data = getattr(response, "output_parsed", None)
    if not data:
        logger.warning("AI returned empty or invalid output")
        return None

    # Optional: log AI response for debugging
    logger.info("Raw AI response: %s", data)

    return _validate_and_normalize(data)

# ---------------- Validation & normalization ----------------
def _validate_and_normalize(data: dict[str, Any]) -> dict[str, Any]:
    """
    Ensures category and institution are valid and trims text
    to fit DB storage limits.
    """
    result: dict[str, Any] = {}

    desc = (data.get("structured_description") or "").strip()
    if desc:
        result["structured_description"] = desc[:10000]  # DB limit

    title = (data.get("suggested_title") or "").strip()
    if title:
        result["suggested_title"] = title[:255]

    cat = (data.get("suggested_category") or "").strip().lower()
    result["suggested_category"] = cat if cat in ALLOWED_CATEGORIES else None

    inst = (data.get("suggested_institution") or "").strip().lower()
    result["suggested_institution"] = inst if inst in ALLOWED_INSTITUTIONS else None

    return result