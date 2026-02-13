# PublicVoice


## Description

**PublicVoice** is a civic engagement platform that enables citizens in Rwanda to report community problems and allows local authorities to receive, categorize, and respond to those reports. It strengthens transparency, accountability, and data-driven governance.

### Features

- **Citizens (Users)**  
  - Register and log in  
  - Submit issues (name, phone, location, institution, category, description)  
  - View and track their submitted issues (My Issues)  
  - View admin responses and status (pending / resolved / rejected)  
  - Profile and language switch (English / Kinyarwanda)

- **Administrators (Admins)**  
  - Log in only (no public registration; admins are created via backend script)  
  - Dashboard with statistics, charts, and recent reports  
  - List all reports and users  
  - Update report status and add admin responses  
  - Respond list and per-issue response workflow  

- **Public**  
  - Home, Services, About, Contact  
  - Report a problem (optional auth; name can be pre-filled when logged in)  
  - Multi-language UI (English, Kinyarwanda)  

### Tech Stack

| Layer    | Technology |
|----------|------------|
| Frontend | React 19, TypeScript, Vite, Tailwind CSS, React Router, Axios |
| Backend  | FastAPI, Python 3.10+, JWT (HS256), bcrypt |
| Database | SQLite (dev) or PostgreSQL (production) |

---

## GitHub Repository

- **Repository:** [Add your GitHub repo link here]  
  Example: `https://github.com/your-username/Public_Voice`

---

## How to Set Up the Environment and Project

### Prerequisites

- **Node.js** 18+ (for frontend)
- **pnpm** or **npm** (frontend)
- **Python** 3.10+ and **pip** (backend)
- **PostgreSQL** (optional; app uses SQLite if `DATABASE_URL` is not set)

### 1. Clone the repository

```bash
git clone https://github.com/your-username/Public_Voice.git
cd Public_Voice
```

### 2. Backend setup

```bash
cd Backend
python -m venv venv
# Windows:
venv\Scripts\activate
# macOS/Linux:
# source venv/bin/activate

pip install -r requirements.txt
copy env.example .env   # Windows
# cp env.example .env   # macOS/Linux
```

Edit `.env`:

- Set `SECRET_KEY` (e.g. generate with `openssl rand -hex 32`)
- Optionally set `DATABASE_URL` for PostgreSQL; otherwise SQLite is used

Create an admin user (admins log in only; they do not use Register):

```bash
python -m scripts.create_admin
# Or with env vars (Windows PowerShell):
# $env:CREATE_ADMIN_EMAIL="admin@example.com"; $env:CREATE_ADMIN_PASSWORD="YourSecurePass1"; python -m scripts.create_admin
```

Run the API:

