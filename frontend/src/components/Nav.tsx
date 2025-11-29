/**
 * Navigation component for dashboards
 * Shows different navigation based on user role
 */
import { Link, useNavigate } from 'react-router-dom';
import { authAPI } from '../services/api';
import { Button } from '@/components/ui/button';
import { Shield, LogOut, LayoutDashboard } from 'lucide-react';

const Nav = () => {
  const navigate = useNavigate();
  const userRole = localStorage.getItem('user_role');
  const userStr = localStorage.getItem('user');
  let user = null;
  
  try {
    user = userStr ? JSON.parse(userStr) : null;
  } catch (e) {
    console.error('Error parsing user data:', e);
    user = null;
  }

  const handleLogout = () => {
    authAPI.logout();
    navigate('/');
  };

  const getDashboardTitle = () => {
    if (userRole === 'admin') return 'Admin Dashboard';
    if (userRole === 'moderator') return 'Moderator Dashboard';
    return 'My Dashboard';
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-card/95 backdrop-blur-lg border-b border-border shadow-sm">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-6">
            <Link to="/" className="flex items-center gap-2 group">
              <div className="w-10 h-10 bg-gradient-primary rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-glow">
                <Shield className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-display font-bold">SafeHer</span>
            </Link>
            
            <div className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-primary/10 text-primary rounded-lg">
              <LayoutDashboard className="w-4 h-4" />
              <span className="text-sm font-medium">{getDashboardTitle()}</span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center gap-3">
              <span className="text-sm text-muted-foreground">
                {user?.full_name || user?.email || 'User'}
              </span>
              <div className="w-8 h-8 bg-gradient-primary rounded-full flex items-center justify-center text-white text-xs font-bold">
                {(user?.full_name || user?.email || 'U').charAt(0).toUpperCase()}
              </div>
            </div>
            
            <Button
              variant="outline"
              onClick={handleLogout}
              className="rounded-lg border-border hover:bg-destructive/10 hover:border-destructive/20 hover:text-destructive transition-all duration-200"
            >
              <LogOut className="w-4 h-4 mr-2" />
              <span className="hidden sm:inline">Logout</span>
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Nav;
