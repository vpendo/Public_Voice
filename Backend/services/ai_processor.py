"""
AI/NLP smart processing for citizen issue reports (cell-level).
Uses OpenAI Chat Completions API for translation and structuring.
Aligned with Report schema categories/institutions.
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


def process_issue_text(
    raw_text: str,
    category: Optional[str] = None,
) -> Optional[dict[str, Any]]:
    """
    Process raw citizen text via OpenAI.
    Returns structured dict for Report creation.
    """
    key = (settings.OPENAI_API_KEY or "").strip()
    if not key:
        logger.warning("OPENAI_API_KEY is not set. Set OPENAI_API_KEY in .env to enable report translation/structuring.")
        return None

    try:
        logger.info("Calling OpenAI for report translation (description length=%s)", len(raw_text or ""))
        return _call_openai(raw_text, category=category)
    except Exception as e:
        logger.exception("AI processing failed: %s", e)
        return None


def _call_openai(
    raw_text: str,
    category: Optional[str] = None,
) -> Optional[dict[str, Any]]:
    from openai import OpenAI
    import os

    # The OpenAI Python library uses httpx under the hood.  Certain versions of
    # httpx will automatically read `HTTP_PROXY`/`HTTPS_PROXY` environment
    # variables and pass a `proxies` argument to the client constructor.  Older
    # httpx releases (and thus some versions bundled with openai) do **not**
    # accept a `proxies` keyword, which leads to the TypeError shown in the
    # logs.  We proactively clear any proxy env vars here so the client is
    # created cleanly, and log when we do so for debugging.
    for var in ("HTTP_PROXY", "HTTPS_PROXY", "http_proxy", "https_proxy"):
        if os.environ.pop(var, None) is not None:
            logger.info("Cleared environment proxy variable %s to avoid httpx issue", var)

    # Construct keyword args for the OpenAI client. We avoid passing any
    # proxy configuration since some httpx versions (bundled with older
    # openai packages) do not support a `proxies` keyword and will raise the
    # TypeError seen in the logs.  The easiest way to sidestep this is to build
    # our own httpx client with `trust_env=False`, which stops httpx from
    # reading proxy settings from the environment, and supply that client
    # explicitly.  This also protects us in case the OpenAI library itself
    # tries to inject a proxies kwarg internally.
    client_kwargs: dict[str, Any] = {
        "api_key": settings.OPENAI_API_KEY,
        "timeout": 30.0,
    }
    if getattr(settings, "OPENAI_API_BASE", None) and str(settings.OPENAI_API_BASE).strip():
        client_kwargs["base_url"] = settings.OPENAI_API_BASE.strip()

    # create an httpx client we control; trust_env=False prevents it from
    # picking up any proxy settings (so no `proxies` kwarg will ever be passed).
    from httpx import Client as HttpxClient
    httpx_client = HttpxClient(timeout=30.0, trust_env=False)
    client_kwargs["http_client"] = httpx_client

    client = OpenAI(**client_kwargs)

    model = settings.OPENAI_MODEL or "gpt-4o-mini"

    user_content = f"""
Translate and restructure the following citizen issue into a formal, professional English summary. If the text is in Kinyarwanda, translate it to English. If it is in informal English, rewrite it in a formal, descriptive way. Then return ONLY the JSON object with structured_description (the formal summary) and the other suggested fields.
{f'User selected category: {category}. You may suggest problem_type from that category.' if category else ''}

---
Citizen's text:
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