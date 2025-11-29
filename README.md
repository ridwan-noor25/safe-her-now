# SafeHer - Harassment Reporting System

A complete full-stack application for reporting and managing harassment incidents with role-based access control.

## Project Structure

```
safe-her-now/
├── backend/          # Flask REST API
│   ├── app.py       # Flask application factory
│   ├── config.py    # Configuration
│   ├── models.py    # SQLAlchemy models
│   ├── routes/      # API route blueprints
│   └── seed_admin.py # Admin user seed script
└── frontend/        # React + Vite application
    ├── src/
    │   ├── pages/   # Page components
    │   ├── components/ # Reusable components
    │   └── services/ # API service
    └── package.json
```

## Quick Start

### Backend Setup

1. Navigate to backend directory:
```bash
cd backend
```

2. Create virtual environment:
```bash
python3 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

3. Install dependencies:
```bash
pip install -r requirements.txt
```

4. Create `.env` file (copy from `.env.example`):
```bash
# Set your secrets
SECRET_KEY=your-secret-key-here
JWT_SECRET_KEY=your-jwt-secret-key-here
DATABASE_URL=sqlite:///safeher.db
```

5. Initialize database and seed admin:
```bash
python app.py  # Creates database tables
python seed_admin.py  # Creates admin user
```

6. Run backend server:
```bash
python app.py
```

Backend runs on `http://localhost:5000`

### Frontend Setup

1. Navigate to frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. (Optional) Create `.env` file:
```bash
VITE_API_URL=http://localhost:5000/api
```

4. Run development server:
```bash
npm run dev
```

Frontend runs on `http://localhost:5173`

## Default Admin Credentials

After running `seed_admin.py`:

- **Email**: `admin@savegirls.com`
- **Password**: `ridwa12345`
  
**⚠️ IMPORTANT Requirement: Change the admin password immediately after first login!**

## Test Admin Login

```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@savegirls.com","password":"ridwa12345"}'
```

## Features

### User Roles
- **User**: Can register, login, submit reports, view own reports
- **Moderator**: Can review reports, update status, add notes
- **Admin**: Can manage users, view stats, export data

### User Features
- Register/Login with email
- Submit harassment reports (title, description, category, evidence)
- View own reports with status tracking

### Moderator Features
- View reports queue (pending, in_review)
- Filter reports by status
- Add notes to reports
- Update report status (pending, in_review, resolved, rejected)

### Admin Features
- View system statistics (total reports, users, status breakdowns)
- Manage users (change roles, activate/deactivate)
- View all reports
- Export reports as CSV

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login and get JWT token

### Reports
- `GET /api/reports` - List reports (own for users, ?all=true for moderators/admins)
- `POST /api/reports` - Create new report
- `GET /api/reports/<id>` - Get specific report
- `PUT /api/reports/<id>` - Update report

### Moderator
- `GET /api/moderator/reports` - Get reports queue
- `POST /api/moderator/reports/<id>/note` - Add note and update status

### Admin
- `GET /api/admin/users` - List all users
- `PUT /api/admin/users/<id>` - Update user
- `GET /api/admin/stats` - Get system statistics
- `GET /api/admin/reports/export` - Export reports as CSV

## Security Notes

- Passwords are hashed using Werkzeug's `generate_password_hash`
- JWT tokens are used for API authentication
- Environment variables are used for secrets (never commit `.env`)
- Use HTTPS in production
- Implement rate limiting for production
- Force admin password change on first login (implement in frontend)

## Database

SQLite database file: `safeher.db` (created in project root by default)

To reset database:
```bash
rm safeher.db
cd backend
python app.py  # Recreates tables
python seed_admin.py  # Recreates admin
```

## Technology Stack

### Backend
- Python 3.10+
- Flask (Flask-RESTful, Flask-CORS)
- SQLAlchemy (SQLite)
- Flask-JWT-Extended
- python-dotenv

### Frontend
- React 18
- Vite
- React Router
- Axios
- Tailwind CSS

## Development

### Backend Development
- Run with `python app.py` (debug mode enabled)
- Database auto-creates on first run
- API available at `http://localhost:5000`

### Frontend Development
- Run with `npm run dev`
- Hot reload enabled
- Frontend available at `http://localhost:5173`

## Production Deployment

1. Set strong secrets in `.env` files
2. Use PostgreSQL or MySQL instead of SQLite
3. Enable HTTPS
4. Configure CORS for production domain
5. Set up proper logging and monitoring
6. Implement rate limiting
7. Use secure cookies for JWT in production
8. Set up database backups

## Next Steps

1. ✅ Change admin password after first login
2. ✅ Configure environment variables
3. ✅ Test all user flows
4. ✅ Set up production database
5. ✅ Configure HTTPS
6. ✅ Deploy backend and frontend
7. ✅ Set up monitoring and logging

## License

This project is provided as-is for development purposes.

## Github Repository: 
https://github.com/ridwan-noor25/safe-her-now.git