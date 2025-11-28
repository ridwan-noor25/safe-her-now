/**
 * Dashboard Sidebar Component
 * Reusable sidebar with tabs for all dashboard types
 */
import { 
  LayoutDashboard, 
  FileText, 
  Users, 
  BarChart3, 
  Settings,
  Shield,
  MessageSquare,
  Download
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface SidebarItem {
  id: string;
  label: string;
  icon: any;
  path?: string;
}

interface DashboardSidebarProps {
  userRole: string;
  activeTab: string;
  onTabChange: (tabId: string) => void;
}

const DashboardSidebar = ({ userRole, activeTab, onTabChange }: DashboardSidebarProps) => {
  const getSidebarItems = (): SidebarItem[] => {
    if (userRole === 'admin') {
      return [
        { id: 'overview', label: 'Overview', icon: BarChart3 },
        { id: 'reports', label: 'All Reports', icon: FileText },
        { id: 'users', label: 'User Management', icon: Users },
        { id: 'settings', label: 'Settings', icon: Settings },
      ];
    } else if (userRole === 'moderator') {
      return [
        { id: 'queue', label: 'Reports Queue', icon: FileText },
        { id: 'reviewed', label: 'Reviewed', icon: MessageSquare },
        { id: 'settings', label: 'Settings', icon: Settings },
      ];
    } else {
      return [
        { id: 'submit', label: 'Submit Report', icon: FileText },
        { id: 'my-reports', label: 'My Reports', icon: Shield },
        { id: 'settings', label: 'Settings', icon: Settings },
      ];
    }
  };

  const items = getSidebarItems();

  return (
    <aside className="w-64 bg-card border-r border-border h-[calc(100vh-4rem)] sticky top-16 overflow-y-auto">
      <div className="p-6">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 bg-gradient-primary rounded-xl flex items-center justify-center shadow-glow">
            <Shield className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="font-display font-bold text-lg">Dashboard</h2>
            <p className="text-xs text-muted-foreground capitalize">{userRole}</p>
          </div>
        </div>

        <nav className="space-y-1">
          {items.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            
            return (
              <button
                key={item.id}
                onClick={() => onTabChange(item.id)}
                className={cn(
                  "w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200",
                  isActive
                    ? "bg-gradient-primary text-white shadow-glow"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                )}
              >
                <Icon className={cn("w-5 h-5", isActive ? "text-white" : "")} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>
    </aside>
  );
};

export default DashboardSidebar;

