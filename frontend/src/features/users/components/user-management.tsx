import React from 'react';
import { useUsers, useUpdateUserRole, useUpdateUserStatus } from '../hooks/use-users';
import { Role } from '@/enums';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { formatDate } from '@/utils';

export const UserManagement: React.FC = () => {
  const { data: users, isLoading } = useUsers();
  const { mutate: updateRole } = useUpdateUserRole();
  const { mutate: updateStatus } = useUpdateUserStatus();

  const handleRoleChange = (userId: string, newRole: Role) => {
    updateRole({ userId, role: newRole });
  };

  const handleStatusChange = (userId: string, isActive: boolean) => {
    updateStatus({ userId, isActive });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">User Management</h1>
        <p className="text-muted-foreground mt-1">Manage team members, roles, and access.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Users</CardTitle>
          <CardDescription>A complete list of registered users in the platform.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Joined</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  Array.from({ length: 5 }).map((_, i) => (
                    <TableRow key={i}>
                      <TableCell><Skeleton className="h-5 w-32" /></TableCell>
                      <TableCell><Skeleton className="h-5 w-48" /></TableCell>
                      <TableCell><Skeleton className="h-9 w-32" /></TableCell>
                      <TableCell><Skeleton className="h-6 w-12" /></TableCell>
                      <TableCell><Skeleton className="h-5 w-24" /></TableCell>
                    </TableRow>
                  ))
                ) : !users?.length ? (
                  <TableRow>
                    <TableCell colSpan={5} className="h-24 text-center text-muted-foreground">
                      No users found.
                    </TableCell>
                  </TableRow>
                ) : (
                  users.map((user) => (
                    <TableRow key={user._id}>
                      <TableCell className="font-medium">
                        {user.firstName} {user.lastName}
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {user.email}
                      </TableCell>
                      <TableCell>
                        <Select 
                          value={user.role} 
                          onValueChange={(val) => handleRoleChange(user._id, val as Role)}
                        >
                          <SelectTrigger className="w-[140px] h-9">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value={Role.TEAM_MEMBER}>Member</SelectItem>
                            <SelectItem value={Role.MANAGER}>Manager</SelectItem>
                            <SelectItem value={Role.ADMIN}>Admin</SelectItem>
                          </SelectContent>
                        </Select>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Switch 
                            checked={user.isActive} 
                            onCheckedChange={(checked: boolean) => handleStatusChange(user._id, checked)}
                          />
                          <Badge variant={user.isActive ? 'default' : 'secondary'}>
                            {user.isActive ? 'Active' : 'Inactive'}
                          </Badge>
                        </div>
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {formatDate(user.createdAt)}
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
