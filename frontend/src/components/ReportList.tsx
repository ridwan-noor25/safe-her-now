/**
 * Report list component
 * Displays reports in a table format with status badges
 */
import { useState, useEffect } from 'react';
import { reportsAPI } from '../services/api';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText, Clock, CheckCircle, XCircle, AlertCircle, Loader2 } from 'lucide-react';

interface Report {
  id: number;
  title: string;
  category: string;
  status: string;
  created_at: string;
  user?: {
    email: string;
  };
}

interface ReportListProps {
  showAll?: boolean;
  onReportClick?: (report: Report) => void;
}

const ReportList = ({ showAll = false, onReportClick }: ReportListProps) => {
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadReports();
  }, [showAll]);

  const loadReports = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await reportsAPI.getAll(showAll);
      setReports(response.data || []);
    } catch (err: any) {
      console.error('Error loading reports:', err);
      setError(err.response?.data?.error || 'Failed to load reports');
      setReports([]);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const statusConfig: Record<string, { icon: any; color: string; bg: string }> = {
      pending: {
        icon: Clock,
        color: 'text-yellow-600',
        bg: 'bg-yellow-50 border-yellow-200',
      },
      in_review: {
        icon: AlertCircle,
        color: 'text-blue-600',
        bg: 'bg-blue-50 border-blue-200',
      },
      resolved: {
        icon: CheckCircle,
        color: 'text-green-600',
        bg: 'bg-green-50 border-green-200',
      },
      rejected: {
        icon: XCircle,
        color: 'text-red-600',
        bg: 'bg-red-50 border-red-200',
      },
    };

    const config = statusConfig[status] || statusConfig.pending;
    const Icon = config.icon;

    return (
      <span
        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border ${config.bg} ${config.color}`}
      >
        <Icon className="w-3.5 h-3.5" />
        {status.replace('_', ' ').toUpperCase()}
      </span>
    );
  };

  if (loading) {
    return (
      <Card className="border-0 shadow-lg-custom bg-card animate-fade-up">
        <CardContent className="flex items-center justify-center py-12">
          <div className="text-center">
            <Loader2 className="w-8 h-8 animate-spin text-primary mx-auto mb-4" />
            <p className="text-muted-foreground">Loading reports...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="border-0 shadow-lg-custom bg-card animate-fade-up">
        <CardContent className="py-12">
          <div className="text-center text-destructive">
            <AlertCircle className="w-8 h-8 mx-auto mb-4" />
            <p>{error}</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (reports.length === 0) {
    return (
      <Card className="border-0 shadow-lg-custom bg-card animate-fade-up">
        <CardContent className="py-12">
          <div className="text-center text-muted-foreground">
            <FileText className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p className="text-lg font-medium">No reports found</p>
            <p className="text-sm mt-2">Submit your first report to get started</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-0 shadow-lg-custom bg-card animate-fade-up">
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-gradient-accent rounded-xl flex items-center justify-center shadow-glow">
            <FileText className="w-6 h-6 text-white" />
          </div>
          <div>
            <CardTitle className="text-2xl font-display">Reports</CardTitle>
            <CardDescription>{reports.length} {reports.length === 1 ? 'report' : 'reports'} found</CardDescription>
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="space-y-3">
          {reports.map((report) => (
            <div
              key={report.id}
              onClick={() => onReportClick && onReportClick(report)}
              className={`p-4 rounded-lg border border-border bg-background hover:border-primary/50 hover:shadow-md transition-all duration-200 cursor-pointer ${
                onReportClick ? 'hover:scale-[1.02]' : ''
              }`}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-foreground mb-1 truncate">{report.title}</h3>
                  <div className="flex items-center gap-3 text-sm text-muted-foreground mb-2">
                    <span className="px-2 py-0.5 bg-secondary rounded-md">{report.category}</span>
                    <span>{new Date(report.created_at).toLocaleDateString()}</span>
                  </div>
                  {showAll && report.user && (
                    <p className="text-xs text-muted-foreground">By: {report.user.email}</p>
                  )}
                </div>
                <div className="flex-shrink-0">
                  {getStatusBadge(report.status)}
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default ReportList;
