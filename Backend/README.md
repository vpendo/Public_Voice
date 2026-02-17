# PublicVoice Backend

## Description

FastAPI backend for **PublicVoice**, a civic engagement platform. Provides JWT auth (register citizens, login for User and Admin), report APIs (submit, list mine, list all for admin, update status and response), and user listing for admins. Uses SQLite in dev and PostgreSQL in production.

**Tools:** Python 3.10+, FastAPI, SQLAlchemy, JWT (HS256), bcrypt, Pydantic. Optional: PostgreSQL.

---

## GitHub Repository

- **Repo:** [https://github.com/vpendo/Public_Voice.git]  
  `

---

## How to Set Up the Environment and the Project

### Prerequisites

- Python 3.10+
- pip  
- PostgreSQL (optional; SQLite used if `DATABASE_URL` is not set)

### Setup

```bash
cd Public_Voice/Backend
python -m venv venv
```

**Activate venv:**

- Windows: `venv\Scripts\activate`
            `source venv/Scripts/activate`

- macOS/Linux: `source venv/bin/activate`

```bash
pip install -r requirements.txt
```

### Configuration

```bash
# Windows
copy env.example .env
# macOS/Linux
cp env.example .env
```

Edit `.env`:

- **SECRET_KEY** – required; use a long random string (e.g. `openssl rand -hex 32`).
- **DATABASE_URL** – optional; if set, use PostgreSQL. If not set, SQLite is used (`./publicvoice.db`).
- **CORS_ORIGINS** – allowed frontend origins (e.g. `http://localhost:5173` for dev).
- **OPENAI_API_KEY** – optional but required for **AI/NLP report processing**. When set, citizen report text (e.g. Kinyarwanda or informal English) is sent to the API for:
  - **Translation** (Kinyarwanda → English)
  - **Formal rewriting** (informal → formal)
  - **Structuring** (title, category, institution)
  The result is stored as `structured_description` and shown to admins in the dashboard. Without this key, only the raw submission is stored. Get an API key from [OpenAI](https://platform.openai.com/api-keys). Example: `OPENAI_API_KEY=sk-your-key-here`

### Create admin user

Admins do not register via the app. Create one from the Backend folder with venv activated:

```bash
python -m scripts.create_admin
```

Enter email, full name, and password when prompted. Or use env vars:

```bash
# Windows PowerShell
$env:CREATE_ADMIN_EMAIL="admin@example.com"; $env:CREATE_ADMIN_PASSWORD="YourSecurePass1"; python -m scripts.create_admin

# macOS/Linux
CREATE_ADMIN_EMAIL=admin@example.com CREATE_ADMIN_PASSWORD=YourSecurePass1 python -m scripts.create_admin
```

Password rules: at least 8 characters, one letter and one digit.

### See your admin account (which email to use for admin login)

To see which account is the admin (e.g. if you forgot the email you used):

```bash
python -m scripts.show_admin
```

This prints the admin user’s **ID**, **email**, and **name**. Use that email and the password you set when you ran `create_admin` to log in as admin in the app.

You can also run `python -m scripts.create_admin` again: if an admin already exists, it will print that admin’s id and email and exit without creating a new one.

### Run

```bash
uvicorn main:app --reload 
```

- **API:** http://localhost:8000  
- **Swagger:** http://localhost:8000/docs  

---

## Designs

- **Figma mockups / wireframes:** [Add link or path, e.g. repo root `docs/wireframes/`]
- **Screenshots of app interfaces:** [Add path or images; backend is API-only; screenshots refer to the frontend that consumes this API]

API design: REST; auth via JWT Bearer; endpoints documented at `/docs`.

---

## Deployment Plan (Render)

1. Create a **Web Service** on **Render**; connect the GitHub repo.
2. **Root directory:** `Backend` (if repo root is above Backend).
3. **Build command:** `pip install -r requirements.txt`
4. **Start command:** `uvicorn main:app --host 0.0.0.0 --port $PORT`  
   (Render sets `PORT`; use `$PORT` in the command.)
5. **Environment variables (required):**
   - `SECRET_KEY` – long random string (e.g. from `openssl rand -hex 32`).
   - `DATABASE_URL` – PostgreSQL connection string (use Render’s PostgreSQL add-on or external DB).
   - `CORS_ORIGINS` – frontend origin(s), e.g. `https://your-app.netlify.app` (no trailing slash).
6. **Database:** Add a PostgreSQL database on Render; use its internal URL as `DATABASE_URL`. Tables are created on first startup via `init_db()`. Create an admin with `python -m scripts.create_admin` (run locally with prod `DATABASE_URL` or via a one-off job if you add it).

After deploy, use the Render service URL (e.g. `https://your-app.onrender.com`) as the frontend `VITE_API_URL`.
