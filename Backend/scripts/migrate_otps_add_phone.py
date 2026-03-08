"""
One-time migration: add phone column to otps table if it doesn't exist.
Run from Backend folder:
  python -m scripts.migrate_otps_add_phone

Works with SQLite and PostgreSQL. Safe to run multiple times (skips if column exists).
"""
import os
import sys

sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from dotenv import load_dotenv
load_dotenv()

from sqlalchemy import create_engine, text
from core.config import settings


def main():
    engine = create_engine(
        settings.DATABASE_URL,
        connect_args={"check_same_thread": False} if "sqlite" in settings.DATABASE_URL.lower() else {},
    )
    is_sqlite = "sqlite" in settings.DATABASE_URL.lower()

    with engine.connect() as conn:
        # Check if phone column exists in otps table
        try:
            if is_sqlite:
                result = conn.execute(text(
                    "SELECT name FROM pragma_table_info('otps') WHERE name='phone'"
                )).fetchone()
                if not result:
                    conn.execute(text("ALTER TABLE otps ADD COLUMN phone VARCHAR(50)"))
                    conn.commit()
                    print("Added column: otps.phone")
                else:
                    print("Column otps.phone already exists, skipping")
            else:
                # PostgreSQL
                result = conn.execute(text("""
                    SELECT column_name 
                    FROM information_schema.columns 
                    WHERE table_name='otps' AND column_name='phone'
                """)).fetchone()
                if not result:
                    conn.execute(text("ALTER TABLE otps ADD COLUMN IF NOT EXISTS phone VARCHAR(50)"))
                    conn.commit()
                    print("Added column: otps.phone")
                else:
                    print("Column otps.phone already exists, skipping")
        except Exception as e:
            msg = str(e).lower()
            if "already exists" in msg or "duplicate" in msg or "exists" in msg:
                print(f"Column otps.phone already exists, skipping")
            else:
                print(f"Error: {e}")
            conn.rollback()

        # Add index for phone if it doesn't exist
        try:
            if is_sqlite:
                result = conn.execute(text(
                    "SELECT name FROM sqlite_master WHERE type='index' AND name='ix_otps_phone_purpose'"
                )).fetchone()
                if not result:
                    conn.execute(text("CREATE INDEX ix_otps_phone_purpose ON otps(phone, purpose)"))
                    conn.commit()
                    print("Added index: ix_otps_phone_purpose")
                else:
                    print("Index ix_otps_phone_purpose already exists, skipping")
            else:
                conn.execute(text(
                    "CREATE INDEX IF NOT EXISTS ix_otps_phone_purpose ON otps(phone, purpose)"
                ))
                conn.commit()
                print("Added index: ix_otps_phone_purpose")
        except Exception as e:
            msg = str(e).lower()
            if "already exists" in msg or "duplicate" in msg:
                print(f"Index already exists, skipping")
            else:
                print(f"Note creating index: {e}")
            conn.rollback()

    print("Migration done.")


if __name__ == "__main__":
    main()
