"""
One-time migration: add missing columns to reports table.
Run from Backend folder: python -m scripts.migrate_reports_add_columns

Works with SQLite and PostgreSQL.
"""
import os
import sys

sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from dotenv import load_dotenv
load_dotenv()

from sqlalchemy import create_engine, text
from core.config import settings

# Columns to add: (name, type_sqlite, type_pg)
REPORT_EXTRA_COLUMNS = [
    ("user_id", "INTEGER", "INTEGER REFERENCES users(id)"),
    ("title", "VARCHAR(255)", "VARCHAR(255)"),
    ("structured_description", "TEXT", "TEXT"),
    ("admin_response", "TEXT", "TEXT"),
    ("priority", "VARCHAR(50) DEFAULT 'normal'", "VARCHAR(50) DEFAULT 'normal'"),
    ("updated_at", "DATETIME DEFAULT CURRENT_TIMESTAMP", "TIMESTAMP WITH TIME ZONE DEFAULT NOW()"),
]


def main():
    engine = create_engine(
        settings.DATABASE_URL,
        connect_args={"check_same_thread": False} if "sqlite" in settings.DATABASE_URL else {},
    )
    is_sqlite = "sqlite" in settings.DATABASE_URL

    with engine.connect() as conn:
        for col_name, sqlite_type, pg_type in REPORT_EXTRA_COLUMNS:
            typ = sqlite_type if is_sqlite else pg_type
            try:
                if is_sqlite:
                    conn.execute(text(f"ALTER TABLE reports ADD COLUMN {col_name} {typ}"))
                else:
                    conn.execute(text(f"ALTER TABLE reports ADD COLUMN IF NOT EXISTS {col_name} {typ}"))
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
