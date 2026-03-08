"""
Create a SuperAdmin account.
SuperAdmin has full system access and can manage all users and admins.

Usage:
    python -m scripts.create_super_admin EMAIL "Full Name" PASSWORD

Example:
    python -m scripts.create_super_admin superadmin@publicvoice.com "Super Admin" SuperPass123
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
    if len(sys.argv) < 4:
        print("Usage: python -m scripts.create_super_admin EMAIL \"Full Name\" PASSWORD")
        print("Example: python -m scripts.create_super_admin superadmin@publicvoice.com \"Super Admin\" SuperPass123")
        sys.exit(1)

    email = sys.argv[1].strip().lower()
    full_name = sys.argv[2].strip()
    password = sys.argv[3]

    if len(password) < 8:
        print("Error: Password must be at least 8 characters long.")
        sys.exit(1)

    if not any(c.isdigit() for c in password) or not any(c.isalpha() for c in password):
        print("Error: Password must contain at least one letter and one digit.")
        sys.exit(1)

    init_db()
    db = SessionLocal()

    try:
        # Check if user with this email already exists
        existing = db.query(User).filter(User.email == email).first()
        if existing:
            print(f"Error: User with email '{email}' already exists.")
            print(f"  Current role: {existing.role}")
            if existing.role != "SuperAdmin":
                response = input(f"  Do you want to promote this user to SuperAdmin? (yes/no): ").strip().lower()
                if response == "yes":
                    existing.role = "SuperAdmin"
                    existing.hashed_password = hash_password(password)
                    existing.full_name = full_name
                    db.commit()
                    print(f"✓ User '{email}' has been promoted to SuperAdmin.")
                    print(f"  Password has been updated.")
                    return
                else:
                    print("Cancelled.")
                    return
            else:
                print("  This user is already a SuperAdmin.")
                return

        # Create new SuperAdmin
        user = User(
            full_name=full_name,
            email=email,
            hashed_password=hash_password(password),
            role="SuperAdmin",
            admin_scope_level="all",
            phone_verified=True,
        )
        db.add(user)
        db.commit()
        db.refresh(user)

        print(f"✓ SuperAdmin created successfully!")
        print(f"  ID: {user.id}")
        print(f"  Email: {user.email}")
        print(f"  Full Name: {user.full_name}")
        print(f"  Role: {user.role}")
        print(f"  Scope: All areas (System Manager)")
        print(f"\nYou can now log in with:")
        print(f"  Email: {email}")
        print(f"  Password: {password}")

    except Exception as e:
        print(f"Error creating SuperAdmin: {e}")
        db.rollback()
        sys.exit(1)
    finally:
        db.close()


if __name__ == "__main__":
    main()
