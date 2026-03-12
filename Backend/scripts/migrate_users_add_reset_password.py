"""
One-time migration: add reset_token and reset_token_expires to users table
(for forgot-password feature). Run from Backend folder:
  python -m scripts.migrate_users_add_reset_password

PostgreSQL only. Safe to run multiple times (skips if columns exist).
"""
import os
import sys

sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from dotenv import load_dotenv
load_dotenv()

from sqlalchemy import create_engine, text
from core.config import settings

USER_RESET_COLUMNS = [
    ("reset_token", "VARCHAR(255)"),
    ("reset_token_expires", "TIMESTAMP WITH TIME ZONE"),
]


def main():
    engine = create_engine(settings.DATABASE_URL)

    with engine.connect() as conn:
        for col_name, pg_type in USER_RESET_COLUMNS:
            try:
                conn.execute(text(f"ALTER TABLE users ADD COLUMN IF NOT EXISTS {col_name} {pg_type}"))
                conn.commit()
                print(f"Added column: users.{col_name}")
            except Exception as e:
                msg = str(e).lower()
                if "duplicate" in msg or "already exists" in msg or "exists" in msg:
                    print(f"Column users.{col_name} already exists, skipping")
                else:
                    print(f"Error adding users.{col_name}: {e}")
                conn.rollback()

    print("Migration done. Login and forgot-password should work now.")


if __name__ == "__main__":
    main()
