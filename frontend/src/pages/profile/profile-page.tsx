import React from 'react';
import { useAuth } from '@/app/providers/auth-provider';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Mail, User, Shield, Calendar } from 'lucide-react';
import { formatDate } from '@/utils';

export const Profile: React.FC = () => {
  const { user } = useAuth();

  if (!user) return null;

  const getInitials = (firstName?: string, lastName?: string) => {
    if (!firstName || !lastName) return 'U';
    return `${firstName[0]}${lastName[0]}`;
  };

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">My Profile</h1>
        <p className="text-muted-foreground mt-1">View your account details and role.</p>
      </div>

      <Card>
        <CardHeader className="pb-4 border-b">
          <div className="flex items-center gap-6">
            <Avatar className="h-20 w-20">
              <AvatarFallback className="bg-primary/10 text-primary text-2xl">
                {getInitials(user.firstName, user.lastName)}
              </AvatarFallback>
            </Avatar>
            <div>
              <CardTitle className="text-2xl">{user.firstName} {user.lastName}</CardTitle>
              <CardDescription className="mt-1 flex items-center gap-2">
                <Badge variant="secondary" className="capitalize">{user.role.replace('_', ' ')}</Badge>
                {user.isActive ? (
                  <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Active</Badge>
                ) : (
                  <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">Inactive</Badge>
                )}
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-1">
              <div className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <Mail className="h-4 w-4" /> Email Address
              </div>
              <div className="font-medium">{user.email}</div>
            </div>
            
            <div className="space-y-1">
              <div className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <User className="h-4 w-4" /> Full Name
              </div>
              <div className="font-medium">{user.firstName} {user.lastName}</div>
            </div>
            
            <div className="space-y-1">
              <div className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <Shield className="h-4 w-4" /> Account Role
              </div>
              <div className="font-medium capitalize">{user.role.replace('_', ' ')}</div>
            </div>
            
            <div className="space-y-1">
              <div className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <Calendar className="h-4 w-4" /> Member Since
              </div>
              <div className="font-medium">{formatDate(user.createdAt)}</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
