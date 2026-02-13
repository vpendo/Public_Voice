# PublicVoice

## Description

**PublicVoice** is a civic engagement platform for Rwanda that connects citizens with local authorities. Citizens can report community issues (e.g. roads, water, security, sanitation) in **English or Kinyarwanda**; the platform uses **AI/NLP** to translate, rewrite into formal English, and structure reports so admins see clear, actionable content. It promotes transparency, accountability, and data-driven governance.

### What it does

- **Citizens** – Register, submit issues (with optional language switch EN/RW), track status, and read admin responses.
- **Admins** – Log in to a dedicated dashboard, view stats and all reports, respond to issues, and manage users. AI-processed reports show both the original submission and the structured (translated/formal) version.
- **Public** – Home, Services, About, Contact; report a problem; multi-language UI (English / Kinyarwanda).

---

## Technology Used

| Layer    | Technology |
|----------|------------|
| **Frontend** | React 19, TypeScript, Vite, Tailwind CSS, React Router, Axios |
| **Backend**  | FastAPI, Python 3.10+, JWT (HS256), bcrypt, Pydantic |
| **Database** | SQLite (development) or PostgreSQL (production) |
| **AI/NLP**   | OpenAI API (optional): translation Kinyarwanda → English, formal rewriting, structuring into JSON fields |

---

## GitHub Repository

- **Repository:** [https://github.com/vpendo/Public_Voice](https://github.com/vpendo/Public_Voice)

---

## How to Set Up the Environment and the Project

### Prerequisites

- **Node.js** 18+ and **pnpm** or **npm** (frontend)
- **Python** 3.10+ and **pip** (backend)
- **PostgreSQL** (optional; SQLite used if `DATABASE_URL` is not set)

### 1. Clone the repository

```bash
git clone https://github.com/vpendo/Public_Voice.git
cd Public_Voice
```

### 2. Frontend setup

```bash
cd Frontend
pnpm install
# Or: npm install
```

Create a `.env` file (optional; for local backend URL):

```env
VITE_API_URL=http://127.0.0.1:8000
```

Run the frontend:

```bash
pnpm dev
# Or: npm run dev
```

- **App:** http://localhost:5173

### 3. Backend setup

Open a new terminal:

```bash
cd Public_Voice/Backend
python -m venv venv
```

**Activate the virtual environment:**

- **Windows:** `venv\Scripts\activate`
- **macOS/Linux:** `source venv/bin/activate`

```bash
pip install -r requirements.txt
```

Copy environment file and edit:

```bash
# Windows
copy env.example .env
# macOS/Linux
cp env.example .env
```

Edit `.env`:

- **SECRET_KEY** – required (e.g. `openssl rand -hex 32`)
- **DATABASE_URL** – optional; omit for SQLite
- **CORS_ORIGINS** – e.g. `http://localhost:5173`
- **OPENAI_API_KEY** – optional; set for AI/NLP (translation, formal rewriting, structuring of reports)

Create an admin user (admins do not use Register; they log in only):

```bash
python -m scripts.create_admin
```

Run the API:

```bash
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

- **API:** http://localhost:8000  
- **Swagger:** http://localhost:8000/docs  

### 4. Verify

- Register a citizen account → User dashboard.
- Log in with the admin account → Admin dashboard.
- Submit an issue; respond as admin. If `OPENAI_API_KEY` is set, Kinyarwanda/informal text is processed and shown as “Structured report (AI)” in the admin view.

---

## Designs and Screenshots

### Homepage
Landing page, hero section, and services overview.

![Homepage](Screenshots/home.png)

### Services
Our Services – report problems, smart categorization, track & feedback.

![Services](Screenshots/services.png)

### About
About PublicVoice, mission, and vision.

![About](Screenshots/about.png)

### Contact
Contact form and information.

![Contact](Screenshots/Contact%20(2).png)

### Register
Citizen registration with language switch (EN/RW).

![Register](Screenshots/register.png)

### Login
Sign in for citizens and admins, with language switch.

![Login](Screenshots/login.png)

### User Dashboard
Overview, Submit Issue, and My Issues.

![User Dashboard](Screenshots/User%20Dasboard.png)

### Admin Dashboard
Stats, charts, recent reports, and respond to issues.

![Admin Dashboard](Screenshots/Admin%20Dashboard.png)

### Report
Submit an issue (with language switch and optional AI structuring).

![Report](Screenshots/Report.png)

---

## Deployment Plan

### Frontend – Netlify

1. Build the frontend: `cd Frontend && pnpm build` (output in `dist/`).
2. In [Netlify](https://www.netlify.com/), create a new site and connect the GitHub repo.
3. **Build settings:**
   - **Base directory:** `Frontend`
   - **Build command:** `pnpm install && pnpm build` (or `npm run build`)
   - **Publish directory:** `Frontend/dist`
4. **Environment variables:** Set `VITE_API_URL` to your production backend URL (e.g. `https://your-app.onrender.com`).
5. **Redirects:** Add a redirect rule so SPA routing works: `/*` → `/index.html` (status 200).

### Backend – Render

1. In [Render](https://render.com/), create a new **Web Service** and connect the GitHub repo.
2. **Build & run:**
   - **Root directory:** `Backend` (or leave blank if repo root is the backend).
   - **Build command:** `pip install -r requirements.txt`
   - **Start command:** `uvicorn main:app --host 0.0.0.0 --port $PORT`
3. **Environment variables:** Set at least:
   - `SECRET_KEY` (strong random value)
   - `DATABASE_URL` (Render PostgreSQL or external Postgres)
   - `CORS_ORIGINS` (your Netlify frontend URL, e.g. `https://your-site.netlify.app`)
   - `OPENAI_API_KEY` (optional, for AI/NLP)
4. Use **PostgreSQL** in production; ensure the backend can reach it and tables are created (backend creates them on startup).

### Summary

| Component  | Platform | Notes |
|------------|----------|--------|
| **Frontend** | Netlify | Static build from `Frontend/dist`, `VITE_API_URL` → Render URL |
| **Backend**  | Render  | Web Service, Uvicorn, PostgreSQL, CORS set to Netlify URL |

---

## Project structure

```
Public_Voice/
├── README.md           # This file
├── Screenshots/        # App screenshots (homepage.png, services.png, etc.)
├── Frontend/
│   ├── public/        # Static assets (e.g. Image/)
│   ├── src/
│   │   ├── Components/
│   │   ├── Pages/
│   │   ├── Routes/
│   │   ├── contexts/
│   │   ├── i18n/
│   │   └── api/
│   ├── package.json
│   └── vite.config.ts
└── Backend/
    ├── core/
    ├── models/
    ├── schemas/
    ├── routers/
    ├── services/      # e.g. ai_processor.py
    ├── main.py
    ├── requirements.txt
    └── env.example
```

---

## License

MIT License
