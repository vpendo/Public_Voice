# Public Voice

Public Voice is a civic engagement platform where citizens submit community issues and administrators review and respond in a dashboard.

## What This README Covers

- How to install and run the project locally
- How citizens and admins use the platform
- Important project files and where features live

## Run The Project (Step By Step)

### 1. Prerequisites

- `Python` 3.10+
- `Node.js` 18+
- `pnpm`
- `PostgreSQL`

### 2. Clone The Repository

```bash
git clone https://github.com/vpendo/Public_Voice.git
cd Public_Voice
```

### 3. Start Backend API

```bash
cd Backend
python -m venv venv
```

Activate virtual environment:

- Windows: `venv\Scripts\activate`
- macOS/Linux: `source venv/bin/activate`

Install dependencies and create `.env`:

```bash
pip install -r requirements.txt
copy .env.example .env
```

Edit `Backend/.env` and set at minimum:

- `DATABASE_URL`
- `SECRET_KEY`
- AI key(s): `OPENAI_API_KEY` and/or `ANTHROPIC_API_KEY` (based on your active AI flow)
- OTP email variables: either `SMTP_*` or `EMAIL_*`

Create an admin user:

```bash
python -m scripts.create_admin
```

Run backend:

```bash
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

Backend URLs:

- API base: `http://127.0.0.1:8000`
- Swagger docs: `http://127.0.0.1:8000/docs`

### 4. Start Frontend App

Open a new terminal:

```bash
cd Frontend
pnpm install
```

Create `Frontend/.env`:

```env
VITE_API_URL=http://127.0.0.1:8000
```

Run frontend:

```bash
pnpm dev
```

Frontend URL:

- App: `http://localhost:5173`

### 5. Confirm Everything Works

1. Open `http://localhost:5173`
2. Register/login as a citizen
3. Submit a report
4. Login as admin
5. Check report appears in admin dashboard

## How To Use The Platform

### Citizen Flow

1. Register with name, email, and password
2. Verify account using email OTP
3. Login and submit a community issue
4. Track report status in user dashboard

### Admin Flow

1. Login with admin account
2. Verify OTP
3. Open dashboard and review submitted reports
4. Respond to reports and update status

## Related Project Files

### Backend

- `Backend/main.py` - FastAPI entry point
- `Backend/routers/auth.py` - login/register/OTP/reset endpoints
- `Backend/routers/reports.py` - report submit/list/respond endpoints
- `Backend/services/ai_processor.py` - translation/AI structuring
- `Backend/core/config.py` - environment/config loader
- `Backend/core/email.py` - SMTP email sender (OTP/password reset)
- `Backend/models/` - SQLAlchemy models
- `Backend/schemas/` - Pydantic schemas
- `Backend/tests/` - backend tests

### Frontend

- `Frontend/src/main.tsx` - React entry point
- `Frontend/src/Components/ReportForm.tsx` - report submission form
- `Frontend/src/Pages/Dashboard/user/` - user dashboard pages
- `Frontend/src/Pages/Dashboard/admin/` - admin dashboard pages
- `Frontend/src/contexts/AuthContext.tsx` - auth/session logic
- `Frontend/src/api/client.ts` - API client
- `Frontend/src/api/config.ts` - API base URL
- `Frontend/src/i18n/content.ts` - language content

### Configuration and Documentation

- `Backend/.env.example` - backend env template
- `Backend/README.md` - backend-specific setup and API notes
- `Frontend/README.md` - frontend-specific setup notes
- `README.md` - this main guide

## Helpful Commands

- Backend tests: `cd Backend && pytest tests/ -v`
- Frontend tests: `cd Frontend && pnpm test:run`
- Frontend lint: `cd Frontend && pnpm lint`
