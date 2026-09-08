import React, { useState } from 'react';
import { format, startOfWeek, endOfWeek, subWeeks } from 'date-fns';
import { useAIStatus } from '../hooks/useAI';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AIChat } from '../components/AIChat';
import { AIWeeklySummary } from '../components/AIWeeklySummary';
import { AIRiskAnalysis } from '../components/AIRiskAnalysis';
import { AIWeekCompare } from '../components/AIWeekCompare';
import { Bot, MessageSquare, PieChart, ShieldAlert, GitCompare, AlertTriangle, Loader2 } from 'lucide-react';

export const AIAssistantPage: React.FC = () => {
  const { data: status, isLoading: isStatusLoading } = useAIStatus();
  const [activeTab, setActiveTab] = useState('chat');
  const today = new Date();
  const currentWeekStart = format(startOfWeek(today, { weekStartsOn: 1 }), 'yyyy-MM-dd');
  const currentWeekEnd = format(endOfWeek(today, { weekStartsOn: 1 }), 'yyyy-MM-dd');
  
  const previousWeekStart = format(startOfWeek(subWeeks(today, 1), { weekStartsOn: 1 }), 'yyyy-MM-dd');

  if (isStatusLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-[calc(100vh-12rem)] space-y-4 text-muted-foreground">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
        <p>Connecting to AI Service...</p>
      </div>
    );
  }

  if (!status?.enabled) {
    return (
      <div className="flex flex-col items-center justify-center h-[calc(100vh-12rem)] text-center max-w-md mx-auto space-y-6">
        <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center">
          <Bot className="w-10 h-10 text-muted-foreground" />
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-bold tracking-tight">AI Insights Unavailable</h2>
          <p className="text-muted-foreground">
            The AI service is currently disabled or not configured. Your reports and dashboards are still fully functional.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-3 sm:space-y-6 max-w-6xl mx-auto h-[calc(100dvh-6rem)] sm:h-[calc(100vh-10rem)] min-h-[480px] flex flex-col">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 sm:gap-4 shrink-0">
        <div>
          <h1 className="text-xl sm:text-3xl font-bold tracking-tight text-foreground flex items-center gap-2 sm:gap-3">
            <Bot className="w-6 h-6 sm:w-8 sm:h-8 text-primary" />
            AI Assistant
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-0.5 sm:mt-1 hidden sm:block">
            Grounded AI insights based on your team's weekly reports.
          </p>
        </div>
        <div className="text-xs sm:text-sm font-medium bg-primary/10 text-primary px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-md flex items-center gap-2 border border-primary/20 self-start sm:self-auto">
          <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
          {status.model || 'Gemini'} • RAG {status.ragEnabled ? 'Active' : 'Inactive'}
        </div>
      </div>

      <Tabs defaultValue="chat" value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col min-h-0">
        <TabsList className="grid w-full grid-cols-4 lg:w-[600px] shrink-0 mb-3 sm:mb-6">
          <TabsTrigger value="chat" className="flex items-center gap-1.5 py-1.5 text-xs sm:text-sm">
            <MessageSquare className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            <span>Chat</span>
          </TabsTrigger>
          <TabsTrigger value="summary" className="flex items-center gap-1.5 py-1.5 text-xs sm:text-sm">
            <PieChart className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            <span className="hidden sm:inline">Summary</span>
          </TabsTrigger>
          <TabsTrigger value="risks" className="flex items-center gap-1.5 py-1.5 text-xs sm:text-sm">
            <ShieldAlert className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            <span className="hidden sm:inline">Risks</span>
          </TabsTrigger>
          <TabsTrigger value="compare" className="flex items-center gap-1.5 py-1.5 text-xs sm:text-sm">
            <GitCompare className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            <span className="hidden sm:inline">Compare</span>
          </TabsTrigger>
        </TabsList>

        <div className="flex-1 min-h-0 overflow-hidden bg-card rounded-xl border shadow-sm p-1 flex flex-col">
          <TabsContent value="chat" className="h-full m-0 min-h-0 flex-1 flex flex-col data-[state=active]:flex">
            <AIChat />
          </TabsContent>

          <TabsContent value="summary" className="m-0 h-full overflow-y-auto p-4 md:p-6">
            <AIWeeklySummary 
              weekStart={currentWeekStart} 
              weekEnd={currentWeekEnd} 
              enabled={activeTab === 'summary'} 
            />
          </TabsContent>

          <TabsContent value="risks" className="m-0 h-full overflow-y-auto p-4 md:p-6">
            <AIRiskAnalysis 
              weekStart={currentWeekStart} 
              weekEnd={currentWeekEnd} 
              enabled={activeTab === 'risks'} 
            />
          </TabsContent>

          <TabsContent value="compare" className="m-0 h-full overflow-y-auto p-4 md:p-6">
            <AIWeekCompare 
              currentWeekStart={currentWeekStart} 
              previousWeekStart={previousWeekStart} 
              enabled={activeTab === 'compare'} 
            />
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
};
