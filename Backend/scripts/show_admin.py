"""
Print the admin account(s) so you can remember which email/password to use for admin login.
Run from Backend folder with venv activated: python -m scripts.show_admin
"""
import os
import sys

sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from models.base import init_db, SessionLocal
from models.user import User


def main() -> None:
    init_db()
    db = SessionLocal()

    admins = db.query(User).filter(User.role == "Admin").all()
    db.close()

    if not admins:
        print("No admin account found. Create one with: python -m scripts.create_admin")
        sys.exit(1)

    print("Admin account(s) – use this email to log in as admin:\n")
    for u in admins:
        print(f"  ID:       {u.id}")
        print(f"  Email:    {u.email}")
        print(f"  Name:     {u.full_name}")
        print()


if __name__ == "__main__":
    main()