```bash
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

- API: http://localhost:8000  
- Swagger: http://localhost:8000/docs  

### 3. Frontend setup

Open a new terminal:

```bash
cd Public_Voice/Frontend
pnpm install
# Or: npm install
```

Optional: create `.env` and set backend URL:

```env
VITE_API_URL=http://127.0.0.1:8000
```

Run the app:

```bash
pnpm dev
# Or: npm run dev
```

- App: http://localhost:5173  

### 4. Verify

- Register a citizen account on the frontend, then log in → User dashboard.  
- Log in with the admin account created above → Admin dashboard.  
- Submit an issue as a user; respond as admin.

---

## Designs

This section should include your **design process and deliverables** (wireframes, mockups, style guides, and screenshots of the app).

### Design process and considerations

- **Wireframes / mockups:** Add links or images of Figma (or other) wireframes and high-fidelity mockups.  
- **Style guide:** Primary blue palette, typography (e.g. Poppins), spacing, and component patterns.  
- See **[DESIGN.md](./DESIGN.md)** in this repo for a written summary of UI design decisions and structure.

### Screenshots of the app interfaces

Place screenshots here (or in a `/docs` or `/designs` folder) and reference them:

| Screen           | Description                    |
|------------------|--------------------------------|
| Home             | Landing page, hero, services   |
| Login / Register | Auth pages with language switch|
| User Dashboard   | Overview, Submit Issue, My Issues |
| Admin Dashboard  | Stats, charts, recent reports  |
| Report form      | Submit issue (categories, etc.)|
| Issue detail     | Single issue with status and response |

**Suggested folder:** `docs/screenshots/` or `designs/` – add PNG/JPG files and link them in this README or in DESIGN.md.

---

## Deployment Plan

- **Frontend:** Static build (`pnpm build` → `dist/`). Deploy to **Netlify**, **Vercel**, or any static host. Configure redirects so SPA routing works (e.g. `/*` → `index.html`). Set `VITE_API_URL` to the production backend URL.  
- **Backend:** Run FastAPI on a cloud server or PaaS (e.g. **Railway**, **Render**, **AWS**, **GCP**). Use **PostgreSQL** in production; set `DATABASE_URL`, `SECRET_KEY`, and `CORS_ORIGINS` (frontend origin).  
- **Database:** Provision PostgreSQL (e.g. managed DB on Railway/Render/AWS). Run migrations or ensure tables exist (backend creates them on startup).  
- **CI/CD (optional):** GitHub Actions to run tests and deploy frontend/backend on push.

See **[DEPLOYMENT.md](./DEPLOYMENT.md)** for step-by-step deployment instructions and infrastructure notes.

---

## Video Demo (5–10 minutes)

- **Minimum 5 minutes, maximum 10 minutes.**  
- **Focus:** Demonstration of app functionalities (navigation, register/login, user vs admin flows, submitting an issue, viewing and responding as admin, language switch, key screens).  
- Keep introductions and research description brief; prioritize **showing the working software**.

---

## Project structure (code files)

```
Public_Voice/
├── README.md              # This file (description, setup, designs, deployment)
├── DESIGN.md              # UI design process, wireframes, style guide
├── DEPLOYMENT.md          # Deployment plan and infrastructure
├── Backend/
│   ├── core/              # config, security (JWT, bcrypt), deps
│   ├── models/            # User, Report (database schema)
│   ├── schemas/            # Pydantic (auth, report)
│   ├── routers/           # auth, reports, users
│   ├── scripts/           # create_admin, migrations, check_db
│   ├── main.py            # FastAPI app, CORS, lifespan
│   ├── requirements.txt
│   └── env.example
└── Frontend/
    ├── src/
    │   ├── Components/    # Navbar, Footer, Sidebar, LanguageSwitcher, etc.
    │   ├── Pages/         # Home, Login, Register, Report, Dashboard (user/admin)
    │   ├── Routes/        # approute.tsx
    │   ├── contexts/      # AuthContext, LanguageContext
    │   ├── i18n/          # content.ts (English, Kinyarwanda)
    │   └── api/           # client, config
    ├── package.json
    └── vite.config.ts
```

---

## Database schema (summary)

- **users:** `id`, `full_name`, `email`, `hashed_password`, `role` (User/Admin), `created_at`  
- **reports:** `id`, `user_id` (nullable), `title`, `name`, `phone`, `location`, `institution`, `category`, `raw_description`, `structured_description`, `admin_response`, `status` (pending/resolved/rejected), `created_at`  

Full schema and API details: see **Backend/README.md**.

---

## Rubric alignment (Initial Software Demo)

- **Review requirements & tools:** README and setup show use of React/TypeScript, FastAPI, and a relational database; tools match the FullStack track.  
- **Development environment setup:** Step-by-step backend (venv, `.env`, create_admin) and frontend (Node, pnpm, `VITE_API_URL`) instructions for a reproducible setup.  
- **Navigation & layout:** Clear routes (public, user dashboard, admin dashboard), sidebar layout, and protected routes; README and DESIGN.md describe navigation and layout.

---

## License

Part of the PublicVoice capstone project.
