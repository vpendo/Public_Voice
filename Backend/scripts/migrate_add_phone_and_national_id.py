"""
One-time migration: add phone and national_id columns to users table
(for phone-based authentication). Run from Backend folder:
  python -m scripts.migrate_add_phone_and_national_id

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
USER_PHONE_COLUMNS = [
    ("phone", "VARCHAR(50)", "VARCHAR(50)"),
    ("national_id", "VARCHAR(50)", "VARCHAR(50)"),
]


def main():
    engine = create_engine(
        settings.DATABASE_URL,
        connect_args={"check_same_thread": False} if "sqlite" in settings.DATABASE_URL.lower() else {},
    )
    is_sqlite = "sqlite" in settings.DATABASE_URL.lower()

    with engine.connect() as conn:
        for col_name, sqlite_type, pg_type in USER_PHONE_COLUMNS:
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

        # Add indexes for phone and national_id (unique constraints)
        try:
            if is_sqlite:
                # SQLite doesn't support IF NOT EXISTS for indexes, so we check manually
                result = conn.execute(text(
                    "SELECT name FROM sqlite_master WHERE type='index' AND name='ix_users_phone'"
                )).fetchone()
                if not result:
                    conn.execute(text("CREATE UNIQUE INDEX ix_users_phone ON users(phone)"))
                    print("Added unique index: ix_users_phone")
                else:
                    print("Index ix_users_phone already exists, skipping")
                
                result = conn.execute(text(
                    "SELECT name FROM sqlite_master WHERE type='index' AND name='ix_users_national_id'"
                )).fetchone()
                if not result:
                    conn.execute(text("CREATE UNIQUE INDEX ix_users_national_id ON users(national_id)"))
                    print("Added unique index: ix_users_national_id")
                else:
                    print("Index ix_users_national_id already exists, skipping")
            else:
                # PostgreSQL
                conn.execute(text(
                    "CREATE UNIQUE INDEX IF NOT EXISTS ix_users_phone ON users(phone) WHERE phone IS NOT NULL"
                ))
                print("Added unique index: ix_users_phone")
                conn.execute(text(
                    "CREATE UNIQUE INDEX IF NOT EXISTS ix_users_national_id ON users(national_id) WHERE national_id IS NOT NULL"
                ))
                print("Added unique index: ix_users_national_id")
            conn.commit()
        except Exception as e:
            msg = str(e).lower()
            if "already exists" in msg or "duplicate" in msg:
                print(f"Indexes already exist, skipping")
            else:
                print(f"Note creating indexes: {e}")
            conn.rollback()

    print("Migration done. Phone and national_id columns added to users table.")


if __name__ == "__main__":
    main()
