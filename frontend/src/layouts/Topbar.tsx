import React, { useState, useEffect } from 'react';
import { useAuth } from '@/app/providers/auth-provider';
import { Sparkles, Shield, UserCheck, Clock, Calendar } from 'lucide-react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';

export const Topbar: React.FC = () => {
  const { user, role } = useAuth();
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const getInitials = (firstName?: string, lastName?: string) => {
    if (!firstName || !lastName) return 'U';
    return `${firstName[0]}${lastName[0]}`;
  };

  const getRoleBadge = (r: string | null) => {
    switch (r) {
      case 'TEAM_MEMBER': 
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200/60 shadow-xs">
            <UserCheck className="h-3.5 w-3.5" /> Member
          </span>
        );
      case 'MANAGER': 
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200/60 shadow-xs">
            <Sparkles className="h-3.5 w-3.5" /> Manager
          </span>
        );
      case 'ADMIN': 
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-purple-50 text-purple-700 border border-purple-200/60 shadow-xs">
            <Shield className="h-3.5 w-3.5" /> Admin
          </span>
        );
      default: return null;
    }
  };

  return (
    <header className="h-16 border-b border-slate-200/80 bg-white/80 backdrop-blur-md flex items-center justify-between px-6 sticky top-0 z-30 shadow-xs">
      {/* Left Title Greeting */}
      <div className="flex items-center gap-3">
        <h2 className="text-base font-semibold text-slate-800 hidden sm:block">
          Welcome back, <span className="text-indigo-600 font-bold">{user?.firstName}</span> 👋
        </h2>
      </div>

      {/* Middle Live Date & Time Display */}
      <div className="hidden lg:flex items-center gap-4 bg-slate-50 px-4 py-1.5 rounded-full border border-slate-200/70 shadow-2xs">
        <div className="flex items-center gap-1.5 text-xs font-medium text-slate-600">
          <Calendar className="h-3.5 w-3.5 text-indigo-600" />
          <span>{format(time, 'EEEE, MMM d, yyyy')}</span>
        </div>
        <div className="h-3 w-px bg-slate-300" />
        <div className="flex items-center gap-1.5 text-xs font-semibold text-indigo-600 font-mono tracking-wide">
          <Clock className="h-3.5 w-3.5 text-indigo-600 animate-pulse" />
          <span>{format(time, 'hh:mm:ss a')}</span>
        </div>
      </div>

      {/* Right User Profile Info */}
      <div className="flex items-center gap-3 sm:gap-4">
        {/* Role Badge */}
        <div className="hidden sm:block">
          {getRoleBadge(role)}
        </div>
        
        <div className="h-5 w-px bg-slate-200 hidden sm:block" />

        {/* Profile Card Link */}
        <Link 
          to="/profile" 
          className="flex items-center gap-3 p-1.5 pr-3 rounded-xl hover:bg-slate-100/80 transition-colors group"
        >
          <Avatar className="h-9 w-9 border-2 border-indigo-100 shadow-xs group-hover:border-indigo-300 transition-colors">
            <AvatarFallback className="bg-gradient-to-r from-indigo-600 to-blue-600 text-white font-bold text-xs">
              {getInitials(user?.firstName, user?.lastName)}
            </AvatarFallback>
          </Avatar>
          <div className="hidden md:flex flex-col text-left">
            <span className="text-sm font-semibold text-slate-900 group-hover:text-indigo-600 transition-colors leading-tight">
              {user?.firstName} {user?.lastName}
            </span>
            <span className="text-[11px] text-slate-500 truncate max-w-[140px]">{user?.email}</span>
          </div>
        </Link>
      </div>
    </header>
  );
};
