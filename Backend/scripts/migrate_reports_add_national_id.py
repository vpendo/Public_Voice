"""
One-time migration: add reporter_national_id (Rwanda National ID, 16 digits) to reports.
Run from Backend folder: python -m scripts.migrate_reports_add_national_id

PostgreSQL only.
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
            conn.execute(text("ALTER TABLE reports ADD COLUMN IF NOT EXISTS reporter_national_id VARCHAR(16)"))
            conn.commit()
            print("Added column: reports.reporter_national_id")
        except Exception as e:
            if "already exists" in str(e).lower():
                print("Column reports.reporter_national_id already exists, skipping")
            else:
                print(f"Error: {e}")
            conn.rollback()
    print("Migration done.")


if __name__ == "__main__":
    main()
