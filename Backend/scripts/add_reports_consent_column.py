"""
Add reports.consent column if missing (e.g. after upgrading to cell-level reports).
Run from Backend folder: python -m scripts.add_reports_consent_column
"""
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent.parent))

from dotenv import load_dotenv
load_dotenv()

from sqlalchemy import create_engine, text
from core.config import settings


def main():
    engine = create_engine(settings.DATABASE_URL)

    with engine.connect() as conn:
        try:
            conn.execute(text("ALTER TABLE reports ADD COLUMN IF NOT EXISTS consent BOOLEAN DEFAULT FALSE"))
            conn.commit()
            print("Added column: reports.consent")
        except Exception as e:
            msg = str(e).lower()
            if "duplicate" in msg or "already exists" in msg or "exists" in msg:
                print("Column reports.consent already exists, skipping.")
            else:
                print(f"Error: {e}")
                conn.rollback()
                sys.exit(1)
    print("Done.")


if __name__ == "__main__":
    main()
