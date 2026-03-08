"""
Print the admin account(s) so you can remember which email/password to use for admin login.
Run from Backend folder with venv activated: python -m scripts.show_admin
"""
import os
import sys

sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from dotenv import load_dotenv
load_dotenv()  # use same .env as create_admin so we see the same database

from sqlalchemy.exc import OperationalError
from core.config import settings
from models.base import SessionLocal
from models.user import User


def main() -> None:
    # Show database URL (masked password) for debugging
    db_url = settings.DATABASE_URL
    if db_url.startswith("postgresql://") or db_url.startswith("postgres://"):
        # Mask password in connection string
        if "@" in db_url and ":" in db_url.split("@")[0]:
            parts = db_url.split("@")
            user_pass = parts[0].split("://")[1]
            if ":" in user_pass:
                user = user_pass.split(":")[0]
                masked_url = db_url.replace(f":{user_pass.split(':')[1]}", ":****")
            else:
                masked_url = db_url
        else:
            masked_url = db_url
        print(f"Connecting to PostgreSQL: {masked_url.split('@')[1] if '@' in masked_url else masked_url}")
    else:
        print(f"Database URL: {db_url}")
    
    try:
        db = SessionLocal()
        print("[OK] Database connection successful\n")
    except OperationalError as e:
        error_msg = str(e)
        print("\n[ERROR] Database connection failed!")
        print("\nError details:")
        print(f"  {error_msg}")
        
        if "could not translate host name" in error_msg or "No such host is known" in error_msg:
            print("\nPossible causes:")
            print("  1. No internet connection")
            print("  2. Database hostname cannot be resolved (DNS issue)")
            print("  3. Render database service is paused or deleted")
            print("  4. Firewall/network blocking the connection")
            
            # Extract hostname from error
            if "host name" in error_msg:
                try:
                    host_part = error_msg.split("host name")[1].split("to")[0].strip().strip('"')
                    print(f"\n  Database host: {host_part}")
                    print(f"\n  Try testing DNS resolution:")
                    print(f"    ping {host_part}")
                    print(f"    or")
                    print(f"    nslookup {host_part}")
                except:
                    pass
            
            print("\nTroubleshooting steps:")
            print("  1. Check your internet connection")
            print("  2. Log into Render dashboard and verify PostgreSQL is running")
            print("  3. Check if the database was paused (free tier auto-pauses)")
            print("  4. Verify DATABASE_URL in .env matches your Render database")
            print("  5. Try restarting the database service in Render")
        elif "password authentication failed" in error_msg:
            print("\nPossible causes:")
            print("  1. Incorrect password in DATABASE_URL")
            print("  2. Database credentials changed")
            print("\n  Check your .env file and verify DATABASE_URL is correct")
        elif "connection refused" in error_msg.lower() or "connection timed out" in error_msg.lower():
            print("\nPossible causes:")
            print("  1. Database service is down")
            print("  2. Firewall blocking connection")
            print("  3. Database host is unreachable")
        else:
            print("\n  Check your DATABASE_URL in .env file")
            print("  Ensure PostgreSQL service is running and accessible")
        
        sys.exit(1)
    except Exception as e:
        print(f"\n[ERROR] Unexpected error: {e}")
        print(f"  Error type: {type(e).__name__}")
        sys.exit(1)

    try:
        # Show all users first to help debug
        all_users = db.query(User).all()
        print(f"Total users in database: {len(all_users)}")
        if all_users:
            print("\nAll users in database:")
            for u in all_users:
                print(f"  - ID: {u.id}, Email: {u.email}, Role: {u.role}")
            print()
        
        # Match "Admin" or "admin" (DB may store either)
        admins = db.query(User).filter(User.role.ilike("admin")).all()
    except Exception as e:
        print(f"Error querying database: {e}")
        db.close()
        sys.exit(1)
    finally:
        db.close()

    if not admins:
        print("=" * 60)
        print("No admin account found in this database!")
        print("=" * 60)
        print()
        print("Possible reasons:")
        print("  1. You're connected to a different database than before")
        print("  2. Admins were deleted")
        print("  3. Database was reset/recreated")
        print()
        print("Current database connection:")
        if db_url.startswith("postgresql://") or db_url.startswith("postgres://"):
            if "@" in db_url:
                host_part = db_url.split("@")[1].split("/")[0]
                if ":" in host_part:
                    hostname = host_part.split(":")[0]
                else:
                    hostname = host_part
                print(f"  PostgreSQL: {hostname}")
            else:
                print(f"  PostgreSQL: {db_url[:50]}...")
        else:
            print(f"  {db_url}")
        print()
        print("To create a new admin:")
        print("  python -m scripts.create_admin")
        print()
        sys.exit(1)

    print("Admin account(s) – use these emails to log in (admins do not register via the app):\n")
    for u in admins:
        cat = getattr(u, "admin_category", None) or "all (super admin)"
        scope_level = getattr(u, "admin_scope_level", None) or "all"
        scope_parts = []
        if getattr(u, "scope_district", None):
            scope_parts.append(f"District: {u.scope_district}")
        if getattr(u, "scope_sector", None):
            scope_parts.append(f"Sector: {u.scope_sector}")
        if getattr(u, "scope_cell", None):
            scope_parts.append(f"Cell: {u.scope_cell}")
        scope_info = f" ({', '.join(scope_parts)})" if scope_parts else ""
        
        print(f"  ID:       {u.id}")
        print(f"  Email:    {u.email}")
        print(f"  Name:     {u.full_name}")
        print(f"  Category: {cat}")
        if scope_level != "all" or scope_parts:
            print(f"  Scope:    {scope_level}{scope_info}")
        print()


if __name__ == "__main__":
    main()
