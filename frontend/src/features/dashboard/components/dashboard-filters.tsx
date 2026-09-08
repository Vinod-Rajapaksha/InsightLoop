import React, { useState } from 'react';
import { useProjects } from '@/features/projects/hooks/use-projects';
import { useUsers } from '@/features/users/hooks/use-users';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ReportStatus, Role } from '@/types';
import { DashboardFilters as DashboardFiltersType } from '../api/dashboard.api';

interface DashboardFiltersProps {
  onFilterChange: (filters: DashboardFiltersType) => void;
}

export const DashboardFilters: React.FC<DashboardFiltersProps> = ({ onFilterChange }) => {
  const { data: projectsData } = useProjects();
  const { data: usersData } = useUsers();
  
  const projects = projectsData || [];
  const users = usersData?.filter((u: any) => u.role === 'TEAM_MEMBER') || [];

  const [weekStartDate, setWeekStartDate] = useState<string>('');
  const [projectId, setProjectId] = useState<string>('all');
  const [memberId, setMemberId] = useState<string>('all');
  const [status, setStatus] = useState<string>('all');

  const handleApply = () => {
    onFilterChange({
      weekStartDate: weekStartDate || undefined,
      projectId: projectId !== 'all' ? projectId : undefined,
      memberId: memberId !== 'all' ? memberId : undefined,
      status: status !== 'all' ? status : undefined,
    });
  };

  const handleClear = () => {
    setWeekStartDate('');
    setProjectId('all');
    setMemberId('all');
    setStatus('all');
    setMemberSearch('');
    setProjectSearch('');
    onFilterChange({});
  };

  const [memberSearch, setMemberSearch] = useState('');
  const [projectSearch, setProjectSearch] = useState('');

  const filteredUsers = users.filter((u: any) => 
    `${u.firstName} ${u.lastName}`.toLowerCase().includes(memberSearch.toLowerCase())
  );

  const filteredProjects = projects.filter((p: any) => 
    p.name.toLowerCase().includes(projectSearch.toLowerCase())
  );

  return (
    <div className="bg-card text-card-foreground shadow-sm border rounded-lg p-4 mb-6">
      <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-5 gap-4 items-end">
        <div className="space-y-2">
          <Label htmlFor="weekStart">Week Start (Monday)</Label>
          <Input 
            id="weekStart" 
            type="date" 
            value={weekStartDate}
            onChange={(e) => setWeekStartDate(e.target.value)}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="member">Team Member</Label>
          <Select value={memberId} onValueChange={setMemberId}>
            <SelectTrigger id="member">
              <SelectValue placeholder="All Members" />
            </SelectTrigger>
            <SelectContent className="max-h-64">
              <div className="p-2 sticky top-0 bg-popover z-10 border-b">
                <Input
                  placeholder="Search member..."
                  value={memberSearch}
                  onChange={(e) => setMemberSearch(e.target.value)}
                  onKeyDown={(e) => e.stopPropagation()}
                  className="h-8 text-xs"
                />
              </div>
              <SelectItem value="all">All Members</SelectItem>
              {filteredUsers.map((user: any) => (
                <SelectItem key={user._id} value={user._id}>
                  {user.firstName} {user.lastName}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="project">Project</Label>
          <Select value={projectId} onValueChange={setProjectId}>
            <SelectTrigger id="project">
              <SelectValue placeholder="All Projects" />
            </SelectTrigger>
            <SelectContent className="max-h-64">
              <div className="p-2 sticky top-0 bg-popover z-10 border-b">
                <Input
                  placeholder="Search project..."
                  value={projectSearch}
                  onChange={(e) => setProjectSearch(e.target.value)}
                  onKeyDown={(e) => e.stopPropagation()}
                  className="h-8 text-xs"
                />
              </div>
              <SelectItem value="all">All Projects</SelectItem>
              {filteredProjects.map((project: any) => (
                <SelectItem key={project._id} value={project._id}>
                  {project.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="status">Status</Label>
          <Select value={status} onValueChange={setStatus}>
            <SelectTrigger id="status">
              <SelectValue placeholder="All Statuses" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value={ReportStatus.DRAFT}>Draft</SelectItem>
              <SelectItem value={ReportStatus.SUBMITTED}>Submitted</SelectItem>
              <SelectItem value={ReportStatus.NEEDS_CORRECTION}>Needs Correction</SelectItem>
              <SelectItem value={ReportStatus.APPROVED}>Approved</SelectItem>
              <SelectItem value="NOT_STARTED">Not Started</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex gap-2 justify-end lg:col-span-1">
          <Button variant="outline" onClick={handleClear} className="w-full">Clear</Button>
          <Button onClick={handleApply} className="w-full">Apply</Button>
        </div>
      </div>
    </div>
  );
};
