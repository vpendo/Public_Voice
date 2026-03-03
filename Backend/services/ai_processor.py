"""
AI/NLP smart processing for citizen issue reports (cell-level).
Uses OpenAI SDK v2 (responses.create). Aligned with Report schema categories/institutions.
"""

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

# Problem types (subset used for AI suggestion; full set in schemas)
PROBLEM_TYPE_HINTS = {
    "service_delivery": ["delay_assistance", "no_response", "service_not_delivered", "other"],
    "land_property": ["boundary_conflict", "ownership_dispute", "inheritance", "registration_issue"],
    "infrastructure_utilities": ["water_shortage", "road_damage", "drainage", "electricity", "waste_management"],
    "social_community": ["gbv", "family_conflict", "child_protection", "community_dispute"],
    "administrative": ["not_followed_up", "poor_communication", "delayed_decision", "misconduct"],
}

SYSTEM_PROMPT = """You are a civic issue processing assistant for PublicVoice, used in Rwanda at Cell level (Ministry of Local Government decentralised governance).

Process citizen-submitted issue text that may be in Kinyarwanda or informal English. Output ONLY a single valid JSON object with these keys:
- structured_description: clear, formal summary in English (or keep original if already clear)
- suggested_title: short title (optional)
- suggested_category: one of service_delivery, land_property, infrastructure_utilities, social_community, administrative
- suggested_institution: one of cell_office, sector_office, district_authority, social_affairs_officer, land_bureau, other
- suggested_problem_type: optional, one of the problem types for the suggested category (e.g. water_shortage, road_damage for infrastructure_utilities)
- suggested_urgency: optional, one of low, medium, high, emergency

Use empty string "" for any key if not inferable. Do not add extra keys."""


def process_issue_text(
    raw_text: str,
    category: Optional[str] = None,
) -> Optional[dict[str, Any]]:
    """
    Process raw citizen text via AI. Returns structured dict for Report creation.
    If category is provided, AI can use it to suggest problem_type.
    """
    if not settings.OPENAI_API_KEY:
        logger.info("OPENAI_API_KEY not set — skipping AI processing.")
        return None

    try:
        return _call_openai(raw_text, category=category)
    except Exception as e:
        logger.error("AI processing failed: %s", str(e))
        return None


def _call_openai(raw_text: str, category: Optional[str] = None) -> Optional[dict[str, Any]]:
    from openai import OpenAI

    client = OpenAI(api_key=settings.OPENAI_API_KEY)
    model = settings.OPENAI_MODEL or "gpt-4o-mini"

    user_content = f"""
Process this citizen issue text and return ONLY the JSON object.
{f'User selected category: {category}. You may suggest problem_type from that category.' if category else ''}

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
        response_format={"type": "json_object"},
    )

    data = getattr(response, "output_parsed", None)
    if not data:
        logger.warning("AI returned empty or invalid output")
        return None

    logger.info("Raw AI response: %s", data)
    return _validate_and_normalize(data, category=category)


def _validate_and_normalize(
    data: dict[str, Any],
    category: Optional[str] = None,
) -> dict[str, Any]:
    result: dict[str, Any] = {}

    desc = (data.get("structured_description") or "").strip()
    if desc:
        result["structured_description"] = desc[:10000]

    title = (data.get("suggested_title") or "").strip()
    if title:
        result["suggested_title"] = title[:255]

    cat = (data.get("suggested_category") or "").strip().lower().replace(" ", "_")
    result["suggested_category"] = cat if cat in ALLOWED_CATEGORIES else (category if category in ALLOWED_CATEGORIES else None)

    inst = (data.get("suggested_institution") or "").strip().lower().replace(" ", "_")
    result["suggested_institution"] = inst if inst in ALLOWED_INSTITUTIONS else None

    ptype = (data.get("suggested_problem_type") or "").strip().lower().replace(" ", "_")
    if ptype:
        allowed_for_cat = PROBLEM_TYPE_HINTS.get(result.get("suggested_category") or category or "")
        if allowed_for_cat and ptype in allowed_for_cat:
            result["suggested_problem_type"] = ptype

    urgency = (data.get("suggested_urgency") or "").strip().lower()
    if urgency in ALLOWED_URGENCY:
        result["suggested_urgency"] = urgency

    return result
