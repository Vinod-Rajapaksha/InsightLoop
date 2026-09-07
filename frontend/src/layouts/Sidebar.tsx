import React, { useState } from 'react';
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
  Menu,
  X
} from 'lucide-react';
import { cn } from '@/utils';
import { Button } from '@/components/ui/button';

export const Sidebar: React.FC = () => {
  const { role } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  const navItems = getNavItems(role);

  const toggleSidebar = () => setIsOpen(!isOpen);
  const closeSidebar = () => setIsOpen(false);

  return (
    <>
      {/* Mobile Toggle */}
      <div className="md:hidden flex items-center justify-between p-4 border-b bg-card">
        <div className="font-bold text-xl tracking-tight text-primary">InsightLoop</div>
        <Button variant="ghost" size="icon" onClick={toggleSidebar}>
          {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </Button>
      </div>

      {/* Sidebar Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden" 
          onClick={closeSidebar}
        />
      )}

      {/* Sidebar Content */}
      <aside className={cn(
        "fixed md:sticky top-0 left-0 z-50 h-screen w-64 bg-card border-r shadow-sm transition-transform duration-200 ease-in-out md:translate-x-0 flex flex-col",
        isOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="p-6 hidden md:block">
          <div className="font-bold text-2xl tracking-tight text-primary">InsightLoop</div>
        </div>

        <nav className="flex-1 overflow-y-auto py-4">
          <ul className="space-y-1 px-3">
            {navItems.map((item) => (
              <li key={item.path}>
                <NavLink
                  to={item.path}
                  onClick={closeSidebar}
                  className={({ isActive }) =>
                    cn(
                      "flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-colors",
                      isActive 
                        ? "bg-primary/10 text-primary" 
                        : "text-muted-foreground hover:bg-muted hover:text-foreground"
                    )
                  }
                >
                  <item.icon className="h-5 w-5" />
                  {item.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
      </aside>
    </>
  );
};

function getNavItems(role: Role | null) {
  const items = [];

  if (role === Role.TEAM_MEMBER) {
    items.push(
      { label: 'Dashboard', path: '/member/dashboard', icon: LayoutDashboard },
      { label: 'My Weekly Report', path: '/member/reports/new', icon: FileText },
      { label: 'Report History', path: '/member/reports', icon: Files },
      { label: 'Projects', path: '/member/projects', icon: FolderKanban },
      { label: 'Profile', path: '/profile', icon: UserCircle }
    );
  } else if (role === Role.MANAGER) {
    items.push(
      { label: 'Dashboard', path: '/manager/dashboard', icon: LayoutDashboard },
      { label: 'Team Reports', path: '/manager/reports', icon: Files },
      { label: 'My Reports', path: '/member/reports', icon: FileText },
      { label: 'Projects', path: '/manager/projects', icon: FolderKanban },
      { label: 'Profile', path: '/profile', icon: UserCircle }
    );
  } else if (role === Role.ADMIN) {
    items.push(
      { label: 'Dashboard', path: '/manager/dashboard', icon: LayoutDashboard },
      { label: 'Team Reports', path: '/manager/reports', icon: Files },
      { label: 'Projects', path: '/manager/projects', icon: FolderKanban },
      { label: 'User Management', path: '/admin/users', icon: Users },
      { label: 'Profile', path: '/profile', icon: UserCircle }
    );
  }

  return items;
}
