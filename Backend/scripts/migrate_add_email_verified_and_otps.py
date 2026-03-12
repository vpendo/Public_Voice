"""
One-time migration: add email_verified to users and create otps table
(for OTP registration, login 2FA, and password reset). Run from Backend folder:
  python -m scripts.migrate_add_email_verified_and_otps

Works with SQLite and PostgreSQL. Safe to run multiple times (skips if column/table exist).
"""
import os
import sys

_backend_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, _backend_dir)
os.chdir(_backend_dir)

from dotenv import load_dotenv
load_dotenv()
load_dotenv(os.path.join(_backend_dir, ".env"))

from sqlalchemy import create_engine, text
from core.config import settings
from models.base import Base
from models.otp import OTP


def main():
    engine = create_engine(
        settings.DATABASE_URL,
        connect_args={"check_same_thread": False} if "sqlite" in settings.DATABASE_URL.lower() else {},
    )
    is_sqlite = "sqlite" in settings.DATABASE_URL.lower()

    with engine.connect() as conn:
        # 1. Add email_verified to users
        col_name = "email_verified"
        added = False
        try:
            if is_sqlite:
                conn.execute(text(f"ALTER TABLE users ADD COLUMN {col_name} BOOLEAN NOT NULL DEFAULT 0"))
                added = True
            else:
                conn.execute(text(
                    "ALTER TABLE users ADD COLUMN IF NOT EXISTS email_verified BOOLEAN NOT NULL DEFAULT false"
                ))
                added = True
            conn.commit()
            print(f"Added column: users.{col_name}")
        except Exception as e:
            msg = str(e).lower()
            if "duplicate" in msg or "already exists" in msg or "exists" in msg:
                print(f"Column users.{col_name} already exists, skipping")
            else:
                print(f"Error adding users.{col_name}: {e}")
            conn.rollback()

        # 1b. Mark existing users as verified so they are not locked out (only if we just added the column)
        if added:
            try:
                if is_sqlite:
                    conn.execute(text("UPDATE users SET email_verified = 1 WHERE email_verified = 0"))
                else:
                    conn.execute(text("UPDATE users SET email_verified = true"))
                conn.commit()
                print("Set email_verified = true for existing users.")
            except Exception as e:
                print(f"Note updating existing users: {e}")
                conn.rollback()

    # 2. Create otps table if not exists (same for both DBs)
    try:
        OTP.__table__.create(engine, checkfirst=True)
        print("Table otps created or already exists.")
    except Exception as e:
        print(f"Note creating otps table: {e}")

    print("Migration done. Registration (OTP), login 2FA, and password reset OTP should work now.")


if __name__ == "__main__":
    main()
