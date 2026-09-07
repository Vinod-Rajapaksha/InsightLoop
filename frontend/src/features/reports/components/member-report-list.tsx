import React from 'react';
import { useMyReports } from '@/features/reports/hooks/use-reports';
import { Link } from 'react-router-dom';
import { ReportStatusBadge } from '@/components/shared/ReportStatusBadge';
import { formatDate } from '@/utils';
import { ReportStatus } from '@/types';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { PlusCircle, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';

export const MemberReportList: React.FC = () => {
  const { data: reports, isLoading } = useMyReports();
  const [searchTerm, setSearchTerm] = React.useState('');

  const filteredReports = reports?.filter(report => {
    const projName = typeof report.project === 'object' ? report.project.name : '';
    return projName.toLowerCase().includes(searchTerm.toLowerCase());
  }) || [];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Report History</h1>
          <p className="text-muted-foreground mt-1">
            View and manage your weekly reports.
          </p>
        </div>
        <Button asChild>
          <Link to="/member/reports/new">
            <PlusCircle className="mr-2 h-4 w-4" />
            New Report
          </Link>
        </Button>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <CardTitle>All Reports</CardTitle>
              <CardDescription>A list of all your submitted and draft reports.</CardDescription>
            </div>
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search by project..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Week Of</TableHead>
                  <TableHead>Project</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Last Updated</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center h-24 text-muted-foreground">
                      Loading reports...
                    </TableCell>
                  </TableRow>
                ) : filteredReports.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center h-24 text-muted-foreground">
                      No reports found.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredReports.map((report) => (
                    <TableRow key={report._id}>
                      <TableCell className="font-medium">
                        {formatDate(report.weekStart)}
                      </TableCell>
                      <TableCell>
                        {typeof report.project === 'object' ? report.project.name : 'Unknown'}
                      </TableCell>
                      <TableCell>
                        <ReportStatusBadge status={report.currentStatus} />
                      </TableCell>
                      <TableCell>{formatDate(report.updatedAt)}</TableCell>
                      <TableCell className="text-right">
                        {report.currentStatus === ReportStatus.DRAFT || report.currentStatus === ReportStatus.NEEDS_CORRECTION ? (
                          <Button asChild variant="outline" size="sm">
                            <Link to={`/member/reports/${report._id}/edit`}>Edit</Link>
                          </Button>
                        ) : (
                          <Button asChild variant="secondary" size="sm">
                            <Link to={`/reports/${report._id}`}>View</Link>
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
