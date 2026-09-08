import React from 'react';
import { useWeeklySummary } from '../hooks/useAI';
import { AIMarkdown } from './AIMarkdown';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Loader2, Calendar, Target, AlertTriangle, Lightbulb } from 'lucide-react';
import { AISource } from '../types/ai.types';

interface AIWeeklySummaryProps {
  weekStart: string;
  weekEnd: string;
  enabled: boolean;
}

export const AIWeeklySummary: React.FC<AIWeeklySummaryProps> = ({ weekStart, weekEnd, enabled }) => {
  const { data, isLoading, error } = useWeeklySummary({ weekStart, weekEnd }, enabled);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-muted-foreground space-y-4">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
        <p>Analyzing team reports and generating summary...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 text-center text-destructive bg-destructive/10 rounded-lg">
        <AlertTriangle className="w-8 h-8 mx-auto mb-2" />
        <p>Failed to generate weekly summary. Please try again later.</p>
      </div>
    );
  }

  if (!data) return null;

  return (
    <div className="space-y-6">
      <Card className="border-primary/20 shadow-sm">
        <CardHeader className="bg-primary/5 pb-4">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-xl flex items-center gap-2">
                <Target className="w-5 h-5 text-primary" />
                Executive Summary
              </CardTitle>
              <CardDescription className="mt-1">
                Overview of the team's performance this week
              </CardDescription>
            </div>
            <Badge variant="outline" className="flex items-center gap-1.5 bg-background">
              <Calendar className="w-3 h-3" />
              {weekStart} to {weekEnd}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="pt-6">
          <AIMarkdown content={data.summary || data.answer || "No summary available."} />
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {data.insights && data.insights.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Lightbulb className="w-5 h-5 text-amber-500" />
                Key Insights
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-4">
                {data.insights.map((insight, idx) => (
                  <li key={idx} className="border-l-2 border-primary/30 pl-4 py-1">
                    <h4 className="font-medium text-sm mb-1">{insight.title}</h4>
                    <p className="text-sm text-muted-foreground">{insight.description}</p>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        )}

        {data.recommendations && data.recommendations.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Target className="w-5 h-5 text-emerald-500" />
                Recommended Actions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-4">
                {data.recommendations.map((rec, idx) => (
                  <li key={idx} className="bg-muted/50 rounded-lg p-3 text-sm">
                    <span className="font-medium block mb-1">{rec.title}</span>
                    <span className="text-muted-foreground">{rec.reason}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        )}
      </div>

      {data.sources && data.sources.length > 0 && (
        <div className="text-xs text-muted-foreground bg-muted p-3 rounded-md">
          <span className="font-medium">Generated using {data.sources.length} sources:</span>
          <div className="flex flex-wrap gap-2 mt-2">
            {data.sources.map((src, i) => (
              <Badge key={i} variant="secondary" className="font-normal">
                {src.project || 'Report'} • {src.week}
              </Badge>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
