import React from 'react';
import { useManagerDashboard } from '@/features/dashboard/hooks/use-dashboard';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { ShieldAlert, CheckCircle2, Clock, AlertCircle } from 'lucide-react';
import { ReportStatus } from '@/types';

const STATUS_COLORS: Record<string, string> = {
  [ReportStatus.DRAFT]: '#94a3b8',
  [ReportStatus.SUBMITTED]: '#3b82f6',
  [ReportStatus.NEEDS_CORRECTION]: '#f97316',
  [ReportStatus.APPROVED]: '#22c55e',
};

export const ManagerDashboardComponent: React.FC = () => {
  const { data, isLoading } = useManagerDashboard();

  if (isLoading) {
    return <div className="p-8 text-center text-muted-foreground">Loading dashboard...</div>;
  }

  const statusData = data?.statusSummary || [];
  const projectData = data?.projectWorkload || [];
  const blockedTasks = data?.blockedTasks || [];

  const totalReports = statusData.reduce((acc: number, item: any) => acc + item.count, 0);
  const needsCorrectionCount = statusData.find((s: any) => s.status === ReportStatus.NEEDS_CORRECTION)?.count || 0;
  const approvedCount = statusData.find((s: any) => s.status === ReportStatus.APPROVED)?.count || 0;
  const submittedCount = statusData.find((s: any) => s.status === ReportStatus.SUBMITTED)?.count || 0;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Manager Overview</h1>
        <p className="text-muted-foreground mt-1">Team analytics and report statuses.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Reports</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalReports}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Approved</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{approvedCount}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Review</CardTitle>
            <AlertCircle className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{submittedCount}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Needs Correction</CardTitle>
            <ShieldAlert className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{needsCorrectionCount}</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Project Workload (Hours)</CardTitle>
            <CardDescription>Planned vs. Spent hours across active projects</CardDescription>
          </CardHeader>
          <CardContent className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={projectData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                <XAxis dataKey="projectName" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="totalPlannedHours" name="Planned" fill="#cbd5e1" radius={[4, 4, 0, 0]} />
                <Bar dataKey="totalSpentHours" name="Spent" fill="#0f172a" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Report Status Distribution</CardTitle>
            <CardDescription>Current state of all tracked reports</CardDescription>
          </CardHeader>
          <CardContent className="h-80 flex flex-col items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={statusData}
                  dataKey="count"
                  nameKey="status"
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  label={({ status, count }: any) => `${status}: ${count}`}
                >
                  {statusData.map((entry: any, index: number) => (
                    <Cell key={`cell-${index}`} fill={STATUS_COLORS[entry.status] || '#ccc'} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Currently Blocked Tasks</CardTitle>
          <CardDescription>Team members facing active blockers</CardDescription>
        </CardHeader>
        <CardContent>
          {blockedTasks.length === 0 ? (
            <p className="text-muted-foreground text-sm">No blocked tasks reported.</p>
          ) : (
            <div className="space-y-4">
              {blockedTasks.map((task: any, i: number) => (
                <div key={i} className="flex items-center justify-between p-3 border rounded bg-slate-50">
                  <div>
                    <p className="font-medium text-sm">{task.taskName}</p>
                    <p className="text-xs text-muted-foreground">Owner: {task.ownerName}</p>
                  </div>
                  <ShieldAlert className="h-5 w-5 text-destructive" />
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
