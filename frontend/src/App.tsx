/**
 * Main App component with routing
 * Handles authentication and role-based routing
 */
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ReactNode } from 'react';
import ErrorBoundary from './components/ErrorBoundary';
import Index from './pages/Index';
import About from './pages/About';
import Resources from './pages/Resources';
import Blog from './pages/Blog';
import Contact from './pages/Contact';
import NotFound from './pages/NotFound';
import Login from './pages/Login';
import Register from './pages/Register';
import UserDashboard from './pages/UserDashboard';
import ModeratorDashboard from './pages/ModeratorDashboard';
import AdminDashboard from './pages/AdminDashboard';

// Protected route component
interface ProtectedRouteProps {
  children: ReactNode;
  allowedRoles?: string[];
}

const ProtectedRoute = ({ children, allowedRoles = [] }: ProtectedRouteProps) => {
  const token = localStorage.getItem('access_token');
  const userRole = localStorage.getItem('user_role');

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles.length > 0 && !allowedRoles.includes(userRole || '')) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
};

const App = () => {
  return (
    <ErrorBoundary>
      <BrowserRouter>
        <Routes>
          {/* Public Pages */}
          <Route path="/" element={<Index />} />
          <Route path="/about" element={<About />} />
          <Route path="/resources" element={<Resources />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/contact" element={<Contact />} />

          {/* Auth Pages */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Protected Dashboard Routes */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute allowedRoles={['user']}>
                <ErrorBoundary>
                  <UserDashboard />
                </ErrorBoundary>
              </ProtectedRoute>
            }
          />
          <Route
            path="/moderator"
            element={
              <ProtectedRoute allowedRoles={['moderator', 'admin']}>
                <ErrorBoundary>
                  <ModeratorDashboard />
                </ErrorBoundary>
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <ErrorBoundary>
                  <AdminDashboard />
                </ErrorBoundary>
              </ProtectedRoute>
            }
          />

          {/* 404 */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </ErrorBoundary>
  );
};

export default App;
