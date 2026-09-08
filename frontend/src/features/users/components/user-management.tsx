import React from 'react';
import { useUsers, useUpdateUserRole, useUpdateUserStatus } from '../hooks/use-users';
import { useAuth } from '@/app/providers/auth-provider';
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
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { formatDate } from '@/utils';
import { TablePagination } from '@/components/shared/TablePagination';

export const UserManagement: React.FC = () => {
  const { data: users, isLoading } = useUsers();
  const { mutate: updateRole } = useUpdateUserRole();
  const { mutate: updateStatus } = useUpdateUserStatus();
  const { user: currentUser } = useAuth();

  const [searchTerm, setSearchTerm] = React.useState('');
  const itemsPerPage = 10;
  const [currentPage, setCurrentPage] = React.useState(1);

  const isAdminAccount = (userRole: string) => userRole === Role.ADMIN;
  const isSelf = (userId: string) => currentUser?._id === userId;

  const handleRoleChange = (userId: string, newRole: Role) => {
    updateRole({ userId, role: newRole });
  };

  const handleStatusChange = (userId: string, isActive: boolean) => {
    updateStatus({ userId, isActive });
  };

  const filteredUsers = users?.filter(user => {
    const fullName = `${user.firstName} ${user.lastName}`.toLowerCase();
    const email = user.email.toLowerCase();
    const query = searchTerm.toLowerCase();
    return fullName.includes(query) || email.includes(query);
  }) || [];

  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage) || 1;
  const paginatedUsers = filteredUsers.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  React.useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">User Management</h1>
        <p className="text-muted-foreground mt-1">Manage team members, roles, and access.</p>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <CardTitle>All Users</CardTitle>
              <CardDescription>A complete list of registered users in the platform.</CardDescription>
            </div>
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search users..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
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
                ) : !filteredUsers.length ? (
                  <TableRow>
                    <TableCell colSpan={5} className="h-24 text-center text-muted-foreground">
                      No users found.
                    </TableCell>
                  </TableRow>
                ) : (
                  paginatedUsers.map((user) => {
                    const isAdmin = isAdminAccount(user.role);
                    const self = isSelf(user._id);
                    const roleDisabled = isAdmin || self;
                    const statusDisabled = isAdmin || self;

                    return (
                    <TableRow key={user._id}>
                      <TableCell className="font-medium">
                        {user.firstName} {user.lastName}
                        {self && <span className="ml-2 text-xs text-muted-foreground">(you)</span>}
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {user.email}
                      </TableCell>
                      <TableCell>
                        <div title={isAdmin ? "Admin role cannot be changed" : self ? "Cannot change your own role" : undefined}>
                          <Select
                            value={user.role}
                            onValueChange={(val) => handleRoleChange(user._id, val as Role)}
                            disabled={roleDisabled}
                          >
                            <SelectTrigger className="w-[140px] h-9">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value={Role.TEAM_MEMBER}>Member</SelectItem>
                              <SelectItem value={Role.MANAGER}>Manager</SelectItem>
                              {isAdmin && (
                                <SelectItem value={Role.ADMIN}>Admin</SelectItem>
                              )}
                            </SelectContent>
                          </Select>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div
                          className="flex items-center gap-3"
                          title={isAdmin ? "Admin accounts cannot be deactivated" : self ? "Cannot deactivate your own account" : undefined}
                        >
                          <Switch
                            checked={user.isActive}
                            onCheckedChange={(checked: boolean) => handleStatusChange(user._id, checked)}
                            disabled={statusDisabled}
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
                    );
                  })
                )}
              </TableBody>
            </Table>
          </div>

          {/* Pagination Controls */}
          <TablePagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={filteredUsers.length}
            itemsPerPage={itemsPerPage}
            onPageChange={setCurrentPage}
          />
        </CardContent>
      </Card>
    </div>
  );
};
