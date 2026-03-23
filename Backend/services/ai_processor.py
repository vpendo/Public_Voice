"""
AI/NLP smart processing for citizen issue reports (cell-level).
Uses Claude API for translation and lightweight structuring.
"""

import json
import logging
import os
import re
from typing import Any, Optional
import httpx

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

SYSTEM_PROMPT = """You are a report translator for PublicVoice in Rwanda.

Your job:
1. If text is in Kinyarwanda: Translate to formal English
2. If text is informal English: Make it formal and professional
3. Always output ONLY valid JSON with no extra text

Output format (MUST be valid JSON):
{
  "structured_description": "formal English summary here",
  "suggested_title": "short title",
  "suggested_category": "service_delivery or land_property or infrastructure_utilities or social_community or administrative",
  "suggested_institution": "cell_office or sector_office or district_authority or social_affairs_officer or land_bureau or other",
  "suggested_problem_type": "from the category",
  "suggested_urgency": "low or medium or high or emergency"
}

RULES:
- structured_description: Must be clear, formal, complete sentences in English
- Translate Kinyarwanda fully to English with professional tone
- Keep all facts (locations, names, dates, issues)
- Use neutral, official language
- Return ONLY the JSON object, no other text
"""


def process_issue_text(raw_text: str, category: Optional[str] = None) -> Optional[dict[str, Any]]:
    """
    Process raw citizen text via Claude.
    Returns structured dict for Report creation.
    """
    key = (os.getenv("ANTHROPIC_API_KEY") or "").strip()
    if not key:
        logger.warning("ANTHROPIC_API_KEY is not set. Set it in .env to enable translation.")
        return None

    model = (os.getenv("CLAUDE_MODEL") or "claude-sonnet-4-5").strip()

    user_content = f"""
Translate and restructure the following citizen issue into a formal, professional English summary. If the text is in Kinyarwanda, translate it to English. If it is in informal English, rewrite it in a formal, descriptive way. Then return ONLY the JSON object with structured_description (the formal summary) and the other suggested fields.
{f'User selected category: {category}. You may suggest problem_type from that category.' if category else ''}

---
Citizen's text:
{raw_text}
---
"""

    headers = {
        "x-api-key": key,
        "anthropic-version": "2023-06-01",
        "content-type": "application/json",
    }
    body = {
        "model": model,
        "max_tokens": 1000,
        "temperature": 0.2,
        "system": SYSTEM_PROMPT,
        "messages": [{"role": "user", "content": user_content}],
    }

    try:
        with httpx.Client(timeout=30.0) as client:
            response = client.post(
                "https://api.anthropic.com/v1/messages",
                headers=headers,
                json=body,
            )
            response.raise_for_status()
            payload = response.json()
    except httpx.HTTPStatusError as e:
        logger.warning("Claude HTTP error: %s", e.response.text if e.response is not None else str(e))
        return None
    except Exception as e:
        logger.exception("Claude call failed: %s", e)
        return None

    content = ""
    for block in payload.get("content", []):
        if isinstance(block, dict) and block.get("type") == "text":
            content = (block.get("text") or "").strip()
            if content:
                break
    if not content:
        logger.warning("Claude returned empty content")
        return None

    data = _parse_json_content(content)
    if data is None:
        logger.warning("Claude response not valid JSON; using plain-text translation fallback.")
        data = {
            "structured_description": content[:10000],
            "suggested_title": _make_title_from_text(content),
        }

    logger.info("Raw Claude response: %s", data)

    return _validate_and_normalize(data, category)


def _parse_json_content(content: str) -> Optional[dict[str, Any]]:
    text = (content or "").strip()
    if not text:
        return None

    # direct JSON
    try:
        obj = json.loads(text)
        return obj if isinstance(obj, dict) else None
    except json.JSONDecodeError:
        pass

    # fenced JSON
    fenced = re.search(r"```(?:json)?\s*(\{[\s\S]*?\})\s*```", text, flags=re.IGNORECASE)
    if fenced:
        try:
            obj = json.loads(fenced.group(1))
            return obj if isinstance(obj, dict) else None
        except json.JSONDecodeError:
            pass

    # first JSON object within text
    start = text.find("{")
    end = text.rfind("}")
    if start != -1 and end != -1 and end > start:
        try:
            obj = json.loads(text[start : end + 1])
            return obj if isinstance(obj, dict) else None
        except json.JSONDecodeError:
            return None

    return None


def _make_title_from_text(text: str) -> str:
    words = [w for w in re.split(r"\s+", (text or "").strip()) if w]
    if not words:
        return "Community issue report"
    return " ".join(words[:10])[:255]


def _validate_and_normalize(
    data: dict[str, Any],
    category: Optional[str] = None,
) -> dict[str, Any]:
    result: dict[str, Any] = {}

    # Description (accept common variants from the model)
    desc = (
        (data.get("structured_description") or data.get("structured_summary") or data.get("summary") or "")
        .strip()
    )
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