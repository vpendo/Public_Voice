"""
One-time migration: make hashed_password column nullable in users table.
Run from Backend folder:
  python -m scripts.migrate_make_password_nullable

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
                    "SELECT name FROM pragma_table_info('users') WHERE name='hashed_password' AND \"notnull\"=1"
                )).fetchone()
                if result:
                    print("SQLite: hashed_password column has NOT NULL constraint.")
                    print("SQLite doesn't support ALTER COLUMN. You may need to recreate the table.")
                else:
                    print("SQLite: hashed_password column is already nullable or doesn't exist.")
            else:
                # PostgreSQL - check current constraint
                result = conn.execute(text("""
                    SELECT is_nullable 
                    FROM information_schema.columns 
                    WHERE table_name='users' AND column_name='hashed_password'
                """)).fetchone()
                
                if result:
                    is_nullable = result[0]
                    if is_nullable == 'NO':
                        # Column exists and is NOT NULL, make it nullable
                        conn.execute(text("ALTER TABLE users ALTER COLUMN hashed_password DROP NOT NULL"))
                        conn.commit()
                        print("Made hashed_password column nullable in users table.")
                    else:
                        print("hashed_password column is already nullable.")
                else:
                    print("hashed_password column not found in users table.")
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
