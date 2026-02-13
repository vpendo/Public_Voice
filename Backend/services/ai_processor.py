"""
AI/NLP smart processing for citizen issue reports.

Flow: raw text (Kinyarwanda or informal English) → AI API →
  translation (if needed) → formal rewriting → structuring → JSON.

Used by the reports router when creating a report: raw_description is kept,
structured_description and optional title/category/institution come from here.
"""
import json
import logging
from typing import Any, Optional

from core.config import settings

logger = logging.getLogger(__name__)

# Must match schemas/report.py
ALLOWED_CATEGORIES = {
    "roads", "water", "security", "sanitation",
    "electricity", "health", "education", "other",
}
ALLOWED_INSTITUTIONS = {
    "district", "sector", "cell", "village",
    "mininfra", "mineduc", "minisante", "localGov", "other",
}

SYSTEM_PROMPT = """You are a civic issue processing assistant for PublicVoice, a platform used in Rwanda.

Your task is to process citizen-submitted issue text that may be:
- In Kinyarwanda
- In informal or mixed English
- Unstructured (run-on sentences, slang, abbreviations)

Do the following and output ONLY a single valid JSON object (no markdown, no extra text):

1. If the text is in Kinyarwanda, translate it to English.
2. Rewrite the content in clear, formal English suitable for government/admin review.
3. Extract structure and fill the JSON fields below.

Output JSON with exactly these keys (use empty string "" if not inferable):
- "structured_description": string — the full formal English description (2–4 sentences).
- "suggested_title": string — a short title (max 10 words) summarizing the issue.
- "suggested_category": string — one of: roads, water, security, sanitation, electricity, health, education, other.
- "suggested_institution": string — one of: district, sector, cell, village, mininfra, mineduc, minisante, localGov, other.

Be concise and professional. If the text is already in clear formal English, still produce structured_description and suggestions. If language is unclear, prefer "other" for category and "other" for institution."""


def process_issue_text(raw_text: str) -> Optional[dict[str, Any]]:
    """
    Send raw citizen text to the AI API for translation, formal rewriting, and structuring.

    Returns a dict with:
      - structured_description: str (formal English)
      - suggested_title: str | None
      - suggested_category: str (only if in ALLOWED_CATEGORIES)
      - suggested_institution: str (only if in ALLOWED_INSTITUTIONS)

    Returns None if AI is disabled, API key missing, or the request fails.
    """
    if not getattr(settings, "OPENAI_API_KEY", None) or not settings.OPENAI_API_KEY.strip():
        logger.info(
            "AI/NLP skipped: OPENAI_API_KEY not set. Set it in .env to enable translation, "
            "formal rewriting, and structuring of citizen reports (e.g. Kinyarwanda → English)."
        )
        return None

    try:
        return _call_openai(raw_text)
    except Exception as e:
        logger.warning("AI processing failed: %s", e, exc_info=settings.DEBUG)
        return None


def _call_openai(raw_text: str) -> Optional[dict[str, Any]]:
    """Call OpenAI (or compatible) API and return validated structured result."""
    try:
        from openai import OpenAI
    except ImportError:
        logger.warning("openai package not installed; pip install openai")
        return None

    client = OpenAI(
        api_key=settings.OPENAI_API_KEY,
        base_url=getattr(settings, "OPENAI_API_BASE", None) or None,
    )
    model = getattr(settings, "OPENAI_MODEL", "gpt-4o-mini") or "gpt-4o-mini"

    user_content = f"Process this citizen issue text and output only the JSON object.\n\n---\n{raw_text}\n---"

    response = client.chat.completions.create(
        model=model,
        messages=[
            {"role": "system", "content": SYSTEM_PROMPT},
            {"role": "user", "content": user_content},
        ],
        temperature=0.2,
        max_tokens=1024,
    )
    choice = response.choices[0] if response.choices else None
    if not choice or not choice.message or not choice.message.content:
        logger.warning("Empty response from AI")
        return None

    content = choice.message.content.strip()
    # Remove markdown code block if present
    if content.startswith("```"):
        lines = content.split("\n")
        if lines[0].startswith("```"):
            lines = lines[1:]
        if lines and lines[-1].strip() == "```":
            lines = lines[:-1]
        content = "\n".join(lines)

    try:
        data = json.loads(content)
    except json.JSONDecodeError as e:
        logger.warning("AI returned invalid JSON: %s", e)
        return None

    return _validate_and_normalize(data)


def _validate_and_normalize(data: dict[str, Any]) -> dict[str, Any]:
    """Ensure category and institution are allowed; set structured_description."""
    result: dict[str, Any] = {}

    desc = (data.get("structured_description") or "").strip()
    if desc:
        result["structured_description"] = desc[:10_000]  # match DB limit

    title = (data.get("suggested_title") or "").strip()
    if title:
        result["suggested_title"] = title[:255]

    cat = (data.get("suggested_category") or "").strip().lower()
    if cat in ALLOWED_CATEGORIES:
        result["suggested_category"] = cat
    else:
        result["suggested_category"] = None

    inst = (data.get("suggested_institution") or "").strip().lower()
    if inst in ALLOWED_INSTITUTIONS:
        result["suggested_institution"] = inst
    else:
        result["suggested_institution"] = None

    return result
