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
    engine = create_engine(
        settings.DATABASE_URL,
        connect_args={"check_same_thread": False} if "sqlite" in settings.DATABASE_URL else {},
    )
    is_sqlite = "sqlite" in settings.DATABASE_URL

    with engine.connect() as conn:
        try:
            if is_sqlite:
                conn.execute(text("ALTER TABLE reports ADD COLUMN consent BOOLEAN DEFAULT 0"))
            else:
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
