/**
 * Admin Dashboard
 * Allows admins to manage users, view stats, and export reports
 */
import { useState, useEffect, ChangeEvent } from 'react';
import Nav from '../components/Nav';
import DashboardSidebar from '../components/DashboardSidebar';
import { adminAPI, reportsAPI } from '../services/api';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Shield, Users, FileText, TrendingUp, Download, Loader2, AlertCircle, CheckCircle, Clock, BarChart3, UserPlus, Mail, Lock, User as UserIcon, X } from 'lucide-react';

interface User {
  id: number;
  email: string;
  role: string;
  full_name: string;
  is_active: boolean;
}

interface Report {
  id: number;
  title: string;
  status: string;
  user?: {
    email: string;
  };
}

interface Stats {
  total_reports: number;
  reports_by_status: {
    pending: number;
    in_review: number;
    resolved: number;
    rejected: number;
  };
  total_users: number;
}

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [stats, setStats] = useState<Stats | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [createFormData, setCreateFormData] = useState({
    email: '',
    password: '',
    full_name: '',
    role: 'moderator'
  });
  const [creating, setCreating] = useState(false);
  const userRole = localStorage.getItem('user_role') || 'admin';

  useEffect(() => {
    loadData();
  }, [activeTab]);

  const loadData = async () => {
    try {
      setLoading(true);
      if (activeTab === 'overview' || activeTab === 'reports') {
        const [statsRes, reportsRes] = await Promise.all([
          adminAPI.getStats(),
          reportsAPI.getAll(true),
        ]);
        setStats(statsRes.data);
        setReports(reportsRes.data);
      }
      if (activeTab === 'users' || activeTab === 'overview') {
        const usersRes = await adminAPI.getUsers();
        setUsers(usersRes.data);
      }
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const handleExport = async () => {
    try {
      const response = await adminAPI.exportReports();
      const blob = new Blob([response.data], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `safeher_reports_${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (err) {
      setError('Failed to export reports');
    }
  };

  const handleUserUpdate = async (userId: number, updates: { is_active?: boolean }) => {
    try {
      await adminAPI.updateUser(userId, updates);
      loadData();
      setSuccessMessage('User updated successfully');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to update user');
      setTimeout(() => setError(''), 5000);
    }
  };

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setCreating(true);

    try {
      await adminAPI.createUser(createFormData);
      setSuccessMessage(`${createFormData.role.charAt(0).toUpperCase() + createFormData.role.slice(1)} created successfully!`);
      setCreateFormData({ email: '', password: '', full_name: '', role: 'moderator' });
      setShowCreateForm(false);
      loadData();
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to create user');
      setTimeout(() => setError(''), 5000);
    } finally {
      setCreating(false);
    }
  };

  const renderContent = () => {
    if (loading && activeTab === 'overview') {
      return (
        <div className="flex items-center justify-center py-24">
          <div className="text-center">
            <Loader2 className="w-12 h-12 animate-spin text-primary mx-auto mb-4" />
            <p className="text-muted-foreground">Loading dashboard...</p>
          </div>
        </div>
      );
    }

    switch (activeTab) {
      case 'overview':
        return (
          <div className="space-y-6 animate-fade-up">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-3xl font-display font-bold text-foreground mb-2">Overview</h2>
                <p className="text-muted-foreground">System statistics and quick actions</p>
              </div>
              <Button
                onClick={handleExport}
                className="bg-gradient-accent hover:shadow-glow transition-all duration-300 rounded-lg"
              >
                <Download className="w-4 h-4 mr-2" />
                Export CSV
              </Button>
            </div>

            {error && (
              <div className="p-4 bg-destructive/10 border border-destructive/20 text-destructive rounded-lg animate-fade-in">
                {error}
              </div>
            )}
            {successMessage && (
              <div className="p-4 bg-primary/10 border border-primary/20 text-primary rounded-lg animate-fade-in">
                {successMessage}
              </div>
            )}

            {/* Stats Section */}
            {stats && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card className="border-0 shadow-lg-custom bg-card">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground mb-1">Total Reports</p>
                        <p className="text-3xl font-bold text-foreground">{stats.total_reports}</p>
                      </div>
                      <div className="w-12 h-12 bg-gradient-primary/10 rounded-xl flex items-center justify-center">
                        <FileText className="w-6 h-6 text-primary" />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-0 shadow-lg-custom bg-card">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground mb-1">Pending</p>
                        <p className="text-3xl font-bold text-yellow-600">{stats.reports_by_status.pending}</p>
                      </div>
                      <div className="w-12 h-12 bg-yellow-50 rounded-xl flex items-center justify-center">
                        <Clock className="w-6 h-6 text-yellow-600" />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-0 shadow-lg-custom bg-card">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground mb-1">Resolved</p>
                        <p className="text-3xl font-bold text-green-600">{stats.reports_by_status.resolved}</p>
                      </div>
                      <div className="w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center">
                        <CheckCircle className="w-6 h-6 text-green-600" />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-0 shadow-lg-custom bg-card">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground mb-1">Total Users</p>
                        <p className="text-3xl font-bold text-foreground">{stats.total_users}</p>
                      </div>
                      <div className="w-12 h-12 bg-gradient-accent/10 rounded-xl flex items-center justify-center">
                        <Users className="w-6 h-6 text-accent" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Recent Reports */}
            <Card className="border-0 shadow-lg-custom bg-card">
              <CardHeader>
                <CardTitle className="text-xl font-display">Recent Reports</CardTitle>
                <CardDescription>Latest 10 reports</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {reports.slice(0, 10).map((report) => (
                    <div
                      key={report.id}
                      className="p-4 rounded-lg border border-border bg-background hover:border-primary/50 transition-all duration-200"
                    >
                      <div className="flex items-center justify-between gap-4">
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-foreground truncate">{report.title}</p>
                          <p className="text-sm text-muted-foreground">{report.user?.email || 'N/A'}</p>
                        </div>
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium ${
                            report.status === 'resolved'
                              ? 'bg-green-50 text-green-600 border border-green-200'
                              : report.status === 'pending'
                              ? 'bg-yellow-50 text-yellow-600 border border-yellow-200'
                              : 'bg-blue-50 text-blue-600 border border-blue-200'
                          }`}
                        >
                          {report.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        );

      case 'reports':
        return (
          <div className="space-y-6 animate-fade-up">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-3xl font-display font-bold text-foreground mb-2">All Reports</h2>
                <p className="text-muted-foreground">View and manage all system reports</p>
              </div>
              <Button
                onClick={handleExport}
                className="bg-gradient-accent hover:shadow-glow transition-all duration-300 rounded-lg"
              >
                <Download className="w-4 h-4 mr-2" />
                Export CSV
              </Button>
            </div>
            <Card className="border-0 shadow-lg-custom bg-card">
              <CardContent className="p-6">
                <div className="space-y-3">
                  {reports.map((report) => (
                    <div
                      key={report.id}
                      className="p-4 rounded-lg border border-border bg-background hover:border-primary/50 transition-all duration-200"
                    >
                      <div className="flex items-center justify-between gap-4">
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-foreground truncate">{report.title}</p>
                          <p className="text-sm text-muted-foreground">{report.user?.email || 'N/A'}</p>
                        </div>
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium ${
                            report.status === 'resolved'
                              ? 'bg-green-50 text-green-600 border border-green-200'
                              : report.status === 'pending'
                              ? 'bg-yellow-50 text-yellow-600 border border-yellow-200'
                              : 'bg-blue-50 text-blue-600 border border-blue-200'
                          }`}
                        >
                          {report.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        );

      case 'users':
        return (
          <div className="space-y-6 animate-fade-up">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-3xl font-display font-bold text-foreground mb-2">User Management</h2>
                <p className="text-muted-foreground">Create moderators and manage user status</p>
              </div>
              <Button
                onClick={() => setShowCreateForm(!showCreateForm)}
                className="bg-gradient-primary hover:shadow-glow transition-all duration-300 rounded-lg"
              >
                <UserPlus className="w-4 h-4 mr-2" />
                Create Moderator
              </Button>
            </div>

            {error && (
              <div className="p-4 bg-destructive/10 border border-destructive/20 text-destructive rounded-lg animate-fade-in">
                {error}
              </div>
            )}
            {successMessage && (
              <div className="p-4 bg-primary/10 border border-primary/20 text-primary rounded-lg animate-fade-in">
                {successMessage}
              </div>
            )}

            {showCreateForm && (
              <Card className="border-0 shadow-lg-custom bg-card animate-fade-in">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-primary rounded-lg flex items-center justify-center">
                        <UserPlus className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <CardTitle className="text-xl font-display">Create New User</CardTitle>
                        <CardDescription>Create a new moderator or user account</CardDescription>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowCreateForm(false)}
                      className="rounded-lg"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleCreateUser} className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-foreground flex items-center gap-2">
                        <Mail className="w-4 h-4" />
                        Email Address
                      </label>
                      <input
                        type="email"
                        required
                        value={createFormData.email}
                        onChange={(e) => setCreateFormData({ ...createFormData, email: e.target.value })}
                        className="w-full px-4 py-3 bg-background border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-all duration-200"
                        placeholder="moderator@example.com"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium text-foreground flex items-center gap-2">
                        <Lock className="w-4 h-4" />
                        Password
                      </label>
                      <input
                        type="password"
                        required
                        minLength={6}
                        value={createFormData.password}
                        onChange={(e) => setCreateFormData({ ...createFormData, password: e.target.value })}
                        className="w-full px-4 py-3 bg-background border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-all duration-200"
                        placeholder="Enter password (min 6 characters)"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium text-foreground flex items-center gap-2">
                        <UserIcon className="w-4 h-4" />
                        Full Name
                      </label>
                      <input
                        type="text"
                        value={createFormData.full_name}
                        onChange={(e) => setCreateFormData({ ...createFormData, full_name: e.target.value })}
                        className="w-full px-4 py-3 bg-background border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-all duration-200"
                        placeholder="John Doe"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium text-foreground flex items-center gap-2">
                        <Shield className="w-4 h-4" />
                        Role
                      </label>
                      <select
                        value={createFormData.role}
                        onChange={(e) => setCreateFormData({ ...createFormData, role: e.target.value })}
                        className="w-full px-4 py-3 bg-background border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-all duration-200"
                      >
                        <option value="user">User</option>
                        <option value="moderator">Moderator</option>
                        <option value="admin">Admin</option>
                      </select>
                    </div>

                    <div className="flex gap-3 pt-2">
                      <Button
                        type="submit"
                        disabled={creating}
                        className="flex-1 bg-gradient-primary hover:shadow-glow transition-all duration-300 rounded-lg"
                      >
                        {creating ? (
                          <>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            Creating...
                          </>
                        ) : (
                          <>
                            <UserPlus className="w-4 h-4 mr-2" />
                            Create User
                          </>
                        )}
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setShowCreateForm(false)}
                        className="rounded-lg"
                      >
                        Cancel
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            )}

            <Card className="border-0 shadow-lg-custom bg-card">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-primary rounded-lg flex items-center justify-center">
                    <Users className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-xl font-display">All Users</CardTitle>
                    <CardDescription>{users.length} users registered</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {users.map((user) => (
                    <div
                      key={user.id}
                      className="p-4 rounded-lg border border-border bg-background hover:border-primary/50 transition-all duration-200"
                    >
                      <div className="flex items-center justify-between gap-4">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <p className="font-medium text-foreground truncate">{user.email}</p>
                            <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                              user.role === 'admin' 
                                ? 'bg-purple-50 text-purple-600 border border-purple-200'
                                : user.role === 'moderator'
                                ? 'bg-blue-50 text-blue-600 border border-blue-200'
                                : 'bg-gray-50 text-gray-600 border border-gray-200'
                            }`}>
                              {user.role}
                            </span>
                          </div>
                          <p className="text-sm text-muted-foreground">{user.full_name || 'No name provided'}</p>
                        </div>
                        <Button
                          onClick={() => handleUserUpdate(user.id, { is_active: !user.is_active })}
                          variant={user.is_active ? 'default' : 'destructive'}
                          size="sm"
                          className="rounded-lg"
                        >
                          {user.is_active ? 'Active' : 'Inactive'}
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        );

      case 'settings':
        return (
          <div className="space-y-6 animate-fade-up">
            <div>
              <h2 className="text-3xl font-display font-bold text-foreground mb-2">Settings</h2>
              <p className="text-muted-foreground">System settings and administrator preferences</p>
            </div>

            <Card className="border-0 shadow-lg-custom bg-card">
              <CardHeader>
                <CardTitle className="text-xl font-display">System Configuration</CardTitle>
                <CardDescription>Configure system-wide settings</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 bg-muted rounded-lg">
                    <p className="text-sm font-medium text-foreground mb-1">Total Reports</p>
                    <p className="text-2xl font-bold text-primary">{stats?.total_reports || 0}</p>
                  </div>
                  <div className="p-4 bg-muted rounded-lg">
                    <p className="text-sm font-medium text-foreground mb-1">Total Users</p>
                    <p className="text-2xl font-bold text-primary">{stats?.total_users || 0}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg-custom bg-card">
              <CardHeader>
                <CardTitle className="text-xl font-display">Notification Settings</CardTitle>
                <CardDescription>Configure admin notification preferences</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
                  <div>
                    <label className="text-sm font-medium text-foreground">Email Notifications</label>
                    <p className="text-xs text-muted-foreground">Receive email alerts for system events</p>
                  </div>
                  <input
                    type="checkbox"
                    defaultChecked
                    className="w-4 h-4 rounded border-input"
                  />
                </div>
                <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
                  <div>
                    <label className="text-sm font-medium text-foreground">Daily Reports</label>
                    <p className="text-xs text-muted-foreground">Receive daily summary reports</p>
                  </div>
                  <input
                    type="checkbox"
                    defaultChecked
                    className="w-4 h-4 rounded border-input"
                  />
                </div>
                <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
                  <div>
                    <label className="text-sm font-medium text-foreground">Critical Alerts</label>
                    <p className="text-xs text-muted-foreground">Immediate alerts for critical reports</p>
                  </div>
                  <input
                    type="checkbox"
                    defaultChecked
                    className="w-4 h-4 rounded border-input"
                  />
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg-custom bg-card">
              <CardHeader>
                <CardTitle className="text-xl font-display">Data Management</CardTitle>
                <CardDescription>Manage system data and exports</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button
                  onClick={handleExport}
                  variant="outline"
                  className="w-full justify-start rounded-lg"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Export All Reports to CSV
                </Button>
                <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <p className="text-sm font-medium text-yellow-900 mb-1">Database Backup</p>
                  <p className="text-xs text-yellow-700">Regular backups are automatically created. Last backup: Today</p>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg-custom bg-card">
              <CardHeader>
                <CardTitle className="text-xl font-display">Security Settings</CardTitle>
                <CardDescription>Configure security and access controls</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 bg-muted rounded-lg">
                  <p className="text-sm font-medium text-foreground mb-2">Password Policy</p>
                  <p className="text-xs text-muted-foreground">Minimum 8 characters, must include letters and numbers</p>
                </div>
                <div className="p-4 bg-muted rounded-lg">
                  <p className="text-sm font-medium text-foreground mb-2">Session Timeout</p>
                  <p className="text-xs text-muted-foreground">24 hours of inactivity</p>
                </div>
                <div className="p-4 bg-muted rounded-lg">
                  <p className="text-sm font-medium text-foreground mb-2">Two-Factor Authentication</p>
                  <p className="text-xs text-muted-foreground">Available for admin accounts</p>
                </div>
              </CardContent>
            </Card>

            <div className="flex justify-end">
              <Button
                onClick={() => {
                  setSuccessMessage('Settings saved successfully!');
                  setTimeout(() => setSuccessMessage(''), 3000);
                }}
                className="bg-gradient-primary hover:shadow-glow transition-all duration-300 rounded-lg"
              >
                Save Settings
              </Button>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-hero">
      <Nav />
      <div className="flex pt-16">
        <DashboardSidebar 
          userRole={userRole} 
          activeTab={activeTab} 
          onTabChange={setActiveTab} 
        />
        <main className="flex-1 p-8 ml-64">
          <div className="max-w-7xl mx-auto">
            {renderContent()}
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;
