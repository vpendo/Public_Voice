"""
Add admin scope columns to users table (admin_scope_level, scope_district, scope_sector, scope_cell).
Run once from Backend folder: python -m scripts.add_admin_scope_columns
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
            for col_name, col_type in [
                ("admin_scope_level", "VARCHAR(20)"),
                ("scope_district", "VARCHAR(255)"),
                ("scope_sector", "VARCHAR(255)"),
                ("scope_cell", "VARCHAR(255)"),
            ]:
                if col_name in cols:
                    print(f"Column users.{col_name} already exists.")
                else:
                    conn.execute(text(f"ALTER TABLE users ADD COLUMN {col_name} {col_type}"))
                    print(f"Added column users.{col_name}.")
        else:
            conn.execute(text("ALTER TABLE users ADD COLUMN IF NOT EXISTS admin_scope_level VARCHAR(20)"))
            conn.execute(text("ALTER TABLE users ADD COLUMN IF NOT EXISTS scope_district VARCHAR(255)"))
            conn.execute(text("ALTER TABLE users ADD COLUMN IF NOT EXISTS scope_sector VARCHAR(255)"))
            conn.execute(text("ALTER TABLE users ADD COLUMN IF NOT EXISTS scope_cell VARCHAR(255)"))
            print("Added admin scope columns (if not exists).")


if __name__ == "__main__":
    main()
