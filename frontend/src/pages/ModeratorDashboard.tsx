/**
 * Moderator Dashboard
 * Enhanced dashboard with full user details, notes history, and additional features
 */
import { useState, useEffect, ChangeEvent } from 'react';
import Nav from '../components/Nav';
import DashboardSidebar from '../components/DashboardSidebar';
import { moderatorAPI } from '../services/api';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Filter, FileText, Clock, CheckCircle, XCircle, AlertCircle, Loader2, Send, 
  MessageSquare, User, Mail, Phone, MapPin, Calendar, AlertTriangle, 
  TrendingUp, Download, Eye, History, Shield
} from 'lucide-react';

interface Report {
  id: number;
  title: string;
  description: string;
  category: string;
  subcategory?: string;
  status: string;
  evidence?: string;
  location?: string;
  incident_date?: string;
  severity?: string;
  urgency?: string;
  contact_phone?: string;
  preferred_contact_method?: string;
  witnesses?: string;
  perpetrator_info?: string;
  file_attachments?: any[];
  created_at: string;
  updated_at: string;
  user?: {
    id: number;
    email: string;
    full_name: string;
    role: string;
    created_at: string;
  };
  notes?: ModeratorNote[];
}

interface ModeratorNote {
  id: number;
  note: string;
  created_at: string;
  moderator?: {
    email: string;
    full_name: string;
  };
}

