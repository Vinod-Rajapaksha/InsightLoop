import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Topbar } from './Topbar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { AIFloatingBubble } from '@/features/ai/components/AIFloatingBubble';
import { PageTransition } from '@/components/ui/page-transition';
import { AnimatePresence } from 'framer-motion';

export const AppLayout: React.FC = () => {
  const location = useLocation();

  return (
    <div className="flex h-screen bg-slate-50/50">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Topbar />
        <ScrollArea className="flex-1 bg-slate-50/50 relative">
          <main className="p-6 md:p-8 max-w-[1600px] mx-auto w-full">
            <AnimatePresence mode="wait">
              <PageTransition key={location.pathname}>
                <Outlet />
              </PageTransition>
            </AnimatePresence>
          </main>
        </ScrollArea>
      </div>
      <AIFloatingBubble />
    </div>
  );
};
