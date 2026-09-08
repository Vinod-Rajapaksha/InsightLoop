import React, { useState } from 'react';
import { useAllReports } from '@/features/reports/hooks/use-reports';
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
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { TablePagination } from '@/components/shared/TablePagination';

export const ManagerReportList: React.FC = () => {
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [searchTerm, setSearchTerm] = useState('');
  const itemsPerPage = 10;
  const [currentPage, setCurrentPage] = useState(1);
  
  // Use TanStack query to fetch all reports
  const { data: reports, isLoading } = useAllReports();

  const filteredReports = reports?.filter(report => {
    const ownerName = typeof report.owner === 'object' ? `${report.owner.firstName} ${report.owner.lastName}` : '';
    const matchesSearch = ownerName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'ALL' || report.currentStatus === statusFilter;
    return matchesSearch && matchesStatus;
  }) || [];

  const totalPages = Math.ceil(filteredReports.length / itemsPerPage) || 1;
  const paginatedReports = filteredReports.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  React.useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, statusFilter]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Team Reports</h1>
        <p className="text-muted-foreground mt-1">
          Review and manage weekly reports submitted by your team.
        </p>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <CardTitle>All Submissions</CardTitle>
              <CardDescription>Filter by status or search by team member.</CardDescription>
            </div>
            <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
              <div className="relative w-full sm:w-64">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search by name..."
                  className="pl-8"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full sm:w-40">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">All Statuses</SelectItem>
                  {Object.values(ReportStatus).map(s => (
                    <SelectItem key={s} value={s}>{s.replace('_', ' ')}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Member</TableHead>
                  <TableHead>Week Of</TableHead>
                  <TableHead>Project</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Submitted At</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center h-24 text-muted-foreground">
                      Loading reports...
                    </TableCell>
                  </TableRow>
                ) : filteredReports.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center h-24 text-muted-foreground">
                      No reports found matching your criteria.
                    </TableCell>
                  </TableRow>
                ) : (
                  paginatedReports.map((report) => (
                    <TableRow key={report._id}>
                      <TableCell className="font-medium">
                        {typeof report.owner === 'object' ? `${report.owner.firstName} ${report.owner.lastName}` : 'Unknown'}
                      </TableCell>
                      <TableCell>{formatDate(report.weekStart)}</TableCell>
                      <TableCell>
                        {typeof report.project === 'object' && report.project ? report.project.name : 'Unknown'}
                      </TableCell>
                      <TableCell>
                        <ReportStatusBadge status={report.currentStatus} />
                      </TableCell>
                      <TableCell>{formatDate(report.updatedAt)}</TableCell>
                      <TableCell className="text-right">
                        {report.currentStatus === ReportStatus.SUBMITTED ? (
                          <Button asChild size="sm">
                            <Link to={`/manager/reports/${report._id}/review`}>Review</Link>
                          </Button>
                        ) : (
                          <Button asChild variant="secondary" size="sm">
                            <Link to={`/reports/${report._id}`}>View Details</Link>
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          {/* Pagination Controls */}
          <TablePagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={filteredReports.length}
            itemsPerPage={itemsPerPage}
            onPageChange={setCurrentPage}
          />
        </CardContent>
      </Card>
    </div>
  );
};
