# PublicVoice

Civic engagement platform for Rwanda: citizens report issues in English or Kinyarwanda; AI translates and structures reports for admins.

- **Demo video:** [Demo (Google Drive)](https://drive.google.com/file/d/1pxpAqEp2TsBnOkESI6ZwRrnRnn7_e3JC/view?usp=sharing)
- **Repository:** [GitHub – Public_Voice](https://github.com/vpendo/Public_Voice)
- **Deployed app:** [Frontend](https://publicvoice1.netlify.app)

                    [Backend](https://public-voice1.onrender.com/docs#/)

### Screenshots

**Tests** – Backend test run (pytest). Auth, reports, and API tests passing.

![Tests](Screenshots/Tests.png)

**Phone OTP** – OTP code sent to the user’s phone for login or registration verification.

![Phone OTP](Screenshots/phone_OTP.png)

**Created issue** – Success view after a citizen submits a new report/issue.

![Created issue](Screenshots/created_issue.png)

**Get report by ID** – API or admin view of a single report’s details.

![Get report by ID](Screenshots/get_report_by_id.png)

**All users** – Admin view listing registered users (citizens and admins).

![All users](Screenshots/all_user.png)

**Pending report** – Admin dashboard showing reports awaiting review or action.

![Pending report](Screenshots/pending_report.png)

**Register API** – Swagger/OpenAPI docs for the citizen registration endpoint.

![Register API](Screenshots/register_API.png)

---

## Install and Run (Step by Step)

### Prerequisites

- **Node.js** 18+ and **pnpm** (or npm)
- **Python** 3.10+ and **pip**
- **PostgreSQL** (optional; SQLite used if `DATABASE_URL` is not set)

### Step 1: Clone Repository

```bash
git clone https://github.com/vpendo/Public_Voice.git
cd Public_Voice
```

### Step 2: Backend Setup

```bash
cd Backend
python -m venv venv
```

**Activate virtual environment:**
- **Windows:** ` source venv\Scripts\activate`
- **macOS/Linux:** `source venv/bin/activate`

```bash
pip install -r requirements.txt
copy env.example .env   # Windows
# cp env.example .env   # macOS/Linux
```

**Edit `.env` file:**
- `SECRET_KEY` - required (generate: `openssl rand -hex 32`)
- `DATABASE_URL` - optional (PostgreSQL connection string)
- `CORS_ORIGINS` - frontend URL (e.g. `http://localhost:5173`)
- `OPENAI_API_KEY` - optional (for AI report processing)
- `AFRICAS_TALKING_USERNAME` - optional (for SMS OTP)
- `AFRICAS_TALKING_API_KEY` - optional (for SMS OTP)

**Create admin user:**
```bash
python -m scripts.create_admin
```

**Start backend:**
```bash
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

Backend runs at: **http://localhost:8000**  
API Docs: **http://localhost:8000/docs**

### Step 3: Frontend Setup

Open a new terminal:

```bash
cd Public_Voice/Frontend
pnpm install
```

**Optional:** Create `.env` file:
```env
VITE_API_URL=http://127.0.0.1:8000
```

**Start frontend:**
```bash
pnpm dev
```

Frontend runs at: **http://localhost:5173**

### Step 4: Verify Installation

1. Open **http://localhost:5173**
2. Register a citizen account (phone number + National ID)
3. Submit a report
4. Login as admin (use email and password from `create_admin`)
5. View and respond to reports in admin dashboard

---

## How to Use

### For Citizens

1. **Register:** Click "Register" → Enter full name, phone number, and National ID (16 digits)
2. **Verify Phone:** Enter OTP code sent to your phone
3. **Login:** Use phone number and full name
4. **Submit Issue:** Go to "Submit Issue" → Fill form → Submit
5. **Track Reports:** View "My Issues" to see status and admin responses

### For Admins

1. **Login:** Use email and password (created via `create_admin` script)
2. **Dashboard:** View statistics and recent reports
3. **All Issues:** Browse all submitted reports
4. **Respond:** Click on a report → Add response → Update status
5. **Users:** View and manage user accounts

---

## Related Files

| Purpose | Location |
|---------|----------|
| Backend API | `Backend/main.py`, `Backend/routers/` |
| Authentication | `Backend/routers/auth.py` |
| Reports | `Backend/routers/reports.py` |
| Database Models | `Backend/models/` |
| Frontend Pages | `Frontend/src/Pages/` |
| Frontend Components | `Frontend/src/Components/` |
| Configuration | `Backend/.env`, `Frontend/.env` |

---

## Technology Stack

- **Frontend:** React 19, TypeScript, Vite, Tailwind CSS
- **Backend:** FastAPI, Python 3.10+, JWT, bcrypt
- **Database:** SQLite (dev) / PostgreSQL (production)
- **AI/NLP:** OpenAI API (optional)

---

## Deployment

- **Frontend:** [Netlify](https://publicvoice1.netlify.app)
- **Backend:** [Render](https://public-voice1.onrender.com)

---

## License

MIT License
