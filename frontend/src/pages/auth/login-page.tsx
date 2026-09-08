import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { LoginForm } from '@/features/auth/components/login-form';
import { BarChart3, ArrowLeft } from 'lucide-react';

export const LoginPage: React.FC = () => {
  return (
    <div className="relative flex min-h-screen w-full items-center justify-center bg-slate-50 px-4 py-12 overflow-hidden">
      {/* Ambient background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-tr from-indigo-500/20 to-blue-400/20 rounded-full blur-[120px] -z-10 opacity-70 pointer-events-none" />

      <div className="w-full max-w-md space-y-4">
        <Link 
          to="/" 
          className="inline-flex items-center text-sm font-medium text-slate-500 hover:text-indigo-600 transition-colors mb-2"
        >
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to home
        </Link>

        <Card className="w-full shadow-2xl shadow-slate-900/10 border-white/60 bg-white/80 backdrop-blur-xl rounded-3xl p-2">
          <CardHeader className="space-y-1.5 text-center pb-4">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-600 text-white shadow-lg shadow-indigo-500/30 mb-2">
              <BarChart3 className="h-6 w-6" />
            </div>
            <CardTitle className="text-2xl font-bold tracking-tight text-slate-900">InsightLoop</CardTitle>
            <CardDescription className="text-slate-500">
              Enter your email and password to log in to your account
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-2">
            <LoginForm />
          </CardContent>
          <CardFooter className="flex justify-center pt-2">
            <div className="text-sm text-slate-500">
              Don't have an account?{' '}
              <Link to="/register" className="text-indigo-600 hover:underline font-semibold">
                Register
              </Link>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};
