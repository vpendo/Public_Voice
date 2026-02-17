"""
One-time migration: add reset_token and reset_token_expires to users table
(for forgot-password feature). Run from Backend folder:
  python -m scripts.migrate_users_add_reset_password

Works with SQLite and PostgreSQL. Safe to run multiple times (skips if columns exist).
"""
import os
import sys

sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from dotenv import load_dotenv
load_dotenv()

from sqlalchemy import create_engine, text
from core.config import settings

# (column_name, sqlite_type, pg_type)
USER_RESET_COLUMNS = [
    ("reset_token", "VARCHAR(255)", "VARCHAR(255)"),
    ("reset_token_expires", "DATETIME", "TIMESTAMP WITH TIME ZONE"),
]


def main():
    engine = create_engine(
        settings.DATABASE_URL,
        connect_args={"check_same_thread": False} if "sqlite" in settings.DATABASE_URL else {},
    )
    is_sqlite = "sqlite" in settings.DATABASE_URL

    with engine.connect() as conn:
        for col_name, sqlite_type, pg_type in USER_RESET_COLUMNS:
            typ = sqlite_type if is_sqlite else pg_type
            try:
                if is_sqlite:
                    conn.execute(text(f"ALTER TABLE users ADD COLUMN {col_name} {typ}"))
                else:
                    conn.execute(text(f"ALTER TABLE users ADD COLUMN IF NOT EXISTS {col_name} {typ}"))
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
