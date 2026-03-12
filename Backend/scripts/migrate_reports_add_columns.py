"""
One-time migration: add missing columns to reports table.
Run from Backend folder: python -m scripts.migrate_reports_add_columns

PostgreSQL only.
"""
import os
import sys

sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from dotenv import load_dotenv
load_dotenv()

from sqlalchemy import create_engine, text
from core.config import settings

REPORT_EXTRA_COLUMNS = [
    ("user_id", "INTEGER REFERENCES users(id)"),
    ("title", "VARCHAR(255)"),
    ("structured_description", "TEXT"),
    ("admin_response", "TEXT"),
    ("priority", "VARCHAR(50) DEFAULT 'normal'"),
    ("updated_at", "TIMESTAMP WITH TIME ZONE DEFAULT NOW()"),
]


def main():
    engine = create_engine(settings.DATABASE_URL)

    with engine.connect() as conn:
        for col_name, pg_type in REPORT_EXTRA_COLUMNS:
            try:
                conn.execute(text(f"ALTER TABLE reports ADD COLUMN IF NOT EXISTS {col_name} {pg_type}"))
                conn.commit()
                print(f"Added column: reports.{col_name}")
            except Exception as e:
                msg = str(e).lower()
                if "duplicate" in msg or "already exists" in msg or "exists" in msg:
                    print(f"Column reports.{col_name} already exists, skipping")
                else:
                    print(f"Error adding reports.{col_name}: {e}")
                conn.rollback()

    print("Migration done.")


if __name__ == "__main__":
    main()
