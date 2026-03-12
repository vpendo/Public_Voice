# Public Voice

**Public Voice** is a civic engagement platform for Rwanda. Citizens report community issues in English or Kinyarwanda; the system translates and structures reports with AI so administrators can review and respond efficiently.

---

## Table of Contents

- [What is Public Voice?](#what-is-public-voice)
- [Quick Start](#quick-start)
- [How to Use the Platform](#how-to-use-the-platform)
- [Installation (Step by Step)](#installation-step-by-step)
- [Technology Stack](#technology-stack)
- [Deployment](#deployment)
- [Testing & Screenshots](#testing--screenshots)
- [Project Structure](#project-structure)
- [License](#license)

---

## What is Public Voice?

| Feature | Description |
|--------|-------------|
| **Citizen reporting** | Citizens register with **name, email, and password**, verify their email via OTP, then log in and submit community issues (e.g. water, roads, land, administration). |
| **AI-powered reports** | Report text (including Kinyarwanda) is sent to **OpenAI** for translation and structuring. Admins see both the original text and a clear English summary with suggested category and urgency. |
| **Admin dashboard** | Administrators log in with **email and password** (and email OTP), view all reports, filter by status, and respond with updates. |
| **Multi-language UI** | Frontend supports English and Kinyarwanda for a broader reach. |

**Live links**

- **App:** [publicvoice1.netlify.app](https://publicvoice1.netlify.app)
- **API docs:** [public-voice1.onrender.com/docs](https://public-voice1.onrender.com/docs)
- **Demo video:** [Google Drive](https://drive.google.com/file/d/1pxpAqEp2TsBnOkESI6ZwRrnRnn7_e3JC/view?usp=sharing)

---

## Quick Start

1. **Clone and open the project**
   ```bash
   git clone https://github.com/vpendo/Public_Voice.git
   cd Public_Voice
   ```

2. **Backend** (from repo root)
   ```bash
   cd Backend
   python -m venv venv
   # Windows: venv\Scripts\activate
   # macOS/Linux: source venv/bin/activate
   pip install -r requirements.txt
   copy .env.example .env   # then edit .env (see Backend/README.md)
   python -m scripts.create_admin   # create an admin account
   uvicorn main:app --reload --host 0.0.0.0 --port 8000
   ```
   API: **http://localhost:8000** · Docs: **http://localhost:8000/docs**

3. **Frontend** (new terminal)
   ```bash
   cd Frontend
   pnpm install
   pnpm dev
   ```
   App: **http://localhost:5173**

4. **Try it**
   - Register as a citizen (name, email, password) → verify email → log in → submit a report.
   - Log in as admin (email + password from `create_admin`) → verify OTP → open dashboard and respond to reports.

---

## How to Use the Platform

### For Citizens

| Step | Action |
|------|--------|
| 1. **Register** | Click **Register** → enter **full name**, **email**, and **password** (min 8 characters, one letter and one digit). |
| 2. **Verify email** | Check your email for a 6-digit code (or use the code shown in dev mode). Enter it on the verify-email page. |
| 3. **Log in** | Use your **email** and **password**. A second code is sent to your email; enter it to complete login. |
| 4. **Submit an issue** | Go to **Submit Issue** (or **Report**). Fill in the form (description can be in English or Kinyarwanda). Submit. |
| 5. **Track reports** | Open **My Issues** to see your reports, their status, and any admin responses. |

**Forgot password?** On the login page, click **Forgot password?** → enter your email → use the code sent by email and set a new password on the reset page.

### For Administrators

| Step | Action |
|------|--------|
| 1. **Log in** | Use the **email** and **password** created via `python -m scripts.create_admin`. |
| 2. **Verify OTP** | Enter the 6-digit code sent to your admin email. |
| 3. **Dashboard** | View statistics and recent reports. |
| 4. **All issues** | Browse, filter, and search all citizen reports. |
| 5. **Respond** | Open a report → add a response and update status (e.g. pending → in progress → resolved). |
| 6. **Users** | View registered users if the feature is enabled. |

Admins see both the **raw** citizen text and the **AI-structured** summary (when OpenAI is configured).

---

## Installation (Step by Step)

### Prerequisites

- **Node.js** 18+ and **pnpm** (or npm)
- **Python** 3.10+ and **pip**
- **PostgreSQL** (optional; SQLite used if `DATABASE_URL` is not set)

### Step 1: Clone

```bash
git clone https://github.com/vpendo/Public_Voice.git
cd Public_Voice
```

### Step 2: Backend

```bash
cd Backend
python -m venv venv
```

Activate the virtual environment:

- **Windows:** `venv\Scripts\activate`
- **macOS/Linux:** `source venv/bin/activate`

```bash
pip install -r requirements.txt
copy .env.example .env   # Windows
# cp .env.example .env   # macOS/Linux
```

Edit **`.env`** (see [Backend/README.md](Backend/README.md) for full list):

- **Required:** `SECRET_KEY` (e.g. `openssl rand -hex 32`)
- **Optional:** `DATABASE_URL`, `CORS_ORIGINS`, `OPENAI_API_KEY`, SMTP for email OTP

Create an admin user:

```bash
python -m scripts.create_admin
```

Start the backend:

```bash
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

- API: **http://localhost:8000**
- Interactive docs: **http://localhost:8000/docs**

### Step 3: Frontend

Open a **new** terminal:

```bash
cd Public_Voice/Frontend
pnpm install
```

Optional: create **`.env`**:

```env
VITE_API_URL=http://127.0.0.1:8000
```

Start the frontend:

```bash
pnpm dev
```

App: **http://localhost:5173**

### Step 4: Verify

1. Open http://localhost:5173.
2. Register (name, email, password) → verify email → log in with email + password + OTP.
3. Submit a report.
4. Log in as admin (email + password from `create_admin`) → OTP → dashboard.
5. Open a report and add a response.

---

## Technology Stack

| Layer | Technologies |
|-------|--------------|
| **Frontend** | React 19, TypeScript, Vite, Tailwind CSS, React Router, Axios |
| **Backend** | FastAPI, Python 3.10+, JWT, bcrypt |
| **Database** | SQLite (dev) / PostgreSQL (production) |
| **AI** | OpenAI API (translation and structuring of report text) |
| **Email** | SMTP (OTP for registration, login, and password reset) |

---

## Deployment

| Component | Service | URL |
|------------|---------|-----|
| **Frontend** | Netlify | [publicvoice1.netlify.app](https://publicvoice1.netlify.app) |
| **Backend** | Render | [public-voice1.onrender.com](https://public-voice1.onrender.com) |
| **API docs** | Render | [public-voice1.onrender.com/docs](https://public-voice1.onrender.com/docs) |

**Frontend (Netlify):** Connect repo → base directory `Frontend` → build `pnpm install && pnpm build` → publish `Frontend/dist` → set `VITE_API_URL` to backend URL.

**Backend (Render):** Web Service → root `Backend` → build `pip install -r requirements.txt` → start `uvicorn main:app --host 0.0.0.0 --port $PORT` → set env vars (`SECRET_KEY`, `DATABASE_URL`, `OPENAI_API_KEY`, `CORS_ORIGINS`, etc.).

---

## Testing & Screenshots

Backend tests (pytest):

```bash
cd Backend && pytest tests/ -v
```

Manual testing: use the [API docs](http://localhost:8000/docs) (Swagger) for registration, login, and reports.

Screenshots and testing notes are in the repository (e.g. Tests, Register API, OTP, report creation, admin views, mobile responsiveness). The app is responsive and works on mobile viewports.

---

## Project Structure

| Purpose | Location |
|---------|----------|
| **Main docs** | This file (`README.md`) |
| **Backend API** | `Backend/main.py`, `Backend/routers/` |
| **Auth (email/password + OTP)** | `Backend/routers/auth.py` |
| **Reports & AI** | `Backend/routers/reports.py`, `Backend/services/ai_processor.py` |
| **Database models** | `Backend/models/` |
| **Backend config** | `Backend/.env`, `Backend/.env.example` |
| **Frontend app** | `Frontend/src/` |
| **Pages (Login, Register, Dashboards)** | `Frontend/src/Pages/` |
| **API client & auth context** | `Frontend/src/api/`, `Frontend/src/contexts/AuthContext.tsx` |
| **Frontend config** | `Frontend/.env` |

For more detail, see [Backend/README.md](Backend/README.md) and [Frontend/README.md](Frontend/README.md).

---

## License

MIT License
