"""
Set email and password for a user by primary key (e.g. fix an admin row).

Run from Backend folder with venv activated:
  python -m scripts.update_admin_by_id USER_ID EMAIL NEW_PASSWORD [SCOPE_SECTOR] [SCOPE_CELL]

Optional SCOPE_SECTOR / SCOPE_CELL update users.scope_sector and users.scope_cell (scoped admins).
Use the same spelling as the report form (e.g. Nyamirambo, Rugarama). If you set cell, pass sector too (6 args).

Examples:
  python -m scripts.update_admin_by_id 7 admin@example.com MyNewPass123
  python -m scripts.update_admin_by_id 8 rugaramacell@gmail.com Rugarama123 Nyamirambo
  python -m scripts.update_admin_by_id 8 rugaramacell@gmail.com Rugarama123 Nyamirambo Rugarama
"""
import sys
from pathlib import Path

# So `models` / `core` resolve when run as `python -m scripts.update_admin_by_id`
sys.path.insert(0, str(Path(__file__).resolve().parent.parent))

from dotenv import load_dotenv

load_dotenv()  # Reads Backend/.env (same DB as the API)

from models.base import SessionLocal, init_db
from models.user import User
from core.security import hash_password


def main() -> None:
    # Required: user_id email password | Optional 5th=scope_sector, 6th=scope_cell
    if len(sys.argv) < 4:
        print("Usage: python -m scripts.update_admin_by_id USER_ID EMAIL NEW_PASSWORD [SCOPE_SECTOR] [SCOPE_CELL]")
        print("Example: python -m scripts.update_admin_by_id 7 admin@example.com MyNewPass123")
        print("Example: python -m scripts.update_admin_by_id 8 a@b.com Pass123 Nyamirambo Rugarama")
        sys.exit(1)

    try:
        user_id = int(sys.argv[1].strip())
    except ValueError:
        print("USER_ID must be an integer.")
        sys.exit(1)

    email = sys.argv[2].strip().lower()
    password = sys.argv[3]
    # Match report-form spelling (filters use ilike, but keep names consistent)
    scope_sector = sys.argv[4].strip() if len(sys.argv) >= 5 and sys.argv[4].strip() else None
    scope_cell = sys.argv[5].strip() if len(sys.argv) >= 6 and sys.argv[5].strip() else None

    # Aligned with API / reset_admin_password validation
    if len(password) < 8 or not any(c.isdigit() for c in password) or not any(c.isalpha() for c in password):
        print("Password must be at least 8 characters with at least one letter and one digit.")
        sys.exit(1)

    init_db()
    db = SessionLocal()
    try:
        user = db.query(User).filter(User.id == user_id).first()
        if not user:
            print(f"No user found with id={user_id}")
            sys.exit(1)

        # users.email is unique — block if another row already has this address
        other = db.query(User).filter(User.email == email, User.id != user_id).first()
        if other:
            print(f"Email already in use by user id={other.id}")
            sys.exit(1)

        user.email = email
        user.hashed_password = hash_password(password)  # Never store plain text
        if scope_sector is not None:
            user.scope_sector = scope_sector
        if scope_cell is not None:
            user.scope_cell = scope_cell
        db.add(user)
        db.commit()
        # Echo scope in stdout for quick verification
        sec = getattr(user, "scope_sector", None)
        cell = getattr(user, "scope_cell", None)
        extra = []
        if sec:
            extra.append(f"scope_sector={sec}")
        if cell:
            extra.append(f"scope_cell={cell}")
        suffix = (", " + ", ".join(extra)) if extra else ""
        print(f"Updated id={user_id}: email={user.email}, role={user.role}, name={user.full_name}{suffix}")
    finally:
        db.close()


if __name__ == "__main__":
    main()
