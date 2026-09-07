import React from 'react';
import { useAuth } from '@/app/providers/auth-provider';
import { Button } from '@/components/ui/button';
import { LogOut } from 'lucide-react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';

export const Topbar: React.FC = () => {
  const { user, role, logout } = useAuth();

  const getInitials = (firstName?: string, lastName?: string) => {
    if (!firstName || !lastName) return 'U';
    return `${firstName[0]}${lastName[0]}`;
  };

  const getRoleLabel = (r: string | null) => {
    switch (r) {
      case 'TEAM_MEMBER': return 'Member';
      case 'MANAGER': return 'Manager';
      case 'ADMIN': return 'Admin';
      default: return 'User';
    }
  };

  return (
    <header className="h-16 border-b bg-card flex items-center justify-between px-6 sticky top-0 z-30">
      <div className="flex items-center gap-4">
        <h2 className="text-lg font-medium hidden sm:block">
          Welcome back, {user?.firstName}
        </h2>
      </div>

      <div className="flex items-center gap-4">
        <Badge variant="secondary" className="hidden sm:inline-flex">
          {getRoleLabel(role)}
        </Badge>
        
        <div className="flex items-center gap-3">
          <Avatar className="h-9 w-9">
            <AvatarFallback className="bg-primary/10 text-primary">
              {getInitials(user?.firstName, user?.lastName)}
            </AvatarFallback>
          </Avatar>
          <div className="hidden sm:flex flex-col text-sm">
            <span className="font-medium leading-none">{user?.firstName} {user?.lastName}</span>
            <span className="text-xs text-muted-foreground mt-1">{user?.email}</span>
          </div>
        </div>

        <div className="h-6 w-px bg-border mx-2"></div>

        <Button variant="ghost" size="sm" onClick={logout} className="text-muted-foreground hover:text-destructive">
          <LogOut className="h-4 w-4 mr-2" />
          Logout
        </Button>
      </div>
    </header>
  );
};
