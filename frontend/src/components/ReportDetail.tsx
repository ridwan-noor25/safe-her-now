/**
 * Report Detail Component
 * Shows full report details with moderator notes for users
 */
import { useState, useEffect } from 'react';
import { reportsAPI } from '../services/api';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  FileText, Clock, CheckCircle, XCircle, AlertCircle, Loader2, 
  MessageSquare, Shield, Calendar, MapPin, User, Mail, Phone
} from 'lucide-react';

interface Report {
  id: number;
  title: string;
  description: string;
  category: string;
  subcategory?: string;
  status: string;
  location?: string;
  incident_date?: string;
  severity?: string;
  urgency?: string;
  evidence?: string;
  file_attachments?: any[];
  created_at: string;
  updated_at: string;
  notes?: ModeratorNote[];
  resolution_notes?: string;
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

interface ReportDetailProps {
  reportId: number;
  onClose?: () => void;
}

const ReportDetail = ({ reportId, onClose }: ReportDetailProps) => {
  const [report, setReport] = useState<Report | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadReport();
  }, [reportId]);

  const loadReport = async () => {
    try {
      setLoading(true);
      const response = await reportsAPI.getOne(reportId);
      setReport(response.data);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to load report');
    } finally {
      setLoading(false);
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

  if (loading) {
    return (
      <Card className="border-0 shadow-lg-custom bg-card">
        <CardContent className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </CardContent>
      </Card>
    );
  }

  if (error || !report) {
    return (
      <Card className="border-0 shadow-lg-custom bg-card">
        <CardContent className="py-12">
          <div className="text-center text-destructive">
            <AlertCircle className="w-8 h-8 mx-auto mb-4" />
            <p>{error || 'Report not found'}</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-0 shadow-lg-custom bg-card">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-2xl font-display mb-2">{report.title}</CardTitle>
            <CardDescription>
              Submitted on {new Date(report.created_at).toLocaleDateString()}
            </CardDescription>
          </div>
          {getStatusBadge(report.status)}
        </div>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Report Details */}
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Description</label>
            <p className="p-3 bg-muted rounded-lg text-sm whitespace-pre-wrap">{report.description}</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Category</label>
              <p className="p-2 bg-muted rounded-lg text-sm">{report.category}</p>
            </div>
            {report.subcategory && (
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Subcategory</label>
                <p className="p-2 bg-muted rounded-lg text-sm">{report.subcategory}</p>
              </div>
            )}
          </div>

          {report.location && (
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                Location
              </label>
              <p className="p-3 bg-muted rounded-lg text-sm">{report.location}</p>
            </div>
          )}

          {report.incident_date && (
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                Incident Date & Time
              </label>
              <p className="p-3 bg-muted rounded-lg text-sm">
                {new Date(report.incident_date).toLocaleString()}
              </p>
            </div>
          )}

          {report.evidence && (
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Evidence</label>
              <p className="p-3 bg-muted rounded-lg text-sm whitespace-pre-wrap">{report.evidence}</p>
            </div>
          )}

          {report.file_attachments && report.file_attachments.length > 0 && (
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">File Attachments</label>
              <div className="space-y-2">
                {report.file_attachments.map((file: any, index: number) => (
                  <a
                    key={index}
                    href={file.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 p-2 bg-muted rounded-lg hover:bg-muted/80 transition-colors"
                  >
                    <FileText className="w-4 h-4 text-primary" />
                    <span className="text-sm text-foreground">{file.name}</span>
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Resolution Notes */}
        {report.resolution_notes && (
          <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle className="w-5 h-5 text-green-600" />
              <h3 className="font-semibold text-green-900">Resolution Notes</h3>
            </div>
            <p className="text-sm text-green-800 whitespace-pre-wrap">{report.resolution_notes}</p>
          </div>
        )}

        {/* Moderator Notes */}
        {report.notes && report.notes.length > 0 && (
          <div className="space-y-4 pt-4 border-t border-border">
            <div className="flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-primary" />
              <h3 className="font-semibold text-foreground">Moderator Notes</h3>
              <span className="text-sm text-muted-foreground">({report.notes.length})</span>
            </div>
            <div className="space-y-3">
              {report.notes.map((note: ModeratorNote) => (
                <div key={note.id} className="p-4 bg-primary/5 rounded-lg border border-primary/20">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Shield className="w-4 h-4 text-primary" />
                      <span className="text-sm font-medium text-foreground">
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

        {(!report.notes || report.notes.length === 0) && report.status === 'pending' && (
          <div className="p-4 bg-muted rounded-lg text-center">
            <Clock className="w-8 h-8 mx-auto mb-2 text-muted-foreground opacity-50" />
            <p className="text-sm text-muted-foreground">
              Your report is pending review. A moderator will review it soon.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ReportDetail;

