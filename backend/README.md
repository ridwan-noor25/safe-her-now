# SafeHer Backend API

Flask-based REST API for the SafeHer harassment reporting system.

## Setup Instructions

### 1. Create Virtual Environment

```bash
python3 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

### 2. Install Dependencies

```bash
pip install -r requirements.txt
```

### 3. Configure Environment

Create a `.env` file in the `backend/` directory:

```bash
cp .env.example .env
```

Edit `.env` and set:
- `JWT_SECRET_KEY` - A strong random secret for JWT tokens
- `SECRET_KEY` - Flask secret key
- `DATABASE_URL` - SQLite path (default: `sqlite:///safeher.db`)

### 4. Initialize Database

The database will be created automatically on first run. To create tables:

```bash
python -c "from app import create_app; from extensions import db; app = create_app(); app.app_context().push(); db.create_all()"
```

Or simply run the app once - tables are created automatically.

### 5. Seed Admin User

```bash
python seed_admin.py
```

This creates the initial admin user:
- Email: `admin@savegirls.com`
- Password: `ridwa12345`

**⚠️ IMPORTANT: Change the admin password after first login!**

### 6. Run the Server

```bash
python app.py
```

Or using Flask CLI:

```bash
export FLASK_APP=app.py
flask run
```

The API will be available at `http://localhost:5000`

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login and get JWT token

### Reports (Auth Required)
- `GET /api/reports` - List reports (own reports for users, ?all=true for moderators/admins)
- `POST /api/reports` - Create new report
- `GET /api/reports/<id>` - Get specific report
- `PUT /api/reports/<id>` - Update report

### Moderator (Moderator/Admin Only)
- `GET /api/moderator/reports` - Get reports queue
- `POST /api/moderator/reports/<id>/note` - Add note and update status

### Admin (Admin Only)
- `GET /api/admin/users` - List all users
- `PUT /api/admin/users/<id>` - Update user (role, is_active)
- `GET /api/admin/stats` - Get system statistics
- `GET /api/admin/reports/export` - Export reports as CSV

### Health Check
- `GET /api/health` - API health status

## Testing Login

After seeding admin, test login:

```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@savegirls.com","password":"ridwa12345"}'
```

## Security Notes

- Never commit `.env` file to version control
- Use strong, random secrets in production
- Enable HTTPS in production
- Consider using secure cookies for JWT in production
- Implement rate limiting for production
- Add input validation and sanitization
- Force password change on first admin login (implement in frontend)

## Database

SQLite database file: `safeher.db` (created in project root by default)

To reset database:
```bash
rm safeher.db
python app.py  # Recreates tables
python seed_admin.py  # Recreates admin
```

