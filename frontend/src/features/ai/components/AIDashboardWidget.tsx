import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Bot, ArrowRight, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const AIDashboardWidget: React.FC = () => {
  const navigate = useNavigate();

  return (
    <Card className="col-span-full md:col-span-4 lg:col-span-7 bg-gradient-to-r from-primary/10 via-primary/5 to-background border-primary/20 overflow-hidden relative">
      <div className="absolute right-0 top-0 opacity-10 pointer-events-none">
        <Bot className="w-64 h-64 -mt-12 -mr-12" />
      </div>
      <CardContent className="p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-6 relative z-10">
        <div className="flex-1 space-y-2 text-center md:text-left">
          <div className="flex items-center justify-center md:justify-start gap-2 text-primary mb-1">
            <Sparkles className="w-5 h-5" />
            <h3 className="font-bold text-lg">AI Team Insights Available</h3>
          </div>
          <p className="text-muted-foreground max-w-xl">
            Get instant summaries, identify hidden blockers, and analyze risks across all team reports with your intelligent management assistant.
          </p>
        </div>
        <Button 
          onClick={() => navigate('/ai')} 
          size="lg" 
          className="shrink-0 shadow-lg hover:shadow-xl transition-all hover:scale-105 group"
        >
          <Bot className="w-5 h-5 mr-2 group-hover:rotate-12 transition-transform" />
          View AI Insights
          <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
        </Button>
      </CardContent>
    </Card>
  );
};
