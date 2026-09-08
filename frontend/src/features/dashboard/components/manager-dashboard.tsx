import React, { useState } from 'react';
import { useManagerDashboard } from '@/features/dashboard/hooks/use-dashboard';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import { ShieldAlert, CheckCircle2, AlertCircle, Clock3 } from 'lucide-react';
import { ReportStatus } from '@/types';
import { AIDashboardWidget } from '@/features/ai/components/AIDashboardWidget';
import { DashboardFilters } from './dashboard-filters';
import { DashboardFilters as DashboardFiltersType } from '../api/dashboard.api';

const STATUS_COLORS: Record<string, string> = {
  [ReportStatus.DRAFT]: '#94a3b8',
  [ReportStatus.SUBMITTED]: '#3b82f6',
  [ReportStatus.NEEDS_CORRECTION]: '#f97316',
  [ReportStatus.APPROVED]: '#22c55e',
  'NOT_STARTED': '#ef4444',
};

const formatStatusLabel = (status: string) => {
  switch (status) {
    case ReportStatus.DRAFT: return 'Draft';
    case ReportStatus.SUBMITTED: return 'Submitted';
    case ReportStatus.NEEDS_CORRECTION: return 'Needs Correction';
    case ReportStatus.APPROVED: return 'Approved';
    case 'NOT_STARTED': return 'Not Started';
    default: return status;
  }
};

export const ManagerDashboardComponent: React.FC = () => {
  const [filters, setFilters] = useState<DashboardFiltersType>({});
  const { data, isLoading } = useManagerDashboard(filters);

  const dashboardData = data?.dashboard ?? data;
  const statusData = dashboardData?.statusSummary || [];
  const projectData = dashboardData?.projectWorkload || [];
  const blockedTasks = dashboardData?.blockedTasks || [];
  const openBlockersList = dashboardData?.openBlockersList || [];
  const complianceRate = dashboardData?.complianceRate ?? 0;

  const needsCorrectionCount = statusData.find((s: any) => s.status === ReportStatus.NEEDS_CORRECTION)?.count || 0;
  const approvedCount = statusData.find((s: any) => s.status === ReportStatus.APPROVED)?.count || 0;
  const submittedCount = statusData.find((s: any) => s.status === ReportStatus.SUBMITTED)?.count || 0;
  const notStartedCount = statusData.find((s: any) => s.status === 'NOT_STARTED')?.count || 0;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Manager Overview</h1>
        <p className="text-muted-foreground mt-1">Team analytics and report statuses.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-4 lg:grid-cols-7">
        <AIDashboardWidget />
      </div>

      <DashboardFilters onFilterChange={setFilters} />

      {isLoading ? (
        <div className="p-8 text-center text-muted-foreground">Loading dashboard...</div>
      ) : (
        <>
          <div className="grid gap-4 md:grid-cols-5">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Compliance Rate</CardTitle>
                <CheckCircle2 className="h-4 w-4 text-emerald-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{complianceRate}%</div>
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

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Not Started</CardTitle>
                <Clock3 className="h-4 w-4 text-red-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{notStartedCount}</div>
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
                {projectData.length === 0 ? (
                  <div className="h-full flex items-center justify-center text-muted-foreground text-sm">No project data available.</div>
                ) : (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={projectData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                      <XAxis dataKey="projectName" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="totalPlannedHours" name="Planned" fill="#cbd5e1" radius={[4, 4, 0, 0]} />
                      <Bar dataKey="totalSpentHours" name="Spent" fill="#0f172a" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                )}
              </CardContent>
            </Card>

            <Card className="col-span-3">
              <CardHeader>
                <CardTitle>Report Status Distribution</CardTitle>
                <CardDescription>Current state of tracked reports</CardDescription>
              </CardHeader>
              <CardContent className="h-80 flex flex-col items-center justify-center p-2">
                {statusData.length === 0 ? (
                  <div className="text-muted-foreground text-sm">No status data available.</div>
                ) : (
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart margin={{ top: 10, right: 20, bottom: 20, left: 20 }}>
                      <Pie
                        data={statusData}
                        dataKey="count"
                        nameKey="status"
                        cx="50%"
                        cy="45%"
                        innerRadius={48}
                        outerRadius={72}
                        paddingAngle={3}
                        label={({ status, count }: any) => `${formatStatusLabel(status)}: ${count}`}
                        labelLine={{ strokeWidth: 1 }}
                      >
                        {statusData.map((entry: any, index: number) => (
                          <Cell key={`cell-${index}`} fill={STATUS_COLORS[entry.status] || '#cbd5e1'} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value: any, name: any) => [value, formatStatusLabel(name)]} />
                      <Legend 
                        verticalAlign="bottom" 
                        height={32}
                        formatter={(value: any) => (
                          <span className="text-xs font-semibold text-slate-700">{formatStatusLabel(value)}</span>
                        )} 
                      />
                    </PieChart>
                  </ResponsiveContainer>
                )}
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Currently Blocked Tasks</CardTitle>
                <CardDescription>Tasks marked as blocked by team members</CardDescription>
              </CardHeader>
              <CardContent>
                {blockedTasks.length === 0 ? (
                  <p className="text-muted-foreground text-sm">No blocked tasks reported.</p>
                ) : (
                  <div className="space-y-4 max-h-64 overflow-y-auto pr-2">
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

            <Card>
              <CardHeader>
                <CardTitle>General Blockers</CardTitle>
                <CardDescription>High-level blockers reported by team</CardDescription>
              </CardHeader>
              <CardContent>
                {openBlockersList.length === 0 ? (
                  <p className="text-muted-foreground text-sm">No general blockers reported.</p>
                ) : (
                  <div className="space-y-4 max-h-64 overflow-y-auto pr-2">
                    {openBlockersList.map((blocker: any, i: number) => (
                      <div key={i} className={`flex items-start justify-between p-3 border rounded ${blocker.isKeyIssue ? 'bg-red-50 border-red-200' : 'bg-slate-50'}`}>
                        <div>
                          <p className="font-medium text-sm">{blocker.description}</p>
                          <p className="text-xs text-muted-foreground mt-1">Owner: {blocker.ownerName}</p>
                        </div>
                        {blocker.isKeyIssue && <ShieldAlert className="h-4 w-4 text-red-500 flex-shrink-0 ml-2 mt-0.5" />}
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </>
      )}
    </div>
  );
};
