import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bot, X, Maximize2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { AIChat } from './AIChat';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/app/providers/auth-provider';
import { Role } from '@/types';

export const AIFloatingBubble: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const { role } = useAuth();

  if (role !== Role.MANAGER && role !== Role.ADMIN) {
    return null;
  }

  const toggleOpen = () => setIsOpen(!isOpen);

  const expandToFull = () => {
    setIsOpen(false);
    navigate('/ai');
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute bottom-16 right-0 w-[380px] h-[550px] max-h-[80vh] bg-background border shadow-2xl rounded-2xl flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="px-4 py-3 bg-primary text-primary-foreground flex items-center justify-between shadow-sm z-10">
              <div className="flex items-center gap-2 font-medium">
                <Bot className="w-5 h-5" />
                AI Assistant
              </div>
              <div className="flex items-center gap-1">
                <Button variant="ghost" size="icon" className="h-7 w-7 rounded-full hover:bg-primary-foreground/20 text-primary-foreground" onClick={expandToFull} title="Open in full page">
                  <Maximize2 className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="icon" className="h-7 w-7 rounded-full hover:bg-primary-foreground/20 text-primary-foreground" onClick={toggleOpen}>
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </div>
            
            {/* Body */}
            <div className="flex-1 overflow-hidden bg-slate-50/50 dark:bg-slate-900/50">
              <AIChat />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={toggleOpen}
        className="w-14 h-14 bg-primary text-primary-foreground rounded-full shadow-lg flex items-center justify-center hover:shadow-xl transition-shadow border-2 border-background"
      >
        {isOpen ? <X className="w-6 h-6" /> : <Bot className="w-6 h-6" />}
      </motion.button>
    </div>
  );
};
