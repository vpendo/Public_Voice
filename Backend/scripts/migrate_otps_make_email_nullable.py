"""
One-time migration: make email column nullable in otps table.
Run from Backend folder:
  python -m scripts.migrate_otps_make_email_nullable

Works with SQLite and PostgreSQL. Safe to run multiple times.
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
        try:
            if is_sqlite:
                # SQLite doesn't support ALTER COLUMN directly
                result = conn.execute(text(
                    "SELECT name FROM pragma_table_info('otps') WHERE name='email' AND \"notnull\"=1"
                )).fetchone()
                if result:
                    print("SQLite: email column has NOT NULL constraint.")
                    print("SQLite doesn't support ALTER COLUMN. You may need to recreate the table.")
                else:
                    print("SQLite: email column is already nullable or doesn't exist.")
            else:
                # PostgreSQL - check current constraint
                result = conn.execute(text("""
                    SELECT is_nullable 
                    FROM information_schema.columns 
                    WHERE table_name='otps' AND column_name='email'
                """)).fetchone()
                
                if result:
                    is_nullable = result[0]
                    if is_nullable == 'NO':
                        # Column exists and is NOT NULL, make it nullable
                        conn.execute(text("ALTER TABLE otps ALTER COLUMN email DROP NOT NULL"))
                        conn.commit()
                        print("Made email column nullable in otps table.")
                    else:
                        print("Email column is already nullable in otps table.")
                else:
                    print("Email column not found in otps table.")
        except Exception as e:
            msg = str(e).lower()
            if "does not exist" in msg or "not found" in msg:
                print(f"Column or table not found: {e}")
            else:
                print(f"Error: {e}")
            conn.rollback()

    print("Migration done.")


if __name__ == "__main__":
    main()
