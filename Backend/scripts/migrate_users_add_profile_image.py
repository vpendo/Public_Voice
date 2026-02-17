"""
One-time migration: add profile_image to users table.
Run from Backend folder: python -m scripts.migrate_users_add_profile_image
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
        connect_args={"check_same_thread": False} if "sqlite" in settings.DATABASE_URL else {},
    )
    is_sqlite = "sqlite" in settings.DATABASE_URL
    col_name, sqlite_type, pg_type = "profile_image", "VARCHAR(512)", "VARCHAR(512)"
    typ = sqlite_type if is_sqlite else pg_type
    with engine.connect() as conn:
        try:
            if is_sqlite:
                conn.execute(text(f"ALTER TABLE users ADD COLUMN {col_name} {typ}"))
            else:
                conn.execute(text(f"ALTER TABLE users ADD COLUMN IF NOT EXISTS {col_name} {typ}"))
            conn.commit()
            print(f"Added column: users.{col_name}")
        except Exception as e:
            msg = str(e).lower()
            if "duplicate" in msg or "already exists" in msg:
                print(f"Column users.{col_name} already exists, skipping")
            else:
                print(f"Error: {e}")
            conn.rollback()
    print("Migration done.")


if __name__ == "__main__":
    main()
