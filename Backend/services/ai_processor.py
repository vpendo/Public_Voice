"""
AI/NLP smart processing for citizen issue reports (cell-level).
Uses OpenAI Chat Completions API. Aligned with Report schema categories/institutions.
"""

import json
import logging
from typing import Any, Optional

from core.config import settings

logger = logging.getLogger(__name__)

# —— Must match schemas/report.py (cell-level) ——
ALLOWED_CATEGORIES = {
    "service_delivery",
    "land_property",
    "infrastructure_utilities",
    "social_community",
    "administrative",
}

ALLOWED_INSTITUTIONS = {
    "cell_office",
    "sector_office",
    "district_authority",
    "social_affairs_officer",
    "land_bureau",
    "other",
}

ALLOWED_URGENCY = {"low", "medium", "high", "emergency"}

PROBLEM_TYPE_HINTS = {
    "service_delivery": ["delay_assistance", "no_response", "service_not_delivered", "other"],
    "land_property": ["boundary_conflict", "ownership_dispute", "inheritance", "registration_issue"],
    "infrastructure_utilities": ["water_shortage", "road_damage", "drainage", "electricity", "waste_management"],
    "social_community": ["gbv", "family_conflict", "child_protection", "community_dispute"],
    "administrative": ["not_followed_up", "poor_communication", "delayed_decision", "misconduct"],
}

SYSTEM_PROMPT = """You are a civic issue processing assistant for PublicVoice, used in Rwanda at Cell level.

Process citizen-submitted issue text that may be in Kinyarwanda or informal English.
Return ONLY a single valid JSON object with these keys:

- structured_description
- suggested_title
- suggested_category
- suggested_institution
- suggested_problem_type
- suggested_urgency

Use empty string "" for keys that cannot be inferred.
Do not add extra keys.
"""


def process_issue_text(
    raw_text: str,
    category: Optional[str] = None,
) -> Optional[dict[str, Any]]:
    """
    Process raw citizen text via AI.
    Returns structured dict for Report creation.
    """
    if not settings.OPENAI_API_KEY:
        logger.info("OPENAI_API_KEY not set — skipping AI processing.")
        return None

    try:
        return _call_openai(raw_text, category=category)
    except Exception as e:
        logger.exception("AI processing failed: %s", e)
        return None


def _call_openai(
    raw_text: str,
    category: Optional[str] = None,
) -> Optional[dict[str, Any]]:
    from openai import OpenAI

    client_kwargs: dict[str, Any] = {
        "api_key": settings.OPENAI_API_KEY,
        "timeout": 30.0,
    }
    if getattr(settings, "OPENAI_API_BASE", None) and str(settings.OPENAI_API_BASE).strip():
        client_kwargs["base_url"] = settings.OPENAI_API_BASE.strip()
    client = OpenAI(**client_kwargs)

    model = settings.OPENAI_MODEL or "gpt-4o-mini"

    user_content = f"""
Process this citizen issue text and return ONLY the JSON object.
{f'User selected category: {category}. You may suggest problem_type from that category.' if category else ''}

---
{raw_text}
---
"""

    response = client.chat.completions.create(
        model=model,
        messages=[
            {"role": "system", "content": SYSTEM_PROMPT},
            {"role": "user", "content": user_content},
        ],
        temperature=0.2,
        max_tokens=1000,
        response_format={"type": "json_object"},
    )

    if not response.choices:
        logger.warning("AI returned no choices")
        return None

    content = response.choices[0].message.content
    if not content:
        logger.warning("AI returned empty content")
        return None

    try:
        data = json.loads(content)
    except json.JSONDecodeError:
        logger.warning("AI response not valid JSON")
        return None

    if not isinstance(data, dict):
        logger.warning("AI response JSON not an object")
        return None

    logger.info("Raw AI response: %s", data)

    return _validate_and_normalize(data, category)


def _validate_and_normalize(
    data: dict[str, Any],
    category: Optional[str] = None,
) -> dict[str, Any]:
    result: dict[str, Any] = {}

    # Description
    desc = (data.get("structured_description") or "").strip()
    if desc:
        result["structured_description"] = desc[:10000]

    # Title
    title = (data.get("suggested_title") or "").strip()
    if title:
        result["suggested_title"] = title[:255]

    # Category
    cat = (data.get("suggested_category") or "").strip().lower().replace(" ", "_")
    if cat in ALLOWED_CATEGORIES:
        result["suggested_category"] = cat
    elif category in ALLOWED_CATEGORIES:
        result["suggested_category"] = category
    else:
        result["suggested_category"] = None

    # Institution
    inst = (data.get("suggested_institution") or "").strip().lower().replace(" ", "_")
    if inst in ALLOWED_INSTITUTIONS:
        result["suggested_institution"] = inst

    # Problem Type
    ptype = (data.get("suggested_problem_type") or "").strip().lower().replace(" ", "_")
    final_category = result.get("suggested_category") or category
    allowed_for_cat = PROBLEM_TYPE_HINTS.get(final_category or "")
    if ptype and allowed_for_cat and ptype in allowed_for_cat:
        result["suggested_problem_type"] = ptype

    # Urgency
    urgency = (data.get("suggested_urgency") or "").strip().lower()
    if urgency in ALLOWED_URGENCY:
        result["suggested_urgency"] = urgency

    return result