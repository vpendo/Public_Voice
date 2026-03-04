"""
Add users.email_verified column (and create otps table if missing).
Run from Backend folder: python -m scripts.add_email_verified_column
"""
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent.parent))

from dotenv import load_dotenv
load_dotenv()

from models.base import init_db

def main():
    init_db()  # creates otps table and any new columns on User if using create_all
    print("Ensure users.email_verified exists and otps table exists.")
    print("If using SQLite/PostgreSQL with create_all, tables are updated. For existing DBs you may need to add the column manually:")
    print("  PostgreSQL: ALTER TABLE users ADD COLUMN IF NOT EXISTS email_verified BOOLEAN DEFAULT TRUE;")
    print("  (New registrations get email_verified=false; existing users can stay TRUE.)")

if __name__ == "__main__":
    main()
