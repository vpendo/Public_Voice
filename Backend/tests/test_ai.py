"""
Quick manual test for Claude/NLP processing.

Loads Backend/.env so ANTHROPIC_API_KEY is available, then calls:
  process_issue_text(sample_text)
"""

from pathlib import Path

from dotenv import load_dotenv

# Ensure we load the Backend/.env (not just the current working directory).
_backend_dir = Path(__file__).resolve().parent.parent
load_dotenv(dotenv_path=_backend_dir / ".env")

from services.ai_processor import process_issue_text

if __name__ == "__main__":
    sample_text = "The water supply has been cut for 3 days in my cell."
    result = process_issue_text(sample_text)
    print(result)