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
    with engine.begin() as conn:
        conn.execute(text("ALTER TABLE users ADD COLUMN IF NOT EXISTS admin_scope_level VARCHAR(20)"))
        conn.execute(text("ALTER TABLE users ADD COLUMN IF NOT EXISTS scope_district VARCHAR(255)"))
        conn.execute(text("ALTER TABLE users ADD COLUMN IF NOT EXISTS scope_sector VARCHAR(255)"))
        conn.execute(text("ALTER TABLE users ADD COLUMN IF NOT EXISTS scope_cell VARCHAR(255)"))
        print("Added admin scope columns (if not exists).")


if __name__ == "__main__":
    main()
