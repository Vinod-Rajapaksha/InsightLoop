import React from 'react';
import { useRiskAnalysis } from '../hooks/useAI';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Loader2, ShieldAlert, AlertTriangle, ShieldCheck } from 'lucide-react';

interface AIRiskAnalysisProps {
  weekStart: string;
  weekEnd: string;
  enabled: boolean;
}

export const AIRiskAnalysis: React.FC<AIRiskAnalysisProps> = ({ weekStart, weekEnd, enabled }) => {
  const { data, isLoading, error } = useRiskAnalysis({ weekStart, weekEnd }, enabled);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-muted-foreground space-y-4">
        <Loader2 className="w-8 h-8 animate-spin text-destructive/70" />
        <p>Analyzing risk factors across reports...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 text-center text-destructive bg-destructive/10 rounded-lg">
        <AlertTriangle className="w-8 h-8 mx-auto mb-2" />
        <p>Failed to generate risk analysis.</p>
      </div>
    );
  }

  if (!data) return null;

  const risks = data.insights || [];

  if (risks.length === 0) {
    return (
      <Card className="border-emerald-500/20 bg-emerald-50/50 dark:bg-emerald-950/20">
        <CardContent className="flex flex-col items-center justify-center p-10 text-center space-y-3">
          <div className="w-12 h-12 rounded-full bg-emerald-100 dark:bg-emerald-900/50 flex items-center justify-center">
            <ShieldCheck className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
          </div>
          <div>
            <h3 className="font-semibold text-lg text-emerald-800 dark:text-emerald-300">No Significant Risks Identified</h3>
            <p className="text-emerald-600/80 dark:text-emerald-400/80 max-w-sm mt-1">
              Based on the reports from {weekStart} to {weekEnd}, there are no high-severity blockers or risks.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-lg font-medium">Identified Risks</h3>
        <Badge variant="outline">{risks.length} Risk(s) Found</Badge>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {risks.map((risk, idx) => (
          <Card key={idx} className={`border-l-4 ${getSeverityColor(risk.severity)}`}>
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start gap-2">
                <CardTitle className="text-base leading-tight">
                  {risk.title}
                </CardTitle>
                <Badge variant={risk.severity === 'CRITICAL' || risk.severity === 'HIGH' ? 'destructive' : 'secondary'} className="shrink-0 text-[10px] uppercase">
                  {risk.severity || 'MEDIUM'}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-sm text-muted-foreground">{risk.description}</p>
              
              {(risk as any).recommendation && (
                <div className="bg-muted p-3 rounded-md text-sm mt-2">
                  <span className="font-semibold block mb-1">Recommendation:</span>
                  {(risk as any).recommendation}
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

function getSeverityColor(severity?: string) {
  switch (severity?.toUpperCase()) {
    case 'CRITICAL': return 'border-l-red-600 dark:border-l-red-500';
    case 'HIGH': return 'border-l-orange-500 dark:border-l-orange-400';
    case 'MEDIUM': return 'border-l-amber-400 dark:border-l-amber-300';
    case 'LOW': return 'border-l-blue-400 dark:border-l-blue-300';
    default: return 'border-l-slate-400';
  }
}
