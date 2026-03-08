"""
Troubleshoot admin login issues.
This script checks:
1. If the admin account exists
2. If the admin has a password set
3. If the email is correct
4. Provides steps to reset password if needed
"""
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent.parent))

from dotenv import load_dotenv
load_dotenv()

from models.base import SessionLocal
from models.user import User


def main():
    if len(sys.argv) < 2:
        print("Usage: python -m scripts.troubleshoot_admin_login EMAIL")
        print("Example: python -m scripts.troubleshoot_admin_login celladmin@gmail.com")
        sys.exit(1)
    
    email = sys.argv[1].strip().lower()
    
    db = SessionLocal()
    try:
        user = db.query(User).filter(User.email == email).first()
        
        if not user:
            print(f"[FAILED] No user found with email: {email}")
            print("\nPossible issues:")
            print("1. Email is incorrect - check for typos")
            print("2. Admin account was deleted")
            print("\nTo create a new admin:")
            print("  python -m scripts.create_admin")
            sys.exit(1)
        
        print(f"[OK] User found: {user.full_name} (ID: {user.id})")
        print(f"     Role: {user.role}")
        print(f"     Email: {user.email}")
        
        if user.role and user.role.strip().lower() != "admin":
            print(f"\n[WARNING] User role is '{user.role}', not 'admin'")
            print("This account may not have admin privileges.")
        
        if not user.hashed_password:
            print("\n[FAILED] This admin account has NO password set!")
            print("\nTo set a password, run:")
            print(f"  python -m scripts.reset_admin_password {email} YOUR_NEW_PASSWORD")
            print("\nExample:")
            print(f"  python -m scripts.reset_admin_password {email} AdminPass123")
            sys.exit(1)
        
        print("\n[OK] Admin account has a password set")
        print("\nIf login still fails:")
        print("1. Make sure you're entering the correct password")
        print("2. Check for typos in the email address")
        print("3. Try resetting the password:")
        print(f"   python -m scripts.reset_admin_password {email} NEW_PASSWORD")
        print("\n4. Make sure the backend server is running:")
        print("   uvicorn main:app --reload")
        
    finally:
        db.close()


if __name__ == "__main__":
    main()
