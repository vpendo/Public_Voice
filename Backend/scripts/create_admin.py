"""
Create an admin user from the command line. No Django needed.
Usage (from Backend folder):
  python -m scripts.create_admin
  python scripts/create_admin.py
Or with env vars: CREATE_ADMIN_EMAIL=admin@example.com CREATE_ADMIN_PASSWORD=secret python -m scripts.create_admin
"""
import getpass
import os
import sys

# Add project root so imports work
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from dotenv import load_dotenv
load_dotenv()

from models.base import init_db, SessionLocal
from models.user import User
from core.security import hash_password


def main() -> None:
    init_db()
    db = SessionLocal()

    email = os.getenv("CREATE_ADMIN_EMAIL") or input("Admin email: ").strip().lower()
    if not email:
        print("Email is required.")
        sys.exit(1)

    existing = db.query(User).filter(User.email == email).first()
    if existing:
        print(f"User with email {email} already exists.")
        db.close()
        sys.exit(1)

    full_name = os.getenv("CREATE_ADMIN_FULL_NAME") or input("Full name: ").strip()
    if not full_name:
        full_name = "Admin"

    password = os.getenv("CREATE_ADMIN_PASSWORD")
    if not password:
        password = getpass.getpass("Password (min 8 chars, 1 letter, 1 digit): ")
        password2 = getpass.getpass("Confirm password: ")
        if password != password2:
            print("Passwords do not match.")
            sys.exit(1)
    if len(password) < 8:
        print("Password must be at least 8 characters.")
        sys.exit(1)
    if not any(c.isdigit() for c in password) or not any(c.isalpha() for c in password):
        print("Password must contain at least one letter and one digit.")
        sys.exit(1)

    user = User(
        full_name=full_name,
        email=email,
        hashed_password=hash_password(password),
        role="Admin",
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    db.close()

    print(f"Admin created: id={user.id}, email={user.email}")


if __name__ == "__main__":
    main()
