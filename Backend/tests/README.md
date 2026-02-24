# Backend tests (local)

Run API tests against an in-memory SQLite database (your dev DB is not used).

## Setup

From the `Backend` folder:

```bash
pip install -r requirements.txt
```

## Run all tests

```bash
cd Backend
pytest tests/ -v
```

## Run by file

```bash
pytest tests/test_auth.py -v
pytest tests/test_reports.py -v
```

## What is tested

- **test_auth.py**: Register, login, duplicate email, invalid credentials, `/api/auth/me` with/without token.
- **test_reports.py**: Create report (with different data), list mine, get one report, 401/403, validation (category, institution).
