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

# Category choices aligned with report form (Cell-level Community Problem Report)
CATEGORY_CHOICES = [
    "service_delivery",
    "land_property",
    "infrastructure_utilities",
    "social_community",
    "administrative",
]

# Geographic scope: admin sees only reports in this area
SCOPE_LEVELS = ("all", "district", "sector", "cell")


def ensure_admin_scope_columns() -> None:
    """Add admin scope columns if missing (PostgreSQL)."""
    with engine.begin() as conn:
        conn.execute(text("ALTER TABLE users ADD COLUMN IF NOT EXISTS admin_scope_level VARCHAR(20)"))
        conn.execute(text("ALTER TABLE users ADD COLUMN IF NOT EXISTS scope_district VARCHAR(255)"))
        conn.execute(text("ALTER TABLE users ADD COLUMN IF NOT EXISTS scope_sector VARCHAR(255)"))
        conn.execute(text("ALTER TABLE users ADD COLUMN IF NOT EXISTS scope_cell VARCHAR(255)"))


def ensure_admin_category_column() -> None:
    """Add users.admin_category if missing (PostgreSQL)."""
    with engine.begin() as conn:
        conn.execute(text("ALTER TABLE users ADD COLUMN IF NOT EXISTS admin_category VARCHAR(50)"))
        print("Ensured column users.admin_category exists.")


def main() -> None:
    # Optional: create admin from command line (no prompts)
    # Usage: python -m scripts.create_admin EMAIL "Full Name" CATEGORY PASSWORD [scope_level] [district] [sector] [cell]
    # Example: python -m scripts.create_admin admin@cell.com "Cell Admin" "" Pass123 cell "Gasabo" "Remera" "Gikondo"
    # Example: python -m scripts.create_admin admin@sector.com "Sector Admin" "" Pass123 sector "Gasabo" "Remera" ""
    if len(sys.argv) >= 5:
        email = sys.argv[1].strip().lower()
        full_name = sys.argv[2].strip() or "Admin"
        admin_category_raw = sys.argv[3].strip().lower()
        password = sys.argv[4]
        admin_category = admin_category_raw if admin_category_raw in ALLOWED_CATEGORIES else None
        scope_level = sys.argv[5].strip().lower() if len(sys.argv) > 5 and sys.argv[5] else "all"
        scope_level = scope_level if scope_level in SCOPE_LEVELS else "all"
        scope_district = sys.argv[6].strip() if len(sys.argv) > 6 else None
        scope_sector = sys.argv[7].strip() if len(sys.argv) > 7 else None
        scope_cell = sys.argv[8].strip() if len(sys.argv) > 8 else None
        use_prompt = False
    else:
        email = full_name = admin_category = password = None
        scope_level = scope_district = scope_sector = scope_cell = None
        use_prompt = sys.stdin.isatty()

    init_db()
    ensure_admin_category_column()
    ensure_admin_scope_columns()
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
            "  service_delivery, land_property, infrastructure_utilities, social_community, administrative\n"
            "Choice: "
        )
        admin_category = (input(cat_prompt).strip().lower() if use_prompt else None) or os.getenv("CREATE_ADMIN_CATEGORY", "").strip().lower()
        admin_category = admin_category if admin_category in ALLOWED_CATEGORIES else None

        scope_prompt = (
            "\nGeographic scope (press Enter for 'all' – sees all locations):\n"
            "  all | district | sector | cell\n"
            "  (cell = one cell; sector = one sector; district = one district)\n"
            "Choice: "
        )
        scope_level = (input(scope_prompt).strip().lower() if use_prompt else None) or os.getenv("CREATE_ADMIN_SCOPE_LEVEL", "all").strip().lower()
        scope_level = scope_level if scope_level in SCOPE_LEVELS else "all"
        scope_district = scope_sector = scope_cell = None
        if scope_level == "district":
            scope_district = (input("  District name: ").strip() if use_prompt else None) or os.getenv("CREATE_ADMIN_SCOPE_DISTRICT", "").strip() or None
        elif scope_level == "sector":
            scope_district = (input("  District name: ").strip() if use_prompt else None) or os.getenv("CREATE_ADMIN_SCOPE_DISTRICT", "").strip() or None
            scope_sector = (input("  Sector name: ").strip() if use_prompt else None) or os.getenv("CREATE_ADMIN_SCOPE_SECTOR", "").strip() or None
        elif scope_level == "cell":
            scope_district = (input("  District name: ").strip() if use_prompt else None) or os.getenv("CREATE_ADMIN_SCOPE_DISTRICT", "").strip() or None
            scope_sector = (input("  Sector name: ").strip() if use_prompt else None) or os.getenv("CREATE_ADMIN_SCOPE_SECTOR", "").strip() or None
            scope_cell = (input("  Cell name: ").strip() if use_prompt else None) or os.getenv("CREATE_ADMIN_SCOPE_CELL", "").strip() or None

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
        admin_scope_level=scope_level or "all",
        scope_district=scope_district,
        scope_sector=scope_sector,
        scope_cell=scope_cell,
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    db.close()

    parts = []
    if admin_category:
        parts.append(f"category={admin_category}")
    if scope_level and scope_level != "all":
        loc = " → ".join(x for x in [scope_district, scope_sector, scope_cell] if x)
        parts.append(f"scope={scope_level}: {loc}")
    scope = "; ".join(parts) if parts else "all (super admin)"
    print(f"Admin created: id={user.id}, email={user.email}, scope={scope}")


if __name__ == "__main__":
    main()
