import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useReport, useReportVersions } from '@/features/reports/hooks/use-reports';
import { ReportViewer } from '@/components/reports/ReportViewer';
import { ReportStatusBadge } from '@/components/shared/ReportStatusBadge';
import { formatDateTime } from '@/utils';
import { ArrowLeft, History } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';

export const ReportDetailView: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const { data: report, isLoading } = useReport(id as string);
  const { data: versions } = useReportVersions(id as string);

  const [selectedVersionData, setSelectedVersionData] = useState<any | null>(null);

  if (isLoading || !report) {
    return <div className="p-8 text-center">Loading report details...</div>;
  }

  return (
    <div className="space-y-6 pb-20">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
            Report Details
            <ReportStatusBadge status={report.currentStatus} />
          </h1>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3 space-y-6">
          <ReportViewer report={report} />
        </div>
        
        <div className="lg:col-span-1">
          <Card className="sticky top-20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <History className="h-4 w-4" />
                Version History
              </CardTitle>
            </CardHeader>
            <CardContent>
              {(!versions || versions.length === 0) ? (
                <p className="text-sm text-muted-foreground">No previous versions available.</p>
              ) : (
                <div className="space-y-4">
                  {/* Current Version */}
                  <div className="p-3 border-l-2 border-primary bg-primary/5 rounded-r">
                    <div className="flex flex-wrap items-center justify-between gap-2 mb-1">
                      <span className="text-sm font-semibold text-primary">v{report.currentVersion} (Current)</span>
                      <ReportStatusBadge status={report.currentStatus} className="text-[10px] h-auto py-0.5 px-2" />
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Updated {formatDateTime(report.updatedAt)}
                    </div>
                  </div>
                  
                  {/* Previous Versions */}
                  {versions.sort((a,b) => (b.versionNumber || b.version || 0) - (a.versionNumber || a.version || 0)).map(v => (
                    <div key={v._id} className="p-3 border-l-2 border-muted bg-slate-50 hover:bg-slate-100 transition-colors rounded-r cursor-pointer" onClick={() => setSelectedVersionData(v.snapshot || v.data)}>
                      <div className="flex flex-wrap items-center justify-between gap-2 mb-1">
                        <span className="text-sm font-medium">v{v.versionNumber || v.version}</span>
                        <ReportStatusBadge status={v.statusAtSubmission} className="text-[10px] h-auto py-0.5 px-2" />
                      </div>
                      <div className="text-xs text-muted-foreground mb-2">
                        Submitted {formatDateTime(v.submittedAt)}
                      </div>
                      <span className="text-xs text-primary hover:underline font-medium">View Version</span>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Historical Version Dialog */}
      <Dialog open={!!selectedVersionData} onOpenChange={(open: boolean) => !open && setSelectedVersionData(null)}>
        <DialogContent className="max-w-4xl max-h-[90vh] flex flex-col p-0">
          <DialogHeader className="px-6 py-4 border-b">
            <DialogTitle>Historical Version View</DialogTitle>
          </DialogHeader>
          <div className="flex-1 overflow-y-auto p-6">
            {selectedVersionData && (
              <ReportViewer report={{ ...report, ...selectedVersionData }} />
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};
