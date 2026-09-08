import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/app/providers/auth-provider';
import { Role } from '@/types';

export const RootRedirect: React.FC = () => {
  const { role, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
      </div>
    );
  }

  if (role === Role.TEAM_MEMBER) {
    return <Navigate to="/member/dashboard" replace />;
  }
  
  if (role === Role.MANAGER || role === Role.ADMIN) {
    return <Navigate to="/manager/dashboard" replace />;
  }

  return <Navigate to="/login" replace />;
};
