# SafeHer Frontend

React + Vite frontend application for the SafeHer harassment reporting system.

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment (Optional)

Create a `.env` file in the `frontend/` directory:

```bash
VITE_API_URL=http://localhost:5000/api
```

If not set, defaults to `http://localhost:5000/api`.

### 3. Run Development Server

```bash
npm run dev
```

The application will be available at `http://localhost:5173` (or the port shown in terminal).

### 4. Build for Production

```bash
npm run build
```

Built files will be in the `dist/` directory.

## Project Structure

```
frontend/
├── src/
│   ├── pages/
│   │   ├── Login.jsx              # Login page
│   │   ├── Register.jsx           # Registration page
│   │   ├── UserDashboard.jsx      # User dashboard (submit reports, view own reports)
│   │   ├── ModeratorDashboard.jsx # Moderator dashboard (review reports)
│   │   └── AdminDashboard.jsx     # Admin dashboard (manage users, stats, export)
│   ├── components/
│   │   ├── Nav.jsx                # Navigation component
│   │   ├── ReportForm.jsx         # Report submission form
│   │   └── ReportList.jsx         # Report list display
│   ├── services/
│   │   └── api.js                 # API service with JWT handling
│   ├── App.jsx                    # Main app component with routing
│   └── main.jsx                   # Entry point
├── index.html
├── package.json
├── vite.config.ts
└── tailwind.config.ts
```

## Features

### Authentication
- User registration and login
- JWT token storage in localStorage
- Automatic token attachment to API requests
- Role-based route protection

### User Dashboard
- Submit harassment reports (title, description, category, evidence)
- View own reports with status
- Responsive design with Tailwind CSS

### Moderator Dashboard
- View reports queue (pending, in_review)
- Filter reports by status
- Add notes to reports
- Update report status

### Admin Dashboard
- View system statistics
- Manage users (change roles, activate/deactivate)
- View all reports
- Export reports as CSV

## API Integration

The frontend uses axios for API calls. JWT tokens are automatically attached to requests via interceptors. The API service is located in `src/services/api.js`.

## Styling

The application uses Tailwind CSS for styling. All components are responsive and follow a clean, modern design.

## Development Notes

- The app uses React Router for navigation
- Protected routes check for authentication and role permissions
- JWT tokens are stored in localStorage
- On 401 errors, users are automatically logged out and redirected to login

