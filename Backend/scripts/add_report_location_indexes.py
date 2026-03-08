"""
Add database indexes on reports table for district, sector, and cell columns.
This will significantly speed up queries that filter by location.

Run from Backend folder: python -m scripts.add_report_location_indexes
"""
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent.parent))

from dotenv import load_dotenv
load_dotenv()

from sqlalchemy import create_engine, text, Index
from core.config import settings


def main():
    engine = create_engine(settings.DATABASE_URL)
    url = str(engine.url)
    
    print("Adding indexes on reports table for location columns...")
    print(f"Database: {url.split('@')[-1] if '@' in url else url}")
    
    with engine.begin() as conn:
        # Check if indexes already exist
        if "postgresql" in url.lower():
            # PostgreSQL
            check_query = text("""
                SELECT indexname 
                FROM pg_indexes 
                WHERE tablename = 'reports' 
                AND indexname IN ('ix_reports_district', 'ix_reports_sector', 'ix_reports_cell')
            """)
            existing = [row[0] for row in conn.execute(check_query)]
            
            if 'ix_reports_district' not in existing:
                conn.execute(text("CREATE INDEX ix_reports_district ON reports(district)"))
                print("  [OK] Created index on reports.district")
            else:
                print("  [SKIP] Index on reports.district already exists")
            
            if 'ix_reports_sector' not in existing:
                conn.execute(text("CREATE INDEX ix_reports_sector ON reports(sector)"))
                print("  [OK] Created index on reports.sector")
            else:
                print("  [SKIP] Index on reports.sector already exists")
            
            if 'ix_reports_cell' not in existing:
                conn.execute(text("CREATE INDEX ix_reports_cell ON reports(cell)"))
                print("  [OK] Created index on reports.cell")
            else:
                print("  [SKIP] Index on reports.cell already exists")
                
            # Composite index for common queries (district + sector + cell)
            if 'ix_reports_location' not in existing:
                conn.execute(text("""
                    CREATE INDEX ix_reports_location 
                    ON reports(district, sector, cell) 
                    WHERE district IS NOT NULL AND sector IS NOT NULL AND cell IS NOT NULL
                """))
                print("  [OK] Created composite index on reports(district, sector, cell)")
            else:
                print("  [SKIP] Composite index already exists")
                
        elif "sqlite" in url.lower():
            # SQLite
            check_query = text("SELECT name FROM sqlite_master WHERE type='index' AND tbl_name='reports'")
            existing = [row[0] for row in conn.execute(check_query)]
            
            if 'ix_reports_district' not in existing:
                conn.execute(text("CREATE INDEX ix_reports_district ON reports(district)"))
                print("  [OK] Created index on reports.district")
            else:
                print("  [SKIP] Index on reports.district already exists")
            
            if 'ix_reports_sector' not in existing:
                conn.execute(text("CREATE INDEX ix_reports_sector ON reports(sector)"))
                print("  [OK] Created index on reports.sector")
            else:
                print("  [SKIP] Index on reports.sector already exists")
            
            if 'ix_reports_cell' not in existing:
                conn.execute(text("CREATE INDEX ix_reports_cell ON reports(cell)"))
                print("  [OK] Created index on reports.cell")
            else:
                print("  [SKIP] Index on reports.cell already exists")
        else:
            print("  [WARNING] Unknown database type. Skipping index creation.")
            return
    
    print("\n✓ Indexes added successfully!")
    print("  This should significantly improve query performance for location-based filtering.")


if __name__ == "__main__":
    main()
