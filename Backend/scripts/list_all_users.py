"""
List ALL users in the database (id, email, role, admin_category).
Use this to see if your water/electricity admins exist and what their role is.
Run from Backend folder: python -m scripts.list_all_users
"""
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent.parent))

from dotenv import load_dotenv
load_dotenv()  # use same .env as create_admin so we see the same database

from models.base import init_db, SessionLocal
from models.user import User


def main() -> None:
    init_db()
    db = SessionLocal()
    users = db.query(User).order_by(User.id).all()
    db.close()

    if not users:
        print("No users in the database.")
        return

    print(f"All users ({len(users)} total):\n")
    for u in users:
        cat = getattr(u, "admin_category", None) or "-"
        print(f"  ID: {u.id}  |  Email: {u.email}  |  Role: {u.role}  |  Category: {cat}")
    print()


if __name__ == "__main__":
    main()
