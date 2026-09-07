import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { RegisterForm } from '@/features/auth/components/register-form';

export const RegisterPage: React.FC = () => {
  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-slate-50 px-4 py-8">
      <Card className="w-full max-w-lg shadow-lg">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-2xl font-bold tracking-tight text-primary">Join InsightLoop</CardTitle>
          <CardDescription>
            Create an account to start submitting your weekly reports
          </CardDescription>
        </CardHeader>
        <CardContent>
          <RegisterForm />
        </CardContent>
        <CardFooter className="flex justify-center">
          <div className="text-sm text-muted-foreground">
            Already have an account?{' '}
            <Link to="/login" className="text-primary hover:underline font-medium">
              Log in
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};
