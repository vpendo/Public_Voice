"""
One-time migration: rename email_verified column to phone_verified in users table.
Run from Backend folder:
  python -m scripts.migrate_rename_email_verified_to_phone_verified

Works with SQLite and PostgreSQL. Safe to run multiple times (skips if already renamed).
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
        # Check if email_verified exists and phone_verified doesn't
        try:
            if is_sqlite:
                # Check if email_verified column exists
                result = conn.execute(text(
                    "SELECT name FROM pragma_table_info('users') WHERE name='email_verified'"
                )).fetchone()
                if result:
                    # Check if phone_verified already exists
                    result2 = conn.execute(text(
                        "SELECT name FROM pragma_table_info('users') WHERE name='phone_verified'"
                    )).fetchone()
                    if not result2:
                        conn.execute(text("ALTER TABLE users RENAME COLUMN email_verified TO phone_verified"))
                        conn.commit()
                        print("Renamed column: users.email_verified -> users.phone_verified")
                    else:
                        print("Column phone_verified already exists, skipping rename")
                else:
                    # Check if phone_verified exists
                    result2 = conn.execute(text(
                        "SELECT name FROM pragma_table_info('users') WHERE name='phone_verified'"
                    )).fetchone()
                    if result2:
                        print("Column phone_verified already exists, email_verified not found")
                    else:
                        # Neither exists, create phone_verified
                        conn.execute(text("ALTER TABLE users ADD COLUMN phone_verified BOOLEAN NOT NULL DEFAULT 0"))
                        conn.commit()
                        print("Added column: users.phone_verified (email_verified did not exist)")
            else:
                # PostgreSQL
                # Check if email_verified exists
                result = conn.execute(text("""
                    SELECT column_name 
                    FROM information_schema.columns 
                    WHERE table_name='users' AND column_name='email_verified'
                """)).fetchone()
                
                if result:
                    # Check if phone_verified already exists
                    result2 = conn.execute(text("""
                        SELECT column_name 
                        FROM information_schema.columns 
                        WHERE table_name='users' AND column_name='phone_verified'
                    """)).fetchone()
                    if not result2:
                        conn.execute(text("ALTER TABLE users RENAME COLUMN email_verified TO phone_verified"))
                        conn.commit()
                        print("Renamed column: users.email_verified -> users.phone_verified")
                    else:
                        print("Column phone_verified already exists, skipping rename")
                else:
                    # Check if phone_verified exists
                    result2 = conn.execute(text("""
                        SELECT column_name 
                        FROM information_schema.columns 
                        WHERE table_name='users' AND column_name='phone_verified'
                    """)).fetchone()
                    if result2:
                        print("Column phone_verified already exists, email_verified not found")
                    else:
                        # Neither exists, create phone_verified
                        conn.execute(text(
                            "ALTER TABLE users ADD COLUMN IF NOT EXISTS phone_verified BOOLEAN NOT NULL DEFAULT false"
                        ))
                        conn.commit()
                        print("Added column: users.phone_verified (email_verified did not exist)")
        except Exception as e:
            msg = str(e).lower()
            if "already exists" in msg or "duplicate" in msg:
                print(f"Column already exists or renamed, skipping: {e}")
            else:
                print(f"Error: {e}")
            conn.rollback()

    print("Migration done.")


if __name__ == "__main__":
    main()
