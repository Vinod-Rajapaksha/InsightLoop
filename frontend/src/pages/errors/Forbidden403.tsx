import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ShieldAlert } from 'lucide-react';

export const Forbidden403: React.FC = () => {
  return (
    <div className="flex h-screen w-full flex-col items-center justify-center bg-slate-50 px-4 text-center">
      <ShieldAlert className="h-20 w-20 text-destructive mb-6" />
      <h1 className="text-4xl font-bold tracking-tight text-slate-900 mb-2">Access Denied</h1>
      <p className="text-lg text-muted-foreground max-w-md mb-8">
        You don't have permission to view this page. If you believe this is an error, please contact your administrator.
      </p>
      <Button asChild size="lg">
        <Link to="/">Return to Dashboard</Link>
      </Button>
    </div>
  );
};
