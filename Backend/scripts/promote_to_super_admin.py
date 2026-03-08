"""
Promote an existing admin to SuperAdmin.
This gives them full system access.

Usage:
    python -m scripts.promote_to_super_admin EMAIL

Example:
    python -m scripts.promote_to_super_admin admin@example.com
"""
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent.parent))

from dotenv import load_dotenv
load_dotenv()

from models.base import SessionLocal
from models.user import User


def main() -> None:
    if len(sys.argv) < 2:
        print("Usage: python -m scripts.promote_to_super_admin EMAIL")
        print("Example: python -m scripts.promote_to_super_admin admin@example.com")
        sys.exit(1)

    email = sys.argv[1].strip().lower()
    
    db = SessionLocal()
    
    try:
        user = db.query(User).filter(User.email == email).first()
        
        if not user:
            print(f"Error: No user found with email '{email}'")
            sys.exit(1)
        
        if user.role == "SuperAdmin":
            print(f"User '{email}' is already a SuperAdmin.")
            return
        
        print(f"Current user info:")
        print(f"  Email: {user.email}")
        print(f"  Full Name: {user.full_name}")
        print(f"  Current Role: {user.role}")
        print(f"  Scope: {user.admin_scope_level or 'all'}")
        
        # Confirm promotion
        if len(sys.argv) < 3 or sys.argv[2] != "--yes":
            response = input(f"\nPromote this user to SuperAdmin? (yes/no): ").strip().lower()
            if response != "yes":
                print("Cancelled.")
                return
        
        # Promote to SuperAdmin
        user.role = "SuperAdmin"
        user.admin_scope_level = "all"
        db.commit()
        db.refresh(user)
        
        print(f"\n✓ User '{email}' has been promoted to SuperAdmin!")
        print(f"  New Role: {user.role}")
        print(f"  Scope: All areas (System Manager)")
        
    except Exception as e:
        print(f"Error promoting user: {e}")
        db.rollback()
        sys.exit(1)
    finally:
        db.close()


if __name__ == "__main__":
    main()
