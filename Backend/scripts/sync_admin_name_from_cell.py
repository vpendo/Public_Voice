"""
Set full_name to "{scope_cell} Cell Admin" so the displayed name matches the admin's cell.

Does not change email, password, or scope — only full_name.

Run from Backend folder with venv activated:

  python -m scripts.sync_admin_name_from_cell USER_ID [USER_ID ...]

  python -m scripts.sync_admin_name_from_cell --all-cell-admins

Examples:

  python -m scripts.sync_admin_name_from_cell 7 8
"""
import sys
from pathlib import Path

# Run from Backend: `python -m scripts.sync_admin_name_from_cell …`
sys.path.insert(0, str(Path(__file__).resolve().parent.parent))

from dotenv import load_dotenv

load_dotenv()  # Backend/.env → DATABASE_URL

from sqlalchemy import and_

from models.base import SessionLocal, init_db
from models.user import User


def main() -> None:
    args = sys.argv[1:]  # e.g. `7 8` or `--all-cell-admins`
    if not args:
        print("Usage: python -m scripts.sync_admin_name_from_cell USER_ID [USER_ID ...]")
        print("       python -m scripts.sync_admin_name_from_cell --all-cell-admins")
        print("Example: python -m scripts.sync_admin_name_from_cell 7 8")
        sys.exit(1)

    init_db()
    db = SessionLocal()
    try:
        if args[0] == "--all-cell-admins":
            # Every admin row scoped to a cell with scope_cell set
            users = (
                db.query(User)
                .filter(
                    and_(
                        User.admin_scope_level.isnot(None),
                        User.admin_scope_level.ilike("cell"),
                        User.scope_cell.isnot(None),
                        User.scope_cell != "",
                    )
                )
                .all()
            )
            if not users:
                print("No users found with admin_scope_level=cell and scope_cell set.")
                return
        else:
            # Explicit numeric ids from CLI
            ids: list[int] = []
            for a in args:
                try:
                    ids.append(int(a.strip()))
                except ValueError:
                    print(f"Invalid user id: {a!r}")
                    sys.exit(1)
            users = db.query(User).filter(User.id.in_(ids)).all()
            found = {u.id for u in users}
            for i in ids:
                if i not in found:
                    print(f"[skip] No user with id={i}")

        updated = 0
        for user in users:
            # Pattern matches existing seeded admins (e.g. "Nyarutarama Cell Admin")
            cell = (getattr(user, "scope_cell", None) or "").strip()
            if not cell:
                print(f"[skip] id={user.id}: no scope_cell, name unchanged ({user.full_name!r})")
                continue
            new_name = f"{cell} Cell Admin"
            if user.full_name == new_name:
                print(f"[ok] id={user.id}: already {new_name!r}")
                continue
            old = user.full_name
            user.full_name = new_name
            updated += 1
            print(f"[updated] id={user.id}: {old!r} -> {new_name!r}")

        if updated:
            db.commit()
            print(f"Committed {updated} change(s).")
        else:
            db.rollback()  # No-op if everything was already correct
    finally:
        db.close()


if __name__ == "__main__":
    main()
