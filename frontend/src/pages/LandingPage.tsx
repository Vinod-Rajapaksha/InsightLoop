import React, { useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { useAuth } from '@/app/providers/auth-provider';
import { Button } from '@/components/ui/button';
import { motion, Variants } from 'framer-motion';
import { Sparkles, ArrowRight, BarChart3, ShieldCheck, Zap } from 'lucide-react';
import { Role } from '@/enums';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { LoginForm } from '@/features/auth/components/login-form';
import { RegisterForm } from '@/features/auth/components/register-form';

export const LandingPage: React.FC = () => {
  const { isAuthenticated, role, isLoading } = useAuth();
  const [authModal, setAuthModal] = useState<'login' | 'register' | null>(null);

  if (isLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-slate-50">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
      </div>
    );
  }

  if (isAuthenticated) {
    if (role === Role.TEAM_MEMBER) return <Navigate to="/member/dashboard" replace />;
    if (role === Role.MANAGER || role === Role.ADMIN) return <Navigate to="/manager/dashboard" replace />;
  }

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.2 },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
  };

  return (
    <div className="min-h-screen bg-slate-50 overflow-hidden font-sans">
      {/* Navbar */}
      <nav className="absolute top-0 w-full z-50 flex items-center justify-between p-6 max-w-7xl mx-auto left-0 right-0">
        <div className="flex items-center gap-2 text-2xl font-bold tracking-tight text-indigo-600">
          <div className="bg-gradient-to-r from-indigo-600 to-blue-600 text-white p-2 rounded-xl shadow-lg shadow-indigo-500/20">
            <BarChart3 className="h-6 w-6" />
          </div>
          InsightLoop
        </div>
        <div className="flex items-center gap-3">
          <Button 
            variant="ghost" 
            className="font-medium hover:bg-slate-200/60 text-slate-700"
            onClick={() => setAuthModal('login')}
          >
            Log in
          </Button>
          <Button 
            className="shadow-lg shadow-indigo-500/25"
            onClick={() => setAuthModal('register')}
          >
            Get Started
          </Button>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="relative pt-32 pb-20 lg:pt-32 lg:pb-32 px-6 flex flex-col items-center text-center max-w-5xl mx-auto">
        {/* Background decorative blobs */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-tr from-indigo-500/20 to-blue-400/20 rounded-full blur-[100px] -z-10 opacity-70"></div>
        
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="flex flex-col items-center z-10"
        >
          <motion.div variants={itemVariants} className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/70 border border-slate-200/80 backdrop-blur-md shadow-sm text-sm font-medium text-slate-600 mb-8">
            <Sparkles className="h-4 w-4 text-amber-500" />
            <span>Now supercharged with AI Copilot</span>
          </motion.div>

          <motion.h1 variants={itemVariants} className="text-5xl lg:text-7xl font-extrabold tracking-tight text-slate-900 mb-6 leading-[1.1]">
            Elevate Your Team's <br className="hidden lg:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-blue-600 to-cyan-500">Weekly Reporting</span>
          </motion.h1>

          <motion.p variants={itemVariants} className="text-lg lg:text-xl text-slate-600 mb-10 max-w-2xl leading-relaxed">
            InsightLoop simplifies weekly status updates, uncovers hidden blockers with AI, and gives managers crystal-clear visibility into team performance.
          </motion.p>

          <motion.div variants={itemVariants} className="flex flex-col sm:flex-row items-center gap-4">
            <Button 
              size="lg" 
              className="h-14 px-8 text-lg rounded-full shadow-xl shadow-indigo-500/25 hover:shadow-2xl hover:shadow-indigo-500/30 transition-all hover:-translate-y-1"
              onClick={() => setAuthModal('register')}
            >
              Start for free <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button 
              variant="outline" 
              size="lg" 
              className="h-14 px-8 text-lg rounded-full bg-white/70 backdrop-blur-sm border-slate-200 hover:bg-white/90 text-slate-800"
              onClick={() => setAuthModal('login')}
            >
              Sign in to workspace
            </Button>
          </motion.div>
        </motion.div>

        {/* Feature Highlights */}
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.7 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-24 w-full max-w-4xl"
        >
          <div className="bg-white/70 backdrop-blur-xl border border-slate-200/60 p-6 rounded-2xl shadow-xl shadow-slate-200/50 flex flex-col items-center text-center">
            <div className="bg-indigo-100 p-3 rounded-2xl text-indigo-600 mb-4">
              <Zap className="h-6 w-6" />
            </div>
            <h3 className="font-semibold text-lg text-slate-900 mb-2">AI-Powered Insights</h3>
            <p className="text-slate-600 text-sm">Instantly summarize weeks of reports and identify project risks using AI.</p>
          </div>
          
          <div className="bg-white/70 backdrop-blur-xl border border-slate-200/60 p-6 rounded-2xl shadow-xl shadow-slate-200/50 flex flex-col items-center text-center">
            <div className="bg-emerald-100 p-3 rounded-2xl text-emerald-600 mb-4">
              <BarChart3 className="h-6 w-6" />
            </div>
            <h3 className="font-semibold text-lg text-slate-900 mb-2">Track Deliverables</h3>
            <p className="text-slate-600 text-sm">Log hours, track planned vs actual progress, and manage weekly goals.</p>
          </div>

          <div className="bg-white/70 backdrop-blur-xl border border-slate-200/60 p-6 rounded-2xl shadow-xl shadow-slate-200/50 flex flex-col items-center text-center">
            <div className="bg-purple-100 p-3 rounded-2xl text-purple-600 mb-4">
              <ShieldCheck className="h-6 w-6" />
            </div>
            <h3 className="font-semibold text-lg text-slate-900 mb-2">Manager Review</h3>
            <p className="text-slate-600 text-sm">Streamlined approval workflows with real-time feedback and corrections.</p>
          </div>
        </motion.div>
      </main>

      {/* Auth Modals */}
      <Dialog open={authModal === 'login'} onOpenChange={(open) => !open && setAuthModal(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader className="space-y-1 text-center">
            <DialogTitle className="text-2xl font-bold tracking-tight text-indigo-600">Welcome back</DialogTitle>
            <DialogDescription>
              Enter your credentials to access your workspace
            </DialogDescription>
          </DialogHeader>
          <div className="pt-2">
            <LoginForm onSuccess={() => setAuthModal(null)} />
          </div>
          <div className="text-center pt-2 text-sm text-slate-500">
            Don't have an account?{' '}
            <button 
              type="button"
              onClick={() => setAuthModal('register')}
              className="text-indigo-600 hover:underline font-semibold"
            >
              Register
            </button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={authModal === 'register'} onOpenChange={(open) => !open && setAuthModal(null)}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader className="space-y-1 text-center">
            <DialogTitle className="text-2xl font-bold tracking-tight text-indigo-600">Join InsightLoop</DialogTitle>
            <DialogDescription>
              Create your account to start managing reports & AI insights
            </DialogDescription>
          </DialogHeader>
          <div className="pt-2">
            <RegisterForm onSuccess={() => setAuthModal(null)} />
          </div>
          <div className="text-center pt-2 text-sm text-slate-500">
            Already have an account?{' '}
            <button 
              type="button"
              onClick={() => setAuthModal('login')}
              className="text-indigo-600 hover:underline font-semibold"
            >
              Log in
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};
