# Public Voice — Backend

FastAPI backend for the **Public Voice** civic engagement platform. Handles authentication (email/password + OTP), citizen reports, AI-powered translation and structuring, and admin responses.

---

## Table of Contents

- [Prerequisites](#prerequisites)
- [Install & Run](#install--run)
- [Configuration (.env)](#configuration-env)
- [Authentication Flow](#authentication-flow)
- [API Endpoints](#api-endpoints)
- [Report AI](#report-ai)
- [Testing](#testing)
- [Deployment (Render)](#deployment-render)
- [Project Structure](#project-structure)

---

## Prerequisites

- **Python 3.10+**
- **pip**
- **PostgreSQL** (required for database).

---

## Install & Run

```bash
cd Public_Voice/Backend
python -m venv venv
```

**Activate the virtual environment:**

| OS | Command |
|----|---------|
| Windows | `venv\Scripts\activate` |
           |`source venv/Scripts/activate`|
| macOS / Linux | `source venv/bin/activate` |

```bash
pip install -r requirements.txt
copy .env.example .env   # Windows
# cp .env.example .env   # macOS/Linux
```

Edit **`.env`** (see [Configuration](#configuration-env) below), then:

```bash
# Create an admin user (interactive or CLI)
python -m scripts.create_admin

# Start the API server
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

- **API base:** http://localhost:8000  
- **Interactive docs (Swagger):** http://localhost:8000/docs  
- **ReDoc:** http://localhost:8000/redoc  

---

## Configuration (.env)

Copy `.env.example` to `.env` and adjust as needed.

### Required

| Variable | Description |
|----------|-------------|
| `SECRET_KEY` | Secret for JWT signing. Generate with: `openssl rand -hex 32` |

### Database

| Variable | Description |
|----------|-------------|
| `DATABASE_URL` | PostgreSQL connection URL (e.g. `postgresql://user:pass@host:5432/publicvoice`). |

### Security & CORS

| Variable | Description |
|----------|-------------|
| `ALGORITHM` | JWT algorithm (default `HS256`). |
| `ACCESS_TOKEN_EXPIRE_MINUTES` | Token lifetime (default `30`). |
| `CORS_ORIGINS` | Comma-separated frontend origins (e.g. `http://localhost:5173`, `https://publicvoice1.netlify.app`). |

### AI (Report translation / structuring)

| Variable | Description |
|----------|-------------|
| `OPENAI_API_KEY` | OpenAI API key (if your deployment uses OpenAI-based translation path). |
| `OPENAI_MODEL` | OpenAI model to use (default `gpt-4o-mini`). |
| `OPENAI_API_BASE` | Optional OpenAI base URL override (e.g. Azure OpenAI). |
| `ANTHROPIC_API_KEY` | Claude API key (if your deployment uses Claude-based translation path). |
| `CLAUDE_MODEL` | Claude model ID (e.g. `claude-sonnet-4-5`). |

If AI credentials are missing or request fails (e.g. quota), reports are still saved with the raw description only.

### Email (OTP & password reset)

| Variable | Description |
|----------|-------------|
| `SMTP_HOST` | SMTP server host. |
| `SMTP_PORT` | SMTP port (e.g. `587`). |
| `SMTP_USER` | SMTP username. |
| `SMTP_PASSWORD` | SMTP password. |
| `SMTP_FROM_EMAIL` | From address for outgoing email. |
| `FRONTEND_URL` | Base URL of frontend (e.g. for reset-password links). |
| `EMAIL_SMTP_SERVER` | Alternative SMTP host variable name (supported). |
| `EMAIL_SMTP_PORT` | Alternative SMTP port variable name (supported). |
| `EMAIL_LOGIN` | Alternative SMTP login username (supported). |
| `EMAIL_SENDER_EMAIL` | Alternative sender email variable name (supported). |
| `EMAIL_SENDER_PASSWORD` | Alternative SMTP password variable name (supported). |

Recommended `.env` example (Dynadot mail):

```env
EMAIL_SMTP_SERVER=webhost.dynadot.com
EMAIL_SMTP_PORT=587
EMAIL_LOGIN=security@nexventures.net
EMAIL_SENDER_EMAIL=security@nexventures.net
EMAIL_SENDER_PASSWORD=<YOUR_EMAIL_PASSWORD>
```

OpenAI `.env` example (if using OpenAI translation path):

```env
OPENAI_API_KEY=<YOUR_OPENAI_API_KEY>
OPENAI_MODEL=gpt-4o-mini
# OPENAI_API_BASE=https://api.openai.com/v1
```

If SMTP is not configured, OTP codes are still generated; in development they may be returned in the API response or logged.

**OTP not arriving in inbox?**

1. **Check backend logs** when you start the server. You should see either:
   - `SMTP configured: OTP and password-reset emails will be sent to users.` — SMTP is on; if email still doesn’t arrive, see below.
   - `SMTP not configured...` — Add `SMTP_HOST`, `SMTP_USER`, and `SMTP_PASSWORD` to your `.env` (see `.env.example` for Gmail/SendGrid examples).
2. **Gmail:** Use an [App Password](https://support.google.com/accounts/answer/185833), not your normal password. Set `SMTP_HOST=smtp.gmail.com`, `SMTP_PORT=587`, `SMTP_USE_TLS=true`.
3. **Check spam/junk** and “Promotions” (Gmail). The first time can be delayed.
4. **If send fails**, the backend logs the error (e.g. authentication failed, connection refused). Fix the SMTP settings and try again.

### Admin creation (optional)

| Variable | Description |
|----------|-------------|
| `CREATE_ADMIN_EMAIL` | Default admin email when using the create_admin script. |
| `CREATE_ADMIN_PASSWORD` | Default admin password. |
| `CREATE_ADMIN_FULL_NAME` | Default admin full name. |

## Authentication Flow

All users (citizens and admins) use **email and password**, with **email OTP** for verification.

### Registration (citizens)

1. **POST /api/auth/register**  
   Body: `full_name`, `email`, `password`.  
   Response: `message`, `email`, and optionally `dev_otp` (in dev or if email not sent).
2. User receives a 6-digit OTP by email (if SMTP is configured).
3. **POST /api/auth/verify-email**  
   Body: `email`, `code`.  
   Marks the account as verified.
4. User can then log in.

### Login (citizens and admins)

1. **POST /api/auth/login**  
   Body: `email`, `password`.  
   Response: `requires_otp: true`, `email`, and optionally `dev_otp`.
2. User receives a 6-digit OTP by email.
3. **POST /api/auth/login/verify-otp**  
   Body: `email`, `code`.  
   Response: `access_token`, `user`, `is_admin`. Use the token in the `Authorization: Bearer <token>` header for protected routes.

### Password reset

1. **POST /api/auth/forgot-password**  
   Body: `email`.  
   Sends a 6-digit OTP to that email (if the account exists).
2. **POST /api/auth/reset-password**  
   Body: `email`, `code`, `new_password`.  
   Resets the password; user can then log in with the new password.

### Resend verification OTP

- **POST /api/auth/resend-otp**  
  Body: `email`.  
  Resends the registration verification OTP to the given email.

---

## API Endpoints

### Auth

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register (name, email, password). |
| POST | `/api/auth/verify-email` | Verify email with OTP after registration. |
| POST | `/api/auth/login` | Login (email, password); returns OTP requirement. |
| POST | `/api/auth/login/verify-otp` | Complete login with email OTP. |
| POST | `/api/auth/resend-otp` | Resend registration verification OTP. |
| GET | `/api/auth/me` | Current user (requires Bearer token). |
| PATCH | `/api/auth/me` | Update profile (e.g. name, avatar). |
| POST | `/api/auth/forgot-password` | Request password-reset OTP. |
| POST | `/api/auth/reset-password` | Reset password with email + OTP + new password. |

### Reports

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/reports` | Submit a report (citizen; requires auth). |
| GET | `/api/reports/mine` | List current user's reports. |
| GET | `/api/reports` | List all reports (admin). |
| GET | `/api/reports/{id}` | Get one report by ID. |
| PATCH | `/api/reports/{id}/respond` | Add response and update status (admin). |

### Health

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api` | Health check; includes `ai_translation_enabled`. |

---

## Report AI

When a citizen **submits a report**:

1. The backend sends report text to the configured AI provider (OpenAI or Claude, depending on your code path and env setup).
2. The model returns a structured version: translated/formal English summary, suggested category, institution, urgency, etc.
3. The report is stored with both **raw_description** (original text) and **structured_description** (AI output).

**If AI provider is not configured or the request fails** (e.g. quota, network), the report is still created with the raw description only; no 500 is returned for quota/configuration issues.

**As admin:** In the report detail view you see the original text and, when available, the “Structured report (AI)” section.

**Checklist if AI summary is missing:**

1. Set the required AI key(s) in `.env` (`OPENAI_API_KEY` or `ANTHROPIC_API_KEY`, depending on your active path).
2. Restart the backend.
3. Submit a **new** report (AI runs only on create).
4. Check logs for the active provider call message and for “AI translation unavailable”.

---

## Testing

```bash
# From Backend directory, with venv activated
pytest tests/ -v
```

Tests cover auth (register, verify-email, login, verify-otp), reports, and API behaviour. Use the same `.env` (or test DB) as needed for integration-style tests.

---

## Deployment (Render)

1. Create a **Web Service** on [Render](https://render.com).
2. Connect your GitHub repository.
3. Set **Root directory** to `Backend`.
4. **Build command:** `pip install -r requirements.txt`
5. **Start command:** `uvicorn main:app --host 0.0.0.0 --port $PORT`
6. Add **environment variables** (e.g. `SECRET_KEY`, `DATABASE_URL`, AI key(s), `CORS_ORIGINS`, SMTP, etc.). Do not commit `.env`; use Render’s UI or secrets.

Ensure `CORS_ORIGINS` includes your production frontend URL (e.g. `https://publicvoice1.netlify.app`).

---

## Project Structure

```
Backend/
├── main.py              # FastAPI app, lifespan, CORS
├── core/
│   ├── config.py        # Settings from .env
│   ├── deps.py          # get_current_user, get_current_admin
│   ├── security.py      # JWT, password hashing
│   └── email.py         # SMTP OTP and password-reset emails
├── models/
│   ├── base.py          # DB engine, session, init_db
│   ├── user.py          # User model
│   ├── report.py        # Report model
│   └── otp.py           # OTP model (email)
├── routers/
│   ├── auth.py          # Register, login, verify-email, verify-otp, forgot/reset password
│   ├── reports.py       # Create, list, get, respond
│   ├── users.py         # User listing (admin)
│   └── upload.py        # File uploads
├── schemas/
│   ├── auth.py          # Request/response models for auth
│   └── report.py        # Report request/response
├── services/
│   ├── ai_processor.py  # AI translation/structuring
│   └── notify.py       # Notifications
├── scripts/
│   └── create_admin.py  # Create admin user
├── tests/
├── .env.example
└── requirements.txt
```

For full platform documentation, see the [main README](../README.md).
