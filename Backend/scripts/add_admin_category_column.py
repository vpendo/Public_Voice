"""
Add admin_category column to users table if it does not exist.
Run once from Backend folder: python -m scripts.add_admin_category_column

If create_admin fails with "column users.admin_category does not exist", run this script first.
"""
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent.parent))

from sqlalchemy import text
from models.base import engine, init_db

def main() -> None:
    init_db()
    url = str(engine.url)
    with engine.begin() as conn:
        if "sqlite" in url:
            r = conn.execute(text("PRAGMA table_info(users)"))
            cols = [row[1] for row in r]
            if "admin_category" in cols:
                print("Column users.admin_category already exists.")
                return
            conn.execute(text("ALTER TABLE users ADD COLUMN admin_category VARCHAR(50)"))
            print("Added column users.admin_category.")
        else:
            # PostgreSQL (IF NOT EXISTS supported in 9.5+)
            conn.execute(text("ALTER TABLE users ADD COLUMN IF NOT EXISTS admin_category VARCHAR(50)"))
            print("Added column users.admin_category (if not exists).")


if __name__ == "__main__":
    main()
