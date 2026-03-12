"""
Drop the old check_category_valid constraint on reports so cell-level categories are allowed.
The constraint was likely created with old values (roads, water, electricity, etc.).
Current categories: service_delivery, land_property, infrastructure_utilities, social_community, administrative.

Run from Backend folder: python -m scripts.drop_reports_category_constraint
PostgreSQL only.
"""
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent.parent))

from dotenv import load_dotenv
load_dotenv()

from sqlalchemy import create_engine, text
from core.config import settings


def main():
    engine = create_engine(settings.DATABASE_URL)

    with engine.connect() as conn:
        try:
            conn.execute(text("ALTER TABLE reports DROP CONSTRAINT IF EXISTS check_category_valid"))
            conn.commit()
            print("Dropped constraint: reports.check_category_valid")
        except Exception as e:
            msg = str(e).lower()
            if "does not exist" in msg:
                print("Constraint check_category_valid does not exist, nothing to do.")
                conn.rollback()
            else:
                print(f"Error: {e}")
                conn.rollback()
                sys.exit(1)
    print("Done. You can now submit reports with categories: service_delivery, land_property, infrastructure_utilities, social_community, administrative.")


if __name__ == "__main__":
    main()
