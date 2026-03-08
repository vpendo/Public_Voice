# PublicVoice Backend

FastAPI backend for PublicVoice civic engagement platform.

---

## Install and Run

### Prerequisites

- Python 3.10+
- pip

### Setup

```bash
cd Public_Voice/Backend
python -m venv venv
```

**Activate virtual environment:**
- **Windows:** `venv\Scripts\activate`
- **macOS/Linux:** `source venv/bin/activate`

```bash
pip install -r requirements.txt
copy env.example .env   # Windows
# cp env.example .env   # macOS/Linux
```

### Configuration

Edit `.env` file:

**Required:**
- `SECRET_KEY` - Generate: `openssl rand -hex 32`

**Optional:**
- `DATABASE_URL` - PostgreSQL connection string (defaults to SQLite)
- `CORS_ORIGINS` - Frontend URLs (comma-separated)
- `OPENAI_API_KEY` - For AI report processing
- `AFRICAS_TALKING_USERNAME` - For SMS OTP (use `sandbox` for testing)
- `AFRICAS_TALKING_API_KEY` - For SMS OTP

### Create Admin User

```bash
python -m scripts.create_admin
```

Enter email, full name, and password when prompted.

### Run Backend

```bash
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

- **API:** http://localhost:8000
- **Docs:** http://localhost:8000/docs

---

## API Endpoints

- `POST /api/auth/register` - Register citizen (phone + National ID)
- `POST /api/auth/login` - Login (phone + full name for users, email + password for admins)
- `POST /api/auth/login/verify-otp` - Verify OTP code
- `GET /api/auth/me` - Get current user
- `POST /api/reports` - Submit report
- `GET /api/reports/mine` - Get user's reports
- `GET /api/reports` - Get all reports (admin only)
- `PATCH /api/reports/{id}/respond` - Respond to report (admin only)

---

## Testing

```bash
pytest tests/ -v
```

---

## Deployment (Render)

1. Create Web Service on Render
2. Connect GitHub repository
3. Set root directory: `Backend`
4. Build command: `pip install -r requirements.txt`
5. Start command: `uvicorn main:app --host 0.0.0.0 --port $PORT`
6. Set environment variables:
   - `SECRET_KEY`
   - `DATABASE_URL`
   - `CORS_ORIGINS`
