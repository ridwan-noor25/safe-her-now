/**
 * User Dashboard
 * Allows users to submit reports and view their own reports
 */
import { useState } from 'react';
import Nav from '../components/Nav';
import DashboardSidebar from '../components/DashboardSidebar';
import ReportForm from '../components/ReportForm';
import ReportList from '../components/ReportList';
import ReportDetail from '../components/ReportDetail';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileText, Settings, X, Mail, Bell, Shield, Lock, User as UserIcon, Phone } from 'lucide-react';

const UserDashboard = () => {
  const [activeTab, setActiveTab] = useState('submit');
  const [refreshKey, setRefreshKey] = useState(0);
  const [selectedReportId, setSelectedReportId] = useState<number | null>(null);
  const [successMessage, setSuccessMessage] = useState('');
  const userRole = localStorage.getItem('user_role') || 'user';
  const userData = JSON.parse(localStorage.getItem('user') || '{}');
  
  // Settings state
  const [settings, setSettings] = useState({
    email_notifications: true,
    sms_notifications: false,
    report_updates: true,
    anonymous_by_default: false,
  });

  const handleReportSubmitted = () => {
    setRefreshKey((prev) => prev + 1);
    setActiveTab('my-reports'); // Switch to reports tab after submission
  };

  const handleReportClick = (report: any) => {
    setSelectedReportId(report.id);
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'submit':
        return (
          <div className="animate-fade-up">
            <div className="mb-6">
              <h2 className="text-3xl font-display font-bold text-foreground mb-2">Submit New Report</h2>
              <p className="text-muted-foreground">Report an incident of harassment</p>
            </div>
            <ReportForm onSuccess={handleReportSubmitted} />
          </div>
        );
      
      case 'my-reports':
        return (
          <div className="animate-fade-up">
            <div className="mb-6">
              <h2 className="text-3xl font-display font-bold text-foreground mb-2">My Reports</h2>
              <p className="text-muted-foreground">View and track your submitted reports</p>
            </div>
            {selectedReportId ? (
              <div className="space-y-4">
                <Button
                  variant="outline"
                  onClick={() => setSelectedReportId(null)}
                  className="rounded-lg"
                >
                  <X className="w-4 h-4 mr-2" />
                  Back to Reports
                </Button>
                <ReportDetail reportId={selectedReportId} />
              </div>
            ) : (
              <ReportList key={refreshKey} showAll={false} onReportClick={handleReportClick} />
            )}
          </div>
        );
      
      case 'settings':
        return (
          <div className="space-y-6 animate-fade-up">
            <div>
              <h2 className="text-3xl font-display font-bold text-foreground mb-2">Settings</h2>
              <p className="text-muted-foreground">Manage your account preferences and privacy settings</p>
            </div>

            {successMessage && (
              <div className="p-4 bg-primary/10 border border-primary/20 text-primary rounded-lg animate-fade-in">
                {successMessage}
              </div>
            )}

            <Card className="border-0 shadow-lg-custom bg-card">
              <CardHeader>
                <CardTitle className="text-xl font-display">Account Information</CardTitle>
                <CardDescription>Your account details</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3 p-4 bg-muted rounded-lg">
                  <Mail className="w-5 h-5 text-primary" />
                  <div>
                    <p className="text-sm font-medium text-foreground">Email</p>
                    <p className="text-sm text-muted-foreground">{userData.email || 'Not available'}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-4 bg-muted rounded-lg">
                  <UserIcon className="w-5 h-5 text-primary" />
                  <div>
                    <p className="text-sm font-medium text-foreground">Full Name</p>
                    <p className="text-sm text-muted-foreground">{userData.full_name || 'Not provided'}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-4 bg-muted rounded-lg">
                  <Shield className="w-5 h-5 text-primary" />
                  <div>
                    <p className="text-sm font-medium text-foreground">Account Type</p>
                    <p className="text-sm text-muted-foreground capitalize">{userRole}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg-custom bg-card">
              <CardHeader>
                <CardTitle className="text-xl font-display">Notification Preferences</CardTitle>
                <CardDescription>Choose how you want to be notified</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
                  <div>
                    <label className="text-sm font-medium text-foreground flex items-center gap-2">
                      <Mail className="w-4 h-4" />
                      Email Notifications
                    </label>
                    <p className="text-xs text-muted-foreground">Receive email updates about your reports</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={settings.email_notifications}
                    onChange={(e) => setSettings({ ...settings, email_notifications: e.target.checked })}
                    className="w-4 h-4 rounded border-input"
                  />
                </div>
                <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
                  <div>
                    <label className="text-sm font-medium text-foreground flex items-center gap-2">
                      <Phone className="w-4 h-4" />
                      SMS Notifications
                    </label>
                    <p className="text-xs text-muted-foreground">Receive SMS alerts for urgent updates</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={settings.sms_notifications}
                    onChange={(e) => setSettings({ ...settings, sms_notifications: e.target.checked })}
                    className="w-4 h-4 rounded border-input"
                  />
                </div>
                <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
                  <div>
                    <label className="text-sm font-medium text-foreground flex items-center gap-2">
                      <Bell className="w-4 h-4" />
                      Report Status Updates
                    </label>
                    <p className="text-xs text-muted-foreground">Get notified when your report status changes</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={settings.report_updates}
                    onChange={(e) => setSettings({ ...settings, report_updates: e.target.checked })}
                    className="w-4 h-4 rounded border-input"
                  />
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg-custom bg-card">
              <CardHeader>
                <CardTitle className="text-xl font-display">Privacy Settings</CardTitle>
                <CardDescription>Control your privacy preferences</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
                  <div>
                    <label className="text-sm font-medium text-foreground flex items-center gap-2">
                      <Lock className="w-4 h-4" />
                      Anonymous by Default
                    </label>
                    <p className="text-xs text-muted-foreground">Submit reports anonymously by default</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={settings.anonymous_by_default}
                    onChange={(e) => setSettings({ ...settings, anonymous_by_default: e.target.checked })}
                    className="w-4 h-4 rounded border-input"
                  />
                </div>
              </CardContent>
            </Card>

            <div className="flex justify-end">
              <Button
                onClick={() => {
                  // Save settings (would call API in production)
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
        <main className="flex-1 p-8">
          <div className="max-w-6xl mx-auto">
            {renderContent()}
          </div>
        </main>
      </div>
    </div>
  );
};

export default UserDashboard;
