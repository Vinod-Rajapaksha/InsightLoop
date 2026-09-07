import React from 'react';
import { useAuth } from '@/app/providers/auth-provider';
import { useMyReports } from '@/features/reports/hooks/use-reports';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PlusCircle, ArrowRight, FileText, Clock, AlertCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { ReportStatusBadge } from '@/components/shared/ReportStatusBadge';
import { formatDate } from '@/utils';
import { ReportStatus } from '@/types';

export const MemberDashboardComponent: React.FC = () => {
  const { user } = useAuth();
  const { data: reports, isLoading } = useMyReports();

  // Assuming reports are sorted descending by weekStart or createdAt
  const latestReport = reports?.[0];
  const needsCorrection = reports?.filter(r => r.currentStatus === ReportStatus.NEEDS_CORRECTION) || [];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground mt-1">
          Welcome back, {user?.firstName}. Here's your weekly overview.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Reports</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{reports?.length || 0}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Needs Correction</CardTitle>
            <AlertCircle className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{needsCorrection.length}</div>
          </CardContent>
        </Card>

        <Card className="bg-primary/5 border-primary/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-primary">Quick Action</CardTitle>
            <PlusCircle className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <Button asChild className="w-full mt-2" size="sm">
              <Link to="/member/reports/new">Create New Report</Link>
            </Button>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Latest Report Status */}
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Current Week Status</CardTitle>
            <CardDescription>Your most recent report submission</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-2">
                <div className="h-4 w-1/2 bg-muted animate-pulse rounded"></div>
                <div className="h-4 w-3/4 bg-muted animate-pulse rounded"></div>
              </div>
            ) : latestReport ? (
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-muted-foreground">Week of</span>
                  <span className="font-semibold">{formatDate(latestReport.weekStart)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-muted-foreground">Project</span>
                  <span className="font-semibold">
                    {typeof latestReport.project === 'object' ? latestReport.project.name : 'Project ID'}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-muted-foreground">Status</span>
                  <ReportStatusBadge status={latestReport.currentStatus} />
                </div>
                
                {latestReport.currentStatus === ReportStatus.NEEDS_CORRECTION && latestReport.latestReviewComment && (
                  <div className="mt-4 p-3 bg-orange-50 border border-orange-200 rounded-md">
                    <h4 className="text-sm font-semibold text-orange-800 mb-1 flex items-center">
                      <AlertCircle className="h-4 w-4 mr-1" />
                      Manager Feedback
                    </h4>
                    <p className="text-sm text-orange-700">{latestReport.latestReviewComment}</p>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-6 text-center">
                <Clock className="h-10 w-10 text-muted-foreground mb-4 opacity-20" />
                <p className="text-muted-foreground">No reports submitted yet.</p>
              </div>
            )}
          </CardContent>
          {latestReport && (
            <CardFooter className="pt-0">
              <Button asChild variant="outline" className="w-full">
                <Link to={
                  latestReport.currentStatus === ReportStatus.DRAFT || latestReport.currentStatus === ReportStatus.NEEDS_CORRECTION
                    ? `/member/reports/${latestReport._id}/edit`
                    : `/reports/${latestReport._id}`
                }>
                  {latestReport.currentStatus === ReportStatus.DRAFT || latestReport.currentStatus === ReportStatus.NEEDS_CORRECTION
                    ? 'Continue Editing'
                    : 'View Details'}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </CardFooter>
          )}
        </Card>

        {/* Action Items / Needs Correction */}
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Action Items</CardTitle>
            <CardDescription>Reports that require your attention</CardDescription>
          </CardHeader>
          <CardContent>
            {!isLoading && needsCorrection.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-6 text-center">
                <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center mb-4">
                  <FileText className="h-5 w-5 text-green-600" />
                </div>
                <p className="text-muted-foreground">You're all caught up!</p>
              </div>
            ) : (
              <div className="space-y-4">
                {needsCorrection.map(report => (
                  <div key={report._id} className="flex flex-col space-y-2 p-3 border rounded-lg hover:bg-slate-50 transition-colors">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-medium text-sm">Week of {formatDate(report.weekStart)}</p>
                        <p className="text-xs text-muted-foreground">
                          {typeof report.project === 'object' ? report.project.name : 'Unknown Project'}
                        </p>
                      </div>
                      <ReportStatusBadge status={report.currentStatus} />
                    </div>
                    <Button asChild variant="link" size="sm" className="px-0 justify-start h-auto text-primary">
                      <Link to={`/member/reports/${report._id}/edit`}>Edit and Resubmit <ArrowRight className="ml-1 h-3 w-3" /></Link>
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
