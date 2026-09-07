import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '@/app/providers/auth-provider';
import { Role } from '@/types';
import { 
  LayoutDashboard, 
  FileText, 
  Files, 
  FolderKanban, 
  Users, 
  UserCircle,
  Bot,
  Sparkles,
  BarChart3,
  ChevronRight,
  ChevronLeft,
  LogOut
} from 'lucide-react';
import { cn } from '@/utils';
import { Button } from '@/components/ui/button';
import { ConfirmAlert } from '@/components/ui/confirm-alert';

export const Sidebar: React.FC = () => {
  const { role, logout } = useAuth();
  const [isCollapsed, setIsCollapsed] = useState(() => typeof window !== 'undefined' && window.innerWidth < 768);
  const [logoutOpen, setLogoutOpen] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setIsCollapsed(true);
      } else {
        setIsCollapsed(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const navItems = getNavItems(role);

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  const handleLogout = async () => {
    await logout();
    setLogoutOpen(false);
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {!isCollapsed && (
        <div 
          className="fixed inset-0 bg-slate-950/40 backdrop-blur-sm z-40 md:hidden transition-all duration-300" 
          onClick={() => setIsCollapsed(true)}
        />
      )}

      {/* Sidebar Container */}
      <aside className={cn(
        "sticky top-0 left-0 z-50 h-screen bg-white/90 backdrop-blur-xl border-r border-slate-200/80 shadow-xl shadow-slate-900/5 transition-all duration-300 ease-out flex flex-col justify-between group/sidebar shrink-0",
        isCollapsed ? "w-16 md:w-20" : "fixed md:sticky w-64 md:w-64"
      )}>
        <div>
          {/* Brand Header & Toggle Button */}
          <div className="p-3 sm:p-4 flex items-center justify-between border-b border-slate-100 relative min-h-[65px]">
            {/* Expanded Logo & App Name */}
            <div className={cn("flex items-center gap-3 overflow-hidden transition-all duration-300", isCollapsed ? "w-0 opacity-0" : "w-full opacity-100")}>
              <div className="bg-gradient-to-r from-indigo-600 to-blue-600 text-white p-2 rounded-xl shadow-md shadow-indigo-500/20 shrink-0">
                <BarChart3 className="h-5 w-5" />
              </div>
              <div className="flex flex-col min-w-0">
                <span className="font-bold text-xl tracking-tight text-slate-900 leading-tight">InsightLoop</span>
                <span className="text-[11px] font-medium text-indigo-600 flex items-center gap-1 mt-0.5">
                  <Sparkles className="h-3 w-3" /> AI Workspace
                </span>
              </div>
            </div>

            {/* Collapsed Icon Logo */}
            {isCollapsed && (
              <button 
                onClick={toggleSidebar}
                className="mx-auto bg-gradient-to-r from-indigo-600 to-blue-600 text-white p-2.5 rounded-xl shadow-md shadow-indigo-500/20 hover:scale-105 transition-transform cursor-pointer"
                title="Expand Sidebar"
              >
                <BarChart3 className="h-5 w-5" />
              </button>
            )}

            {/* Expand / Collapse Button */}
            <button
              onClick={toggleSidebar}
              className={cn(
                "flex items-center justify-center h-7 w-7 rounded-full bg-white border border-slate-200 shadow-md text-slate-500 hover:text-indigo-600 hover:scale-110 transition-all absolute -right-3.5 top-5 z-10 cursor-pointer",
                isCollapsed && "hidden md:flex"
              )}
              title={isCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
            >
              {isCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="p-2 sm:p-3 space-y-1.5 overflow-y-auto max-h-[calc(100vh-160px)] custom-scrollbar">
            {!isCollapsed && (
              <p className="px-3 text-[11px] font-semibold tracking-wider text-slate-400 uppercase mb-3">Navigation</p>
            )}
            <ul className="space-y-1">
              {navItems.map((item) => (
                <li key={item.path}>
                  <NavLink
                    to={item.path}
                    end={item.end}
                    onClick={() => {
                      if (window.innerWidth < 768) {
                        setIsCollapsed(true);
                      }
                    }}
                    className={({ isActive }) =>
                      cn(
                        "group relative flex items-center py-2.5 rounded-xl text-sm font-medium transition-all duration-200",
                        isCollapsed ? "justify-center h-10 w-10 mx-auto px-0" : "px-3.5 justify-between",
                        isActive 
                          ? "bg-gradient-to-r from-indigo-600 to-blue-600 text-white shadow-md shadow-indigo-500/25 font-semibold" 
                          : "text-slate-600 hover:bg-indigo-50/70 hover:text-indigo-600"
                      )
                    }
                    title={isCollapsed ? item.label : undefined}
                  >
                    {({ isActive }) => (
                      <>
                        <div className="flex items-center gap-3">
                          <item.icon className={cn("h-5 w-5 transition-transform group-hover:scale-110 duration-200 shrink-0", isActive ? "text-white" : "text-slate-400 group-hover:text-indigo-600")} />
                          {!isCollapsed && <span className="truncate">{item.label}</span>}
                        </div>
                        {isActive && !isCollapsed && (
                          <ChevronRight className="h-4 w-4 opacity-80" />
                        )}
                      </>
                    )}
                  </NavLink>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        {/* Sidebar Footer Logout */}
        <div className={cn("p-2 sm:p-3 m-2 rounded-2xl bg-gradient-to-b from-slate-50 to-indigo-50/40 border border-slate-200/80 shadow-xs space-y-3", isCollapsed && "m-1 p-1.5 bg-transparent border-none shadow-none")}>
          <Button
            variant="ghost"
            onClick={() => setLogoutOpen(true)}
            className={cn(
              "w-full text-xs font-semibold text-rose-600 bg-rose-50/80 border border-rose-200/60 hover:border-rose-300 hover:bg-gradient-to-r hover:from-rose-600 hover:to-red-600 hover:text-white rounded-xl transition-all duration-200 shadow-2xs hover:shadow-md hover:shadow-rose-500/25 cursor-pointer",
              isCollapsed ? "px-0 justify-center h-10 w-10 mx-auto border-rose-200" : "justify-center px-3 h-9.5"
            )}
            title={isCollapsed ? "Logout" : undefined}
          >
            <LogOut className={cn("h-4 w-4 shrink-0 transition-transform group-hover:scale-110", !isCollapsed && "mr-2")} />
            {!isCollapsed && <span>Log out of Workspace</span>}
          </Button>
        </div>

        <ConfirmAlert 
          open={logoutOpen} 
          onOpenChange={setLogoutOpen}
          title="Confirm Logout"
          description="Are you sure you want to log out of your InsightLoop workspace?"
          onConfirm={handleLogout}
          confirmText="Log out"
          isDestructive={true}
        />
      </aside>
    </>
  );
};

function getNavItems(role: Role | null) {
  const items = [];

  if (role === Role.TEAM_MEMBER) {
    items.push(
      { label: 'Dashboard', path: '/member/dashboard', icon: LayoutDashboard, end: true },
      { label: 'Create Weekly Report', path: '/member/reports/new', icon: FileText, end: true },
      { label: 'Report History', path: '/member/reports', icon: Files, end: true },
      { label: 'Projects', path: '/member/projects', icon: FolderKanban, end: true },
      { label: 'My Profile', path: '/profile', icon: UserCircle, end: true }
    );
  } else if (role === Role.MANAGER) {
    items.push(
      { label: 'Dashboard', path: '/manager/dashboard', icon: LayoutDashboard, end: true },
      { label: 'Team Reports', path: '/manager/reports', icon: Files, end: true },
      { label: 'My Reports', path: '/member/reports', icon: FileText, end: true },
      { label: 'Projects', path: '/manager/projects', icon: FolderKanban, end: true },
      { label: 'AI Assistant', path: '/ai', icon: Bot, end: true },
      { label: 'My Profile', path: '/profile', icon: UserCircle, end: true }
    );
  } else if (role === Role.ADMIN) {
    items.push(
      { label: 'Dashboard', path: '/manager/dashboard', icon: LayoutDashboard, end: true },
      { label: 'Team Reports', path: '/manager/reports', icon: Files, end: true },
      { label: 'Projects', path: '/manager/projects', icon: FolderKanban, end: true },
      { label: 'User Management', path: '/admin/users', icon: Users, end: true },
      { label: 'AI Assistant', path: '/ai', icon: Bot, end: true },
      { label: 'My Profile', path: '/profile', icon: UserCircle, end: true }
    );
  }

  return items;
}
