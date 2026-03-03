"""
Update an existing admin's geographic scope (district, sector, cell) and/or category.
Use this when you created an admin with the wrong sector, district, or cell.

Run from Backend folder:
  python -m scripts.update_admin_scope celladmin@gmail.com

Then follow the prompts to enter the correct sector (and district/cell if needed).

Or set scope via CLI (all optional; only provided values are updated):
  python -m scripts.update_admin_scope EMAIL [--scope-level LEVEL] [--district D] [--sector S] [--cell C] [--category CAT]
Example:
  python -m scripts.update_admin_scope celladmin@gmail.com --scope-level cell --district Gasabo --sector Remera --cell Gikondo
"""
import argparse
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent.parent))

from dotenv import load_dotenv
load_dotenv()

from models.base import init_db, SessionLocal
from models.user import User
from schemas.report import ALLOWED_CATEGORIES

SCOPE_LEVELS = ("all", "district", "sector", "cell")


def main() -> None:
    parser = argparse.ArgumentParser(
        description="Update an existing admin's scope (district, sector, cell) and/or category."
    )
    parser.add_argument("email", nargs="?", help="Admin email to update")
    parser.add_argument("--scope-level", choices=SCOPE_LEVELS, help="Geographic scope: all, district, sector, cell")
    parser.add_argument("--district", help="Scope district name")
    parser.add_argument("--sector", help="Scope sector name")
    parser.add_argument("--cell", help="Scope cell name")
    parser.add_argument("--category", help="Report category this admin manages (or empty for all)")
    args = parser.parse_args()

    init_db()
    db = SessionLocal()

    email = (args.email or "").strip().lower()
    if not email:
        email = input("Admin email to update: ").strip().lower()
    if not email:
        print("Email is required.")
        db.close()
        sys.exit(1)

    user = db.query(User).filter(User.email == email).first()
    if not user:
        print(f"No user found with email: {email}")
        db.close()
        sys.exit(1)
    if (user.role or "").strip().lower() != "admin":
        print(f"User {email} is not an admin (role={user.role}). Only admins can be updated.")
        db.close()
        sys.exit(1)

    # CLI mode: apply only provided args
    if args.scope_level is not None or args.district is not None or args.sector is not None or args.cell is not None or args.category is not None:
        if args.scope_level is not None:
            user.admin_scope_level = args.scope_level
        if args.district is not None:
            user.scope_district = args.district.strip() or None
        if args.sector is not None:
            user.scope_sector = args.sector.strip() or None
        if args.cell is not None:
            user.scope_cell = args.cell.strip() or None
        if args.category is not None:
            user.admin_category = args.category.strip() if args.category.strip() in ALLOWED_CATEGORIES else None
        db.commit()
        db.refresh(user)
        print(f"Updated admin {email}: scope_level={getattr(user, 'admin_scope_level', None)}, "
              f"district={getattr(user, 'scope_district', None)}, sector={getattr(user, 'scope_sector', None)}, "
              f"cell={getattr(user, 'scope_cell', None)}, category={user.admin_category}")
        db.close()
        return

    # Interactive mode
    print(f"\nUpdating admin: {user.full_name} ({email})")
    print(f"  Current: scope_level={getattr(user, 'admin_scope_level', None)}, "
          f"district={getattr(user, 'scope_district', None)}, sector={getattr(user, 'scope_sector', None)}, "
          f"cell={getattr(user, 'scope_cell', None)}, category={user.admin_category}\n")

    level = input("New scope level (all | district | sector | cell) [keep current]: ").strip().lower() or None
    if level and level in SCOPE_LEVELS:
        user.admin_scope_level = level

    district = input("New district name [keep current]: ").strip() or None
    if district is not None:
        user.scope_district = district if district else getattr(user, "scope_district", None)

    sector = input("New sector name [keep current]: ").strip() or None
    if sector is not None:
        user.scope_sector = sector if sector else getattr(user, "scope_sector", None)

    cell = input("New cell name [keep current]: ").strip() or None
    if cell is not None:
        user.scope_cell = cell if cell else getattr(user, "scope_cell", None)

    cat = input("New category (service_delivery, land_property, ... or empty for all) [keep current]: ").strip().lower() or None
    if cat is not None:
        user.admin_category = cat if cat in ALLOWED_CATEGORIES else getattr(user, "admin_category", None)

    db.commit()
    db.refresh(user)
    print(f"\nUpdated. New values: scope_level={getattr(user, 'admin_scope_level', None)}, "
          f"district={getattr(user, 'scope_district', None)}, sector={getattr(user, 'scope_sector', None)}, "
          f"cell={getattr(user, 'scope_cell', None)}, category={user.admin_category}")
    db.close()


if __name__ == "__main__":
    main()
