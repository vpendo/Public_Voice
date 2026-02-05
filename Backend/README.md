# PublicVoice Backend

FastAPI backend for the PublicVoice civic engagement platform.

## 🚀 Features

- RESTful API built with FastAPI
- PostgreSQL database integration
- JWT authentication
- CORS support for frontend integration
- Environment-based configuration
- Automatic API documentation (Swagger UI)

## 📋 Prerequisites

- Python 3.11 or higher
- PostgreSQL 12 or higher
- pip (Python package manager)

## 🛠️ Installation

### 1. Clone the repository

```bash
cd Public_Voice/Backend
```

### 2. Create a virtual environment

```bash
# Windows
python -m venv venv

# macOS/Linux
python3 -m venv venv
```

### 3. Activate the virtual environment

```bash
# Windows
venv\Scripts\activate

# macOS/Linux
source venv/bin/activate
```

### 4. Install dependencies

```bash
pip install fastapi uvicorn[standard] python-dotenv sqlalchemy psycopg2-binary pydantic python-jose[cryptography] passlib[bcrypt] python-multipart
```

Or create a `requirements.txt` file and install:

```bash
pip install -r requirements.txt
```

### 5. Set up PostgreSQL database

1. Create a PostgreSQL database:
```sql
CREATE DATABASE publicvoice_db;
```

2. Create a user (optional):
```sql
CREATE USER publicvoice_user WITH PASSWORD 'your_password';
GRANT ALL PRIVILEGES ON DATABASE publicvoice_db TO publicvoice_user;
```

### 6. Configure environment variables

1. Copy the example environment file:
```bash
# Windows
copy env.example .env

# macOS/Linux
cp env.example .env
```

2. Edit `.env` and update the following:
   - `DATABASE_URL`: Your PostgreSQL connection string
   - `SECRET_KEY`: Generate a secure random string
   - `CORS_ORIGINS`: Your frontend URL(s)
   - Other settings as needed

Example `.env`:
```env
DATABASE_URL=postgresql://publicvoice_user:your_password@localhost:5432/publicvoice_db
SECRET_KEY=your-super-secret-key-change-this-in-production
CORS_ORIGINS=http://localhost:5173,http://localhost:3000
DEBUG=True
```

## 🏃 Running the Application

### Development mode

```bash
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

The API will be available at:
- API: http://localhost:8000
- Swagger UI: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc

### Production mode

```bash
uvicorn main:app --host 0.0.0.0 --port 8000
```

## 📁 Project Structure

```
Backend/
├── .env                 # Environment variables (not in git)
├── .gitignore          # Git ignore rules
├── env.example         # Environment variables template
├── main.py             # FastAPI application entry point
├── requirements.txt    # Python dependencies
├── README.md           # This file
└── venv/              # Virtual environment (not in git)
```

## 🔧 Configuration

All configuration is done through environment variables in the `.env` file. See `env.example` for all available options.

### Key Environment Variables

- `DATABASE_URL`: PostgreSQL connection string
- `SECRET_KEY`: Secret key for JWT tokens
- `DEBUG`: Enable/disable debug mode
- `CORS_ORIGINS`: Allowed CORS origins (comma-separated)
- `ACCESS_TOKEN_EXPIRE_MINUTES`: JWT token expiration time

## 📚 API Documentation

Once the server is running, visit:
- **Swagger UI**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc

## 🔐 Security Notes

- Never commit `.env` file to version control
- Use strong, unique `SECRET_KEY` in production
- Keep database credentials secure
- Enable HTTPS in production
- Configure CORS properly for your frontend domain

## 🧪 Testing

```bash
# Install test dependencies
pip install pytest pytest-asyncio httpx

# Run tests
pytest
```

## 📦 Dependencies

- **FastAPI**: Modern, fast web framework
- **Uvicorn**: ASGI server
- **SQLAlchemy**: SQL toolkit and ORM
- **psycopg2-binary**: PostgreSQL adapter
- **Pydantic**: Data validation
- **python-jose**: JWT handling
- **passlib**: Password hashing
- **python-dotenv**: Environment variable management

## 🐛 Troubleshooting

### Database Connection Issues

- Verify PostgreSQL is running: `pg_isready`
- Check database credentials in `.env`
- Ensure database exists: `psql -l`

### Port Already in Use

- Change `PORT` in `.env` or use a different port:
```bash
uvicorn main:app --port 8001
```

### Module Not Found

- Ensure virtual environment is activated
- Reinstall dependencies: `pip install -r requirements.txt`

## 📝 License

This project is part of the PublicVoice capstone project.

## 👥 Contributors

PublicVoice Development Team
