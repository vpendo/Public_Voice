"""
Check if an admin has a password set.
Run: python -m scripts.check_admin_password EMAIL
"""
import os
import sys

sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from dotenv import load_dotenv
load_dotenv()

from models.base import SessionLocal
from models.user import User

def main():
    if len(sys.argv) < 2:
        print("Usage: python -m scripts.check_admin_password EMAIL")
        print("Example: python -m scripts.check_admin_password celladmin@gmail.com")
        sys.exit(1)
    
    email = sys.argv[1].strip().lower()
    
    db = SessionLocal()
    try:
        user = db.query(User).filter(User.email == email).first()
        if not user:
            print(f"[ERROR] No user found with email: {email}")
            sys.exit(1)
        
        print(f"User found: {user.full_name} (ID: {user.id}, Role: {user.role})")
        if user.hashed_password:
            print("[OK] Password is set")
        else:
            print("[WARNING] No password set for this user!")
            print("To set a password, run:")
            print(f"  python -m scripts.reset_admin_password {email} YOUR_PASSWORD")
    finally:
        db.close()

if __name__ == "__main__":
    main()
