export interface AIInsight {
  title: string;
  severity?: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
  description: string;
  evidence?: string[];
}

export interface AIRecommendation {
  title: string;
  reason: string;
  priority?: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
}

export interface AIRisk {
  title: string;
  severity: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
  confidence: number;
  description: string;
  evidence: string[];
  recommendation: string;
}

export interface AISource {
  type: string;
  id?: string;
  reportId?: string;
  project?: string;
  week?: string;
  relevance?: number;
}

export interface AIResponse {
  answer: string;
  summary?: string;
  insights?: AIInsight[];
  recommendations?: AIRecommendation[];
  sources?: AISource[];
}

export interface AIStatus {
  enabled: boolean;
  provider?: string;
  model?: string;
  ragEnabled?: boolean;
}

export interface WeeklySummaryRequest {
  weekStart: string;
  weekEnd: string;
}

export interface ProjectInsightsRequest {
  projectId: string;
  weekStart: string;
  weekEnd: string;
}

export interface RiskAnalysisRequest {
  weekStart: string;
  weekEnd: string;
}

export interface CompareWeeksRequest {
  currentWeekStart: string;
  previousWeekStart: string;
}

export interface AskRequest {
  question: string;
  weekStart?: string;
  weekEnd?: string;
}
