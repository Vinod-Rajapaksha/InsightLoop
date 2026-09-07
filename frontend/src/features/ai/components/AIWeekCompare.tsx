import React from 'react';
import { useCompareWeeks } from '../hooks/useAI';
import { AIMarkdown } from './AIMarkdown';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Loader2, ArrowRightLeft, AlertTriangle } from 'lucide-react';

interface AIWeekCompareProps {
  currentWeekStart: string;
  previousWeekStart: string;
  enabled: boolean;
}

export const AIWeekCompare: React.FC<AIWeekCompareProps> = ({ currentWeekStart, previousWeekStart, enabled }) => {
  const { data, isLoading, error } = useCompareWeeks({ currentWeekStart, previousWeekStart }, enabled);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-muted-foreground space-y-4">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
        <p>Comparing team reports between weeks...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 text-center text-destructive bg-destructive/10 rounded-lg">
        <AlertTriangle className="w-8 h-8 mx-auto mb-2" />
        <p>Failed to generate week comparison.</p>
      </div>
    );
  }

  if (!data) return null;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4 bg-muted/50 p-4 rounded-xl border border-dashed">
        <div className="text-center">
          <div className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Previous Week</div>
          <Badge variant="outline" className="text-sm py-1 px-3">{previousWeekStart}</Badge>
        </div>
        
        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
          <ArrowRightLeft className="w-4 h-4 text-primary" />
        </div>
        
        <div className="text-center">
          <div className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Current Week</div>
          <Badge variant="default" className="text-sm py-1 px-3">{currentWeekStart}</Badge>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Comparison Summary</CardTitle>
          <CardDescription>Key differences and trends</CardDescription>
        </CardHeader>
        <CardContent>
          <AIMarkdown content={data.answer} />
        </CardContent>
      </Card>
      
      {data.insights && data.insights.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {data.insights.map((insight, idx) => (
            <Card key={idx} className="bg-card">
              <CardContent className="pt-6">
                <h4 className="font-medium mb-2">{insight.title}</h4>
                <p className="text-sm text-muted-foreground">{insight.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};
