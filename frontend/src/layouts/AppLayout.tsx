import React from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Topbar } from './Topbar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { AIFloatingBubble } from '@/features/ai/components/AIFloatingBubble';

export const AppLayout: React.FC = () => {
  return (
    <div className="flex h-screen bg-slate-50/50">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Topbar />
        <ScrollArea className="flex-1 bg-slate-50/50 relative">
          <main className="p-6 md:p-8 max-w-[1600px] mx-auto w-full">
            <Outlet />
          </main>
        </ScrollArea>
      </div>
      <AIFloatingBubble />
    </div>
  );
};
