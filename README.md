# Public Voice

Public Voice is a civic engagement platform where citizens submit community issues and administrators review and respond in a dashboard.

Final demo video: [Watch on Google Drive](https://drive.google.com/file/d/1pnf19ncDDqMCTbKWDSqXHuouRdFsT1Vb/view?usp=sharing)

## What This README Covers

- How to install and run the project locally
- How citizens and admins use the platform
- Privacy Policy, Terms of Use, and registration acceptance
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
- `ANTHROPIC_API_KEY` (optional but recommended): enables report translation/structuring with Claude
- OTP email variables: either `SMTP_*` or `EMAIL_*`

If you need a new admin account (admins are not self-registered in the app):

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
6. From the home page footer, open **Privacy Policy** (`/privacy`) and **Terms of Use** (`/terms`) — they use the same public navbar and footer as the rest of the marketing site.

## Privacy Policy & Terms of Use

- **Public pages:** `http://localhost:5173/privacy` (PublicVoice Privacy Policy) and `http://localhost:5173/terms` (PublicVoice Terms of Use).
- **Footer:** Every public page with the site footer includes links to both documents.
- **Registration:** New citizens must read the notice, check the box to confirm they agree to the **Terms of Use** and **Privacy Policy**, and use the in-form links to open those pages before they can complete sign-up.
- **Disclaimer:** The legal text is provided for **academic / capstone demonstration** and is not a substitute for professional legal advice for production use.

## How The Project Works (Report Lifecycle)

Public Voice connects citizens and administrators using a simple flow:

1. Citizen creates an account and verifies it using email OTP.
2. Citizen logs in and receives access (JWT) to submit reports.
3. Citizen opens the report form, fills in issue details, location fields, and uploads evidence (optional).
4. Backend (FastAPI) creates a report, generates a tracking ID, saves the report in PostgreSQL, and stores uploaded evidence on the server.
5. If `ANTHROPIC_API_KEY` is configured, the backend sends the citizen’s description to Claude to translate/formalize and produce structured suggestions (summary/title/category/institution/urgency). If AI is not available, the report is still saved using the raw description.
6. Admin logs in and views reports in the admin dashboard (with role and scope control).
7. Admin updates the report status and adds an official response.
8. Citizen checks their dashboard to track the status and read the admin response.

Optional notifications: when SMTP is configured, the backend can send OTP emails (login/verify/reset) and may send an email alert to admins when a new report is submitted.

## How To Use The Platform

### Citizen Flow

1. Register with name, email, and password — accept the **Terms of Use** and **Privacy Policy** (required checkbox).
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
- `Backend/routers/users.py` - admin/user management endpoints
- `Backend/routers/upload.py` - upload/evidence handling endpoints
- `Backend/services/ai_processor.py` - translation/AI structuring
- `Backend/services/notify.py` - notification email when new reports are submitted
- `Backend/core/config.py` - environment/config loader
- `Backend/core/email.py` - SMTP email sender (OTP/password reset)
- `Backend/models/` - SQLAlchemy models
- `Backend/schemas/` - Pydantic schemas
- `Backend/tests/` - backend tests

### Frontend

- `Frontend/src/main.tsx` - React entry point
- `Frontend/src/Routes/approute.tsx` - routes (includes `/privacy`, `/terms`)
- `Frontend/src/Components/Footer.tsx` - footer with Privacy Policy & Terms of Use links
- `Frontend/src/Pages/PrivacyPolicy.tsx` - Privacy Policy page
- `Frontend/src/Pages/Terms.tsx` - Terms of Use page
- `Frontend/src/Pages/Register.tsx` - citizen sign-up (terms & privacy acceptance)
- `Frontend/src/Components/ReportForm.tsx` - report submission form
- `Frontend/src/Pages/Dashboard/user/` - user dashboard pages
- `Frontend/src/Pages/Dashboard/admin/` - admin dashboard pages
- `Frontend/src/contexts/AuthContext.tsx` - auth/session logic
- `Frontend/src/api/client.ts` - API client
- `Frontend/src/api/config.ts` - API base URL
- `Frontend/src/i18n/content.ts` - language content (includes registration legal strings)

### Configuration and Documentation

- `Backend/.env.example` - backend env template
- `Backend/README.md` - backend-specific setup and API notes
- `Frontend/README.md` - frontend-specific setup notes
- `README.md` - this main guide

## Demo / Seed Admin Accounts (for testing)

Administrators are created using backend scripts (the app does not register admins by itself).

Cell admins are scoped by district/sector/cell so they only manage reports from their area. SuperAdmin can manage all reports.

### Cell Admins

1. `rwimbogocell1@gmail.com`
   - Scope: `Kicukiro` district, `Nyarugunga` sector, `Rwimbogo` cell
2. `nyarutaramacell1@gmail.com`
   - Scope: `Gasabo` district, `Remera` sector, `Nyarutarama` cell
3. `rugaramacell@gmail.com`
   - Scope: `Nyarugenge` district, `Nyamirambo` sector, `Rugarama` cell

### SuperAdmin

1. `publicvoicerwanda@gmail.com`
   - Scope: all districts/sectors/cells (system manager)

### How to show / manage these admins

Because admins are seeded directly in the database, you can view what exists (emails, roles, and scopes) using:

```bash
cd Backend
python -m scripts.show_admin
```

If you forget an admin password, you can reset it using:

```bash
python -m scripts.reset_admin_password EMAIL "NEW_PASSWORD"
```

To check whether an admin currently has a password set:

```bash
python -m scripts.check_admin_password EMAIL
```

## Helpful Commands

- Backend tests: `cd Backend && pytest tests/ -v`
- Frontend tests: `cd Frontend && pnpm test:run`
- Frontend lint: `cd Frontend && pnpm lint`
- Frontend production build: `cd Frontend && pnpm run build`
