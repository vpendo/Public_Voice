"""
One-time migration: add cell-level report columns.
Run from Backend folder: python -m scripts.migrate_reports_cell_level

Adds: tracking_id, gender, reporter_*, problem_type, province, district, sector, cell, village, landmark,
      urgency, evidence_*, consent; makes name nullable.
PostgreSQL only.
"""
import os
import sys

sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from dotenv import load_dotenv
load_dotenv()

from sqlalchemy import create_engine, text
from core.config import settings

# (column_name, pg_type)
CELL_LEVEL_COLUMNS = [
    ("tracking_id", "VARCHAR(50)"),
    ("gender", "VARCHAR(20)"),
    ("reporter_village", "VARCHAR(255)"),
    ("reporter_cell", "VARCHAR(255)"),
    ("reporter_sector", "VARCHAR(255)"),
    ("reporter_district", "VARCHAR(255)"),
    ("problem_type", "VARCHAR(100)"),
    ("province", "VARCHAR(100)"),
    ("district", "VARCHAR(255)"),
    ("sector", "VARCHAR(255)"),
    ("cell", "VARCHAR(255)"),
    ("village", "VARCHAR(255)"),
    ("landmark", "VARCHAR(500)"),
    ("urgency", "VARCHAR(50)"),
    ("evidence_photo", "VARCHAR(500)"),
    ("evidence_video", "VARCHAR(500)"),
    ("evidence_voice", "VARCHAR(500)"),
    ("consent", "BOOLEAN DEFAULT FALSE"),
    ("admin_notes", "TEXT"),
]


def main():
    engine = create_engine(settings.DATABASE_URL)

    with engine.connect() as conn:
        for col_name, pg_type in CELL_LEVEL_COLUMNS:
            try:
                conn.execute(text(f"ALTER TABLE reports ADD COLUMN IF NOT EXISTS {col_name} {pg_type}"))
                conn.commit()
                print(f"Added column: reports.{col_name}")
            except Exception as e:
                msg = str(e).lower()
                if "duplicate" in msg or "already exists" in msg or "exists" in msg:
                    print(f"Column reports.{col_name} already exists, skipping")
                else:
                    print(f"Error adding reports.{col_name}: {e}")
                conn.rollback()

    print("Cell-level migration done.")


if __name__ == "__main__":
    main()
