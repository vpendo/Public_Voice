"""
Reset an admin's password (when you forgot it).
Run from Backend folder: python -m scripts.reset_admin_password EMAIL NEW_PASSWORD
Example: python -m scripts.reset_admin_password admin@example.com MyNewPass123
"""
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent.parent))

from dotenv import load_dotenv
load_dotenv()

from models.base import init_db, SessionLocal
from models.user import User
from core.security import hash_password


def main() -> None:
    if len(sys.argv) < 3:
        print("Usage: python -m scripts.reset_admin_password EMAIL NEW_PASSWORD")
        print("Example: python -m scripts.reset_admin_password admin@example.com MyNewPass123")
        sys.exit(1)

    email = sys.argv[1].strip().lower()
    password = sys.argv[2]

    if len(password) < 8 or not any(c.isdigit() for c in password) or not any(c.isalpha() for c in password):
        print("Password must be at least 8 characters with at least one letter and one digit.")
        sys.exit(1)

    init_db()
    db = SessionLocal()
    user = db.query(User).filter(User.email == email).first()
    if not user:
        print(f"No user found with email: {email}")
        db.close()
        sys.exit(1)

    user.hashed_password = hash_password(password)
    db.add(user)
    db.commit()
    db.close()

    print(f"Password updated for {email}. You can now log in with the new password.")


if __name__ == "__main__":
    main()