const ModeratorDashboard = () => {
  const [activeTab, setActiveTab] = useState('queue');
  const [reports, setReports] = useState<Report[]>([]);
  const [reviewedReports, setReviewedReports] = useState<Report[]>([]);
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [statusFilter, setStatusFilter] = useState('all');
  const [reviewedStatusFilter, setReviewedStatusFilter] = useState('all');
  const [note, setNote] = useState('');
  const [newStatus, setNewStatus] = useState('');
  const [loading, setLoading] = useState(true);
  const [reviewedLoading, setReviewedLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const userRole = localStorage.getItem('user_role') || 'moderator';
  
  // Settings state
  const [settings, setSettings] = useState({
    email_notifications: true,
    sms_notifications: false,
    auto_assign_reports: false,
    default_status: 'in_review',
  });

  useEffect(() => {
    if (activeTab === 'queue') {
      loadReports();
    } else if (activeTab === 'reviewed') {
      loadReviewedReports();
    }
  }, [statusFilter, reviewedStatusFilter, activeTab]);

  useEffect(() => {
    if (selectedReport) {
      loadReportDetails(selectedReport.id);
    }
  }, [selectedReport?.id]);

  const loadReports = async () => {
    try {
      setLoading(true);
      const response = await moderatorAPI.getQueue(statusFilter);
      setReports(response.data);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to load reports');
    } finally {
      setLoading(false);
    }
  };

  const loadReviewedReports = async () => {
    try {
      setReviewedLoading(true);
      const response = await moderatorAPI.getReviewedReports(reviewedStatusFilter);
      setReviewedReports(response.data);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to load reviewed reports');
    } finally {
      setReviewedLoading(false);
    }
  };

  const loadReportDetails = async (reportId: number) => {
    try {
      const response = await moderatorAPI.getReportDetails(reportId);
      setSelectedReport(response.data);
    } catch (err: any) {
      console.error('Failed to load report details:', err);
    }
  };

  const handleAddNote = async () => {
    if (!selectedReport || !note.trim()) return;

    try {
      const data: { note: string; status?: string } = { note: note.trim() };
      if (newStatus && newStatus !== selectedReport.status) {
        data.status = newStatus;
      }
      await moderatorAPI.addNote(selectedReport.id, data);
      setNote('');
      setNewStatus('');
      setSuccessMessage('Note added and status updated successfully!');
      setTimeout(() => setSuccessMessage(''), 3000);
      loadReportDetails(selectedReport.id);
      loadReports();
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to add note');
      setTimeout(() => setError(''), 5000);
    }
  };

  const getStatusBadge = (status: string) => {
    const statusConfig: Record<string, { icon: any; color: string; bg: string }> = {
      pending: { icon: Clock, color: 'text-yellow-600', bg: 'bg-yellow-50 border-yellow-200' },
      in_review: { icon: AlertCircle, color: 'text-blue-600', bg: 'bg-blue-50 border-blue-200' },
      resolved: { icon: CheckCircle, color: 'text-green-600', bg: 'bg-green-50 border-green-200' },
      rejected: { icon: XCircle, color: 'text-red-600', bg: 'bg-red-50 border-red-200' },
    };
    const config = statusConfig[status] || statusConfig.pending;
    const Icon = config.icon;
    return (
      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border ${config.bg} ${config.color}`}>
        <Icon className="w-3.5 h-3.5" />
        {status.replace('_', ' ').toUpperCase()}
      </span>
    );
  };

  const getSeverityBadge = (severity?: string) => {
    if (!severity) return null;
    const config: Record<string, { color: string; bg: string }> = {
      low: { color: 'text-green-600', bg: 'bg-green-50 border-green-200' },
      medium: { color: 'text-yellow-600', bg: 'bg-yellow-50 border-yellow-200' },
      high: { color: 'text-orange-600', bg: 'bg-orange-50 border-orange-200' },
      critical: { color: 'text-red-600', bg: 'bg-red-50 border-red-200' },
    };
    const style = config[severity] || config.medium;
    return (
      <span className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium border ${style.bg} ${style.color}`}>
        {severity.toUpperCase()}
      </span>
    );
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'queue':
        return (
          <div className="space-y-6 animate-fade-up">
            <div>
              <h2 className="text-3xl font-display font-bold text-foreground mb-2">Reports Queue</h2>
              <p className="text-muted-foreground">Review and manage incoming reports</p>
            </div>

            <Card className="border-0 shadow-lg-custom bg-card">
              <CardContent className="p-4">
                <div className="flex items-center gap-4">
                  <Filter className="w-5 h-5 text-muted-foreground" />
                  <label className="text-sm font-medium text-foreground">Filter by Status</label>
                  <select
                    value={statusFilter}
                    onChange={(e: ChangeEvent<HTMLSelectElement>) => setStatusFilter(e.target.value)}
                    className="flex-1 px-4 py-2 bg-background border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-all duration-200"
                  >
                    <option value="all">All (Pending + In Review)</option>
                    <option value="pending">Pending</option>
                    <option value="in_review">In Review</option>
                    <option value="resolved">Resolved</option>
                    <option value="rejected">Rejected</option>
                  </select>
                </div>
              </CardContent>
            </Card>

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

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Reports List */}
              <Card className="border-0 shadow-lg-custom bg-card">
                <CardHeader>
                  <CardTitle className="text-xl font-display">Reports Queue</CardTitle>
                  <CardDescription>{reports.length} reports in queue</CardDescription>
                </CardHeader>
                <CardContent>
                  {loading ? (
                    <div className="flex items-center justify-center py-12">
                      <Loader2 className="w-8 h-8 animate-spin text-primary" />
                    </div>
                  ) : reports.length === 0 ? (
                    <div className="text-center py-12 text-muted-foreground">
                      <FileText className="w-12 h-12 mx-auto mb-4 opacity-50" />
                      <p>No reports found</p>
                    </div>
                  ) : (
                    <div className="space-y-3 max-h-[600px] overflow-y-auto">
                      {reports.map((report) => (
                        <div
                          key={report.id}
                          onClick={() => setSelectedReport(report)}
                          className={`p-4 rounded-lg border cursor-pointer transition-all duration-200 ${
                            selectedReport?.id === report.id
                              ? 'border-primary bg-primary/5 shadow-md scale-[1.02]'
                              : 'border-border bg-background hover:border-primary/50 hover:shadow-sm'
                          }`}
                        >
                          <div className="flex justify-between items-start gap-4 mb-2">
                            <div className="flex-1 min-w-0">
                              <h4 className="font-semibold text-foreground mb-1 truncate">{report.title}</h4>
                              <div className="flex items-center gap-2 flex-wrap">
                                <span className="text-xs text-muted-foreground">{report.category}</span>
                                {report.subcategory && (
                                  <span className="text-xs text-muted-foreground">• {report.subcategory}</span>
                                )}
                                {getSeverityBadge(report.severity)}
                              </div>
                            </div>
                            {getStatusBadge(report.status)}
                          </div>
                          {report.user && (
                            <div className="flex items-center gap-2 text-xs text-muted-foreground mt-2">
                              <User className="w-3 h-3" />
                              <span>{report.user.full_name || report.user.email}</span>
                            </div>
                          )}
                          {report.notes && report.notes.length > 0 && (
                            <div className="flex items-center gap-1 text-xs text-primary mt-2">
                              <MessageSquare className="w-3 h-3" />
                              <span>{report.notes.length} note{report.notes.length !== 1 ? 's' : ''}</span>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Report Details & Review Panel */}
              <Card className="border-0 shadow-lg-custom bg-card">
                <CardHeader>
                  <CardTitle className="text-xl font-display">Review Report</CardTitle>
                  <CardDescription>View details and add notes</CardDescription>
                </CardHeader>
                <CardContent>
                  {selectedReport ? (
                    <div className="space-y-6 max-h-[600px] overflow-y-auto">
                      {/* User Details Section */}
                      {selectedReport.user && (
                        <div className="p-4 bg-gradient-primary/5 rounded-lg border border-primary/20">
                          <div className="flex items-center gap-2 mb-3">
                            <User className="w-5 h-5 text-primary" />
                            <h3 className="font-semibold text-foreground">Reporter Information</h3>
                          </div>
                          <div className="grid grid-cols-1 gap-2 text-sm">
                            <div className="flex items-center gap-2">
                              <Mail className="w-4 h-4 text-muted-foreground" />
                              <span className="text-foreground font-medium">Email:</span>
                              <span className="text-muted-foreground">{selectedReport.user.email}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <User className="w-4 h-4 text-muted-foreground" />
                              <span className="text-foreground font-medium">Name:</span>
                              <span className="text-muted-foreground">{selectedReport.user.full_name || 'Not provided'}</span>
                            </div>
                            {selectedReport.contact_phone && (
                              <div className="flex items-center gap-2">
                                <Phone className="w-4 h-4 text-muted-foreground" />
                                <span className="text-foreground font-medium">Phone:</span>
                                <span className="text-muted-foreground">{selectedReport.contact_phone}</span>
                              </div>
                            )}
                            {selectedReport.preferred_contact_method && (
                              <div className="flex items-center gap-2">
                                <span className="text-foreground font-medium">Preferred Contact:</span>
                                <span className="text-muted-foreground capitalize">{selectedReport.preferred_contact_method}</span>
                              </div>
                            )}
                            <div className="flex items-center gap-2">
                              <Calendar className="w-4 h-4 text-muted-foreground" />
                              <span className="text-foreground font-medium">Member Since:</span>
                              <span className="text-muted-foreground">
                                {new Date(selectedReport.user.created_at).toLocaleDateString()}
                              </span>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Report Details */}
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-foreground flex items-center gap-2">
                            <FileText className="w-4 h-4" />
                            Title
                          </label>
                          <p className="p-3 bg-muted rounded-lg text-sm">{selectedReport.title}</p>
                        </div>
                        
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-foreground">Description</label>
                          <p className="p-3 bg-muted rounded-lg text-sm whitespace-pre-wrap">{selectedReport.description}</p>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <label className="text-sm font-medium text-foreground">Category</label>
                            <p className="p-2 bg-muted rounded-lg text-sm">{selectedReport.category}</p>
                          </div>
                          {selectedReport.subcategory && (
                            <div className="space-y-2">
                              <label className="text-sm font-medium text-foreground">Subcategory</label>
                              <p className="p-2 bg-muted rounded-lg text-sm">{selectedReport.subcategory}</p>
                            </div>
                          )}
                        </div>

                        {selectedReport.location && (
                          <div className="space-y-2">
                            <label className="text-sm font-medium text-foreground flex items-center gap-2">
                              <MapPin className="w-4 h-4" />
                              Location
                            </label>
                            <p className="p-3 bg-muted rounded-lg text-sm">{selectedReport.location}</p>
                          </div>
                        )}

                        {selectedReport.incident_date && (
                          <div className="space-y-2">
                            <label className="text-sm font-medium text-foreground flex items-center gap-2">
                              <Calendar className="w-4 h-4" />
                              Incident Date & Time
                            </label>
                            <p className="p-3 bg-muted rounded-lg text-sm">
                              {new Date(selectedReport.incident_date).toLocaleString()}
                            </p>
                          </div>
                        )}

                        {selectedReport.witnesses && (
                          <div className="space-y-2">
                            <label className="text-sm font-medium text-foreground">Witnesses</label>
                            <p className="p-3 bg-muted rounded-lg text-sm whitespace-pre-wrap">{selectedReport.witnesses}</p>
                          </div>
                        )}

                        {selectedReport.perpetrator_info && (
                          <div className="space-y-2">
                            <label className="text-sm font-medium text-foreground">Perpetrator Information</label>
                            <p className="p-3 bg-muted rounded-lg text-sm whitespace-pre-wrap">{selectedReport.perpetrator_info}</p>
                          </div>
                        )}

                        {selectedReport.evidence && (
                          <div className="space-y-2">
                            <label className="text-sm font-medium text-foreground">Evidence</label>
                            <p className="p-3 bg-muted rounded-lg text-sm whitespace-pre-wrap">{selectedReport.evidence}</p>
                          </div>
                        )}

                        {selectedReport.file_attachments && selectedReport.file_attachments.length > 0 && (
                          <div className="space-y-2">
                            <label className="text-sm font-medium text-foreground">File Attachments</label>
                            <div className="space-y-2">
                              {selectedReport.file_attachments.map((file: any, index: number) => (
                                <a
                                  key={index}
                                  href={file.url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="flex items-center gap-2 p-2 bg-muted rounded-lg hover:bg-muted/80 transition-colors"
                                >
                                  <FileText className="w-4 h-4 text-primary" />
                                  <span className="text-sm text-foreground">{file.name}</span>
                                  <span className="text-xs text-muted-foreground ml-auto">
                                    ({(file.size / 1024).toFixed(1)} KB)
                                  </span>
                                </a>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Notes History */}
                      {selectedReport.notes && selectedReport.notes.length > 0 && (
                        <div className="space-y-3 pt-4 border-t border-border">
                          <div className="flex items-center gap-2">
                            <History className="w-5 h-5 text-primary" />
                            <h3 className="font-semibold text-foreground">Notes History</h3>
                          </div>
                          <div className="space-y-3">
                            {selectedReport.notes.map((note: ModeratorNote) => (
                              <div key={note.id} className="p-3 bg-muted rounded-lg">
                                <div className="flex items-start justify-between mb-2">
                                  <div className="flex items-center gap-2">
                                    <Shield className="w-4 h-4 text-primary" />
                                    <span className="text-xs font-medium text-foreground">
                                      {note.moderator?.full_name || note.moderator?.email || 'Moderator'}
                                    </span>
                                  </div>
                                  <span className="text-xs text-muted-foreground">
                                    {new Date(note.created_at).toLocaleString()}
                                  </span>
                                </div>
                                <p className="text-sm text-foreground whitespace-pre-wrap">{note.note}</p>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Add Note Section */}
                      <div className="space-y-4 pt-4 border-t border-border">
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-foreground">Update Status</label>
                          <select
                            value={newStatus || selectedReport.status}
                            onChange={(e: ChangeEvent<HTMLSelectElement>) => setNewStatus(e.target.value)}
                            className="w-full px-4 py-3 bg-background border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-all duration-200"
                          >
                            <option value="pending">Pending</option>
                            <option value="in_review">In Review</option>
                            <option value="resolved">Resolved</option>
                            <option value="rejected">Rejected</option>
                          </select>
                        </div>

                        <div className="space-y-2">
                          <label className="text-sm font-medium text-foreground flex items-center gap-2">
                            <MessageSquare className="w-4 h-4" />
                            Add Note (Visible to User)
                          </label>
                          <textarea
                            rows={4}
                            value={note}
                            onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setNote(e.target.value)}
                            className="w-full px-4 py-3 bg-background border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-all duration-200 resize-none"
                            placeholder="Add your review notes. This will be visible to the user..."
                          />
                          <p className="text-xs text-muted-foreground">
                            Notes are visible to the user who submitted the report
                          </p>
                        </div>

                        <Button
                          onClick={handleAddNote}
                          disabled={!note.trim()}
                          className="w-full bg-gradient-primary hover:shadow-glow transition-all duration-300 rounded-lg h-12"
                          size="lg"
                        >
                          <Send className="w-4 h-4 mr-2" />
                          Save Note & Update Status
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center py-12 text-muted-foreground">
                      <div className="text-center">
                        <FileText className="w-12 h-12 mx-auto mb-4 opacity-50" />
                        <p>Select a report to review</p>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        );

      case 'reviewed':
        return (
          <div className="space-y-6 animate-fade-up">
            <div>
              <h2 className="text-3xl font-display font-bold text-foreground mb-2">Reviewed Reports</h2>
              <p className="text-muted-foreground">Reports you have reviewed</p>
            </div>

            <Card className="border-0 shadow-lg-custom bg-card">
              <CardContent className="p-4">
                <div className="flex items-center gap-4">
                  <Filter className="w-5 h-5 text-muted-foreground" />
                  <label className="text-sm font-medium text-foreground">Filter by Status</label>
                  <select
                    value={reviewedStatusFilter}
                    onChange={(e: ChangeEvent<HTMLSelectElement>) => setReviewedStatusFilter(e.target.value)}
                    className="flex-1 px-4 py-2 bg-background border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-all duration-200"
                  >
                    <option value="all">All Statuses</option>
                    <option value="pending">Pending</option>
                    <option value="in_review">In Review</option>
                    <option value="resolved">Resolved</option>
                    <option value="rejected">Rejected</option>
                  </select>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg-custom bg-card">
              <CardHeader>
                <CardTitle className="text-xl font-display">Reviewed Reports</CardTitle>
                <CardDescription>{reviewedReports.length} reports reviewed by you</CardDescription>
              </CardHeader>
              <CardContent>
                {reviewedLoading ? (
                  <div className="flex items-center justify-center py-12">
                    <Loader2 className="w-8 h-8 animate-spin text-primary" />
                  </div>
                ) : reviewedReports.length === 0 ? (
                  <div className="text-center py-12 text-muted-foreground">
                    <FileText className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>No reviewed reports found</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {reviewedReports.map((report) => (
                      <div
                        key={report.id}
                        onClick={() => setSelectedReport(report)}
                        className={`p-4 rounded-lg border cursor-pointer transition-all duration-200 ${
                          selectedReport?.id === report.id
                            ? 'border-primary bg-primary/5 shadow-md scale-[1.02]'
                            : 'border-border bg-background hover:border-primary/50 hover:shadow-sm'
                        }`}
                      >
                        <div className="flex justify-between items-start gap-4 mb-2">
                          <div className="flex-1 min-w-0">
                            <h4 className="font-semibold text-foreground mb-1 truncate">{report.title}</h4>
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="text-xs text-muted-foreground">{report.category}</span>
                              {report.subcategory && (
                                <span className="text-xs text-muted-foreground">• {report.subcategory}</span>
                              )}
                              {getSeverityBadge(report.severity)}
                            </div>
                          </div>
                          {getStatusBadge(report.status)}
                        </div>
                        {report.user && (
                          <div className="flex items-center gap-2 text-xs text-muted-foreground mt-2">
                            <User className="w-3 h-3" />
                            <span>{report.user.full_name || report.user.email}</span>
                          </div>
                        )}
                        {report.notes && report.notes.length > 0 && (
                          <div className="flex items-center gap-1 text-xs text-primary mt-2">
                            <MessageSquare className="w-3 h-3" />
                            <span>{report.notes.length} note{report.notes.length !== 1 ? 's' : ''}</span>
                            <span className="text-muted-foreground ml-2">
                              • Last reviewed {new Date(report.updated_at).toLocaleDateString()}
                            </span>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {selectedReport && (
              <Card className="border-0 shadow-lg-custom bg-card">
                <CardHeader>
                  <CardTitle className="text-xl font-display">Report Details</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-foreground">Title</label>
                      <p className="p-3 bg-muted rounded-lg text-sm">{selectedReport.title}</p>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-foreground">Description</label>
                      <p className="p-3 bg-muted rounded-lg text-sm whitespace-pre-wrap">{selectedReport.description}</p>
                    </div>
                    {selectedReport.notes && selectedReport.notes.length > 0 && (
                      <div className="space-y-3 pt-4 border-t border-border">
                        <h3 className="font-semibold text-foreground">Your Notes</h3>
                        {selectedReport.notes.map((note: ModeratorNote) => (
                          <div key={note.id} className="p-3 bg-primary/5 rounded-lg border border-primary/20">
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-xs font-medium text-foreground">Your Note</span>
                              <span className="text-xs text-muted-foreground">
                                {new Date(note.created_at).toLocaleString()}
                              </span>
                            </div>
                            <p className="text-sm text-foreground whitespace-pre-wrap">{note.note}</p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        );

      case 'settings':
        return (
          <div className="space-y-6 animate-fade-up">
            <div>
              <h2 className="text-3xl font-display font-bold text-foreground mb-2">Settings</h2>
              <p className="text-muted-foreground">Manage your moderator preferences and account settings</p>
            </div>

            <Card className="border-0 shadow-lg-custom bg-card">
              <CardHeader>
                <CardTitle className="text-xl font-display">Notification Preferences</CardTitle>
                <CardDescription>Choose how you want to be notified about new reports</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
                  <div>
                    <label className="text-sm font-medium text-foreground">Email Notifications</label>
                    <p className="text-xs text-muted-foreground">Receive email alerts for new reports</p>
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
                    <label className="text-sm font-medium text-foreground">SMS Notifications</label>
                    <p className="text-xs text-muted-foreground">Receive SMS alerts for urgent reports</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={settings.sms_notifications}
                    onChange={(e) => setSettings({ ...settings, sms_notifications: e.target.checked })}
                    className="w-4 h-4 rounded border-input"
                  />
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg-custom bg-card">
              <CardHeader>
                <CardTitle className="text-xl font-display">Review Preferences</CardTitle>
                <CardDescription>Configure your review workflow settings</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
                  <div>
                    <label className="text-sm font-medium text-foreground">Auto-Assign Reports</label>
                    <p className="text-xs text-muted-foreground">Automatically assign new reports to you</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={settings.auto_assign_reports}
                    onChange={(e) => setSettings({ ...settings, auto_assign_reports: e.target.checked })}
                    className="w-4 h-4 rounded border-input"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Default Status</label>
                  <select
                    value={settings.default_status}
                    onChange={(e) => setSettings({ ...settings, default_status: e.target.value })}
                    className="w-full px-4 py-3 bg-background border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-all duration-200"
                  >
                    <option value="in_review">In Review</option>
                    <option value="pending">Pending</option>
                    <option value="resolved">Resolved</option>
                  </select>
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
          <div className="max-w-7xl mx-auto">
            {renderContent()}
          </div>
        </main>
      </div>
    </div>
  );
};

export default ModeratorDashboard;
