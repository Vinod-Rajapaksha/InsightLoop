import React from 'react';
import { Report } from '@/types';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { formatDate } from '@/utils';
import { CheckCircle2, AlertCircle } from 'lucide-react';

interface ReportViewerProps {
  report: Report;
}

export const ReportViewer: React.FC<ReportViewerProps> = ({ report }) => {
  const totalPlannedHours = report.tasksCompleted.reduce((acc, t) => acc + (t.plannedHours || 0), 0);
  const totalSpentHours = report.tasksCompleted.reduce((acc, t) => acc + (t.spentHours || 0), 0);
  const ownerName = typeof report.owner === 'object' ? `${report.owner.firstName} ${report.owner.lastName}` : 'Unknown';
  const projectName = typeof report.project === 'object' ? report.project.name : 'Unknown';

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Report Summary</CardTitle>
          <CardDescription>Submitted by {ownerName}</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-3">
          <div>
            <div className="text-sm font-medium text-muted-foreground">Week</div>
            <div className="font-medium">{formatDate(report.weekStart)} - {formatDate(report.weekEnd)}</div>
          </div>
          <div>
            <div className="text-sm font-medium text-muted-foreground">Project</div>
            <div className="font-medium">{projectName}</div>
          </div>
          <div>
            <div className="text-sm font-medium text-muted-foreground">Version</div>
            <div className="font-medium">v{report.currentVersion}</div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Tasks Completed</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Task Name</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Priority</TableHead>
                  <TableHead className="text-right">Planned (hrs)</TableHead>
                  <TableHead className="text-right">Spent (hrs)</TableHead>
                  <TableHead className="text-right">Complete (%)</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {report.tasksCompleted.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center h-16 text-muted-foreground">
                      No tasks reported.
                    </TableCell>
                  </TableRow>
                ) : (
                  report.tasksCompleted.map((task, i) => (
                    <TableRow key={i}>
                      <TableCell className="font-medium">{task.taskName}</TableCell>
                      <TableCell>{task.status.replace('_', ' ')}</TableCell>
                      <TableCell>{task.priority}</TableCell>
                      <TableCell className="text-right">{task.plannedHours}</TableCell>
                      <TableCell className="text-right">{task.spentHours}</TableCell>
                      <TableCell className="text-right">{task.actualPercentage}%</TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
          <div className="mt-4 flex justify-end gap-6 text-sm text-muted-foreground pr-4">
            <div>Total Planned: <span className="font-medium text-foreground">{totalPlannedHours}h</span></div>
            <div>Total Spent: <span className="font-medium text-foreground">{totalSpentHours}h</span></div>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Blockers & Challenges</CardTitle>
          </CardHeader>
          <CardContent>
            {report.blockers.length === 0 ? (
              <p className="text-muted-foreground text-sm">No blockers reported.</p>
            ) : (
              <ul className="space-y-3">
                {report.blockers.map((blocker, i) => (
                  <li key={i} className="flex gap-3 items-start">
                    {blocker.isKeyIssue ? (
                      <AlertCircle className="h-5 w-5 text-destructive shrink-0 mt-0.5" />
                    ) : (
                      <div className="h-5 w-5 flex items-center justify-center shrink-0 mt-0.5"><div className="h-2 w-2 rounded-full bg-muted-foreground"></div></div>
                    )}
                    <div>
                      <p className="text-sm font-medium">{blocker.description}</p>
                      {blocker.isKeyIssue && <Badge variant="destructive" className="mt-1 text-[10px]">Key Issue</Badge>}
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Achievements & Highlights</CardTitle>
          </CardHeader>
          <CardContent>
            {report.achievements.length === 0 ? (
              <p className="text-muted-foreground text-sm">No achievements reported.</p>
            ) : (
              <ul className="space-y-3">
                {report.achievements.map((ach, i) => (
                  <li key={i} className="flex gap-3 items-start">
                    {ach.isKeyAchievement ? (
                      <CheckCircle2 className="h-5 w-5 text-green-500 shrink-0 mt-0.5" />
                    ) : (
                      <div className="h-5 w-5 flex items-center justify-center shrink-0 mt-0.5"><div className="h-2 w-2 rounded-full bg-muted-foreground"></div></div>
                    )}
                    <div>
                      <p className="text-sm font-medium">{ach.description}</p>
                      {ach.isKeyAchievement && <Badge variant="default" className="mt-1 bg-green-500 hover:bg-green-600 text-[10px]">Key Highlight</Badge>}
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Next Week's Plan</CardTitle>
        </CardHeader>
        <CardContent>
          {report.nextWeekTasks.length === 0 ? (
             <p className="text-muted-foreground text-sm">No tasks planned for next week.</p>
          ) : (
            <ul className="list-disc pl-5 space-y-1">
              {report.nextWeekTasks.map((t, i) => (
                <li key={i} className="text-sm">
                  <span className="font-medium">{t.taskName}</span> ({t.priority.toLowerCase()} priority)
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
      
      {report.notes && (
        <Card>
          <CardHeader>
            <CardTitle>Notes</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm whitespace-pre-wrap">{report.notes}</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
