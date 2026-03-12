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
    engine = create_engine(settings.DATABASE_URL)
    col_name, pg_type = "profile_image", "VARCHAR(512)"
    with engine.connect() as conn:
        try:
            conn.execute(text(f"ALTER TABLE users ADD COLUMN IF NOT EXISTS {col_name} {pg_type}"))
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
