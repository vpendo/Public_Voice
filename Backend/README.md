# PublicVoice Backend

FastAPI backend with **JWT authentication** and **validation** for the PublicVoice civic engagement platform. Aligned with the frontend: admin-only auth, public report submission, protected report listing.

## Features

- **JWT security**: Access tokens (HS256), password hashing with bcrypt
- **Auth**: Register (admin only), Login, `GET /api/auth/me` (protected)
- **Reports**: `POST /api/reports` (public), `GET /api/reports` and `GET /api/reports/{id}` (admin only)
- **Validation**: Pydantic schemas for all inputs; password strength rules
- **Database**: SQLite by default (dev), PostgreSQL via `DATABASE_URL`
- **CORS**: Configurable for frontend (e.g. `http://localhost:5173`)

## Prerequisites

- Python 3.10+
- pip

PostgreSQL is optional; the app uses SQLite if `DATABASE_URL` is not set.

## Installation

```bash
cd Public_Voice/Backend
python -m venv venv

# Windows
source venv/Scripts/activate


# macOS/Linux
source venv/bin/activate

pip install -r requirements.txt
```

## Configuration

1. Copy env example and edit:

```bash
# Windows
copy env.example .env
# macOS/Linux
cp env.example .env
```

2. In **production** set a strong `SECRET_KEY` (min 32 chars):

```bash
# Example: generate key
openssl rand -hex 32
```

3. Optional: use PostgreSQL by setting `DATABASE_URL` in `.env`. Otherwise SQLite is used (`./publicvoice.db`).

## Running

```bash
# Development (reload on file change)
uvicorn main:app --reload --host 0.0.0.0 --port 8000

# Or
python main.py
```

- **API**: http://localhost:8000  
- **Swagger**: http://localhost:8000/docs  
- **ReDoc**: http://localhost:8000/redoc  

## How to create an admin (no Django)

**Django is not used.** This backend is FastAPI + JWT. You can create admins in two ways:

### Option 1: From the frontend

1. Start the backend and frontend.
2. Open the **Register** page and sign up with name, email, and password.  
   That user is stored as **Admin** and can log in and use the dashboard.

### Option 2: Command-line script (first admin)

From the `Backend` folder with your venv activated:

```bash
python -m scripts.create_admin
```

You will be prompted for **email**, **full name**, and **password** (password is hidden). The script creates the database tables if needed, then creates one Admin user.

With environment variables (no prompts):

```bash
# Windows PowerShell
$env:CREATE_ADMIN_EMAIL="admin@example.com"; $env:CREATE_ADMIN_PASSWORD="YourSecurePass1"; python -m scripts.create_admin

# Windows CMD
set CREATE_ADMIN_EMAIL=admin@example.com
set CREATE_ADMIN_PASSWORD=YourSecurePass1
python -m scripts.create_admin

# macOS/Linux
CREATE_ADMIN_EMAIL=admin@example.com CREATE_ADMIN_PASSWORD=YourSecurePass1 python -m scripts.create_admin
```

Password rules (same as API): at least 8 characters, at least one letter and one digit.

## API Summary

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/auth/register` | No | Register admin (full_name, email, password) |
| POST | `/api/auth/login` | No | Login → `{ "access_token", "token_type", "expires_in_minutes" }` |
| GET | `/api/auth/me` | Bearer | Current user info |
| POST | `/api/reports` | No | Citizen submits report (name, phone, location, institution, category, description) |
| GET | `/api/reports` | Bearer | List reports (admin) |
| GET | `/api/reports/{id}` | Bearer | One report (admin) |

**Protected routes**: send header `Authorization: Bearer <access_token>`.

## Project Structure

```
Backend/
├── core/
│   ├── config.py      # Settings from env
│   ├── security.py    # JWT + password hashing
│   └── deps.py        # get_current_user (JWT), get_db
├── models/
│   ├── base.py        # Engine, Session, init_db
│   ├── user.py        # User (admin)
│   └── report.py      # Report
├── schemas/
│   ├── auth.py        # UserRegister, UserLogin, TokenResponse, UserResponse
│   └── report.py      # ReportCreate, ReportResponse
├── routers/
│   ├── auth.py        # register, login, me
│   └── reports.py     # create, list, get by id
├── main.py            # App, CORS, lifespan, routers
├── requirements.txt
├── env.example
└── README.md
```

## Security

- **Passwords**: bcrypt, never stored in plain text
- **JWT**: Signed with `SECRET_KEY`; set a long random key in production
- **Validation**: Pydantic on all request bodies; password must have length, letter, digit
- **Admin-only**: Register creates only Admin role; report list/detail require valid JWT and Admin role
- **CORS**: Restrict `CORS_ORIGINS` in production to your frontend domain

## Frontend Integration

- **Base URL**: `http://localhost:8000` (or your backend URL)
- **Register**: `POST /api/auth/register` with `{ "full_name", "email", "password" }`
- **Login**: `POST /api/auth/login` with `{ "email", "password" }` → store `access_token`
- **Report submit**: `POST /api/reports` with `{ "name", "phone", "location", "institution", "category", "description" }`
- **Dashboard**: `GET /api/reports` with header `Authorization: Bearer <access_token>`

## License

Part of the PublicVoice capstone project.
