"""
Create an admin user. Run multiple times to create several admins (e.g. Water, Electricity, Roads).
Admins do not register via the app – they are created only with this script.
"""
import getpass
import os
import sys

sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from dotenv import load_dotenv
load_dotenv()

from sqlalchemy import text
from models.base import init_db, engine, SessionLocal
from models.user import User
from core.security import hash_password
from schemas.report import ALLOWED_CATEGORIES

# Display order for category choice (roads = land/infrastructure)
CATEGORY_CHOICES = ["roads", "water", "electricity", "security", "sanitation", "health", "education", "other"]


def ensure_admin_category_column() -> None:
    """Add users.admin_category if missing (PostgreSQL or SQLite)."""
    url = str(engine.url)
    with engine.begin() as conn:
        if "sqlite" in url:
            r = conn.execute(text("PRAGMA table_info(users)"))
            cols = [row[1] for row in r]
            if "admin_category" not in cols:
                conn.execute(text("ALTER TABLE users ADD COLUMN admin_category VARCHAR(50)"))
                print("Added column users.admin_category.")
        else:
            conn.execute(text("ALTER TABLE users ADD COLUMN IF NOT EXISTS admin_category VARCHAR(50)"))
            print("Ensured column users.admin_category exists.")


def main() -> None:
    # Optional: create admin from command line (no prompts)
    # Usage: python -m scripts.create_admin EMAIL "Full Name" CATEGORY PASSWORD
    # Example: python -m scripts.create_admin admin@water.com "Water Admin" water Water123
    if len(sys.argv) >= 5:
        email = sys.argv[1].strip().lower()
        full_name = sys.argv[2].strip() or "Admin"
        admin_category_raw = sys.argv[3].strip().lower()
        password = sys.argv[4]
        admin_category = admin_category_raw if admin_category_raw in ALLOWED_CATEGORIES else None
        use_prompt = False
    else:
        email = full_name = admin_category = password = None
        use_prompt = sys.stdin.isatty()

    init_db()
    ensure_admin_category_column()
    db = SessionLocal()

    if not use_prompt and email:
        pass  # use CLI args
    else:
        print("\n--- Create a new admin (use a NEW email not already in the app) ---\n")
        email = (input("Admin email: ").strip().lower() if use_prompt else None) or os.getenv("CREATE_ADMIN_EMAIL", "").strip().lower()
        if not email:
            print("Email is required.")
            db.close()
            sys.exit(1)

        full_name = (input("Full name: ").strip() if use_prompt else None) or os.getenv("CREATE_ADMIN_FULL_NAME", "").strip()
        if not full_name:
            full_name = "Admin"

        cat_prompt = (
            "\nCategory this admin manages (press Enter for super admin – sees all):\n"
            "  roads, water, electricity, security, sanitation, health, education, other\n"
            "Choice: "
        )
        admin_category = (input(cat_prompt).strip().lower() if use_prompt else None) or os.getenv("CREATE_ADMIN_CATEGORY", "").strip().lower()
        admin_category = admin_category if admin_category in ALLOWED_CATEGORIES else None

        password = os.getenv("CREATE_ADMIN_PASSWORD") if not use_prompt else None
        if not password:
            print("\nPassword (min 8 characters, at least 1 letter and 1 digit):")
            while True:
                password = getpass.getpass("  Password: ")
                password2 = getpass.getpass("  Confirm password: ")
                if password != password2:
                    print("Passwords do not match.")
                    continue
                if len(password) < 8 or not any(c.isdigit() for c in password) or not any(c.isalpha() for c in password):
                    print("Password must be at least 8 characters and include at least one letter and one digit.")
                    continue
                break

    if not email:
        print("Email is required.")
        db.close()
        sys.exit(1)

    existing = db.query(User).filter(User.email == email).first()
    if existing:
        print(f"User already exists with this email: id={existing.id}, role={existing.role}")
        db.close()
        sys.exit(1)

    if not password or len(password) < 8 or not any(c.isdigit() for c in password) or not any(c.isalpha() for c in password):
        print("Password must be at least 8 characters with at least one letter and one digit.")
        db.close()
        sys.exit(1)

    user = User(
        full_name=full_name,
        email=email,
        hashed_password=hash_password(password),
        role="Admin",
        admin_category=admin_category,
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    db.close()

    scope = f"category={admin_category}" if admin_category else "all categories (super admin)"
    print(f"Admin created: id={user.id}, email={user.email}, scope={scope}")


if __name__ == "__main__":
    main()
