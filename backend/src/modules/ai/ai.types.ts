import { z } from 'zod';

export const AskRequestSchema = z.object({
  body: z.object({
    question: z.string().min(1, 'Question is required'),
    weekStart: z.string().optional(),
    weekEnd: z.string().optional(),
    projectId: z.string().optional(),
  })
});

export const DateRangeSchema = z.object({
  body: z.object({
    weekStart: z.string().min(1, 'weekStart is required'),
    weekEnd: z.string().min(1, 'weekEnd is required'),
  })
});

export const ProjectInsightsSchema = z.object({
  body: z.object({
    weekStart: z.string().min(1, 'weekStart is required'),
    weekEnd: z.string().min(1, 'weekEnd is required'),
    projectId: z.string().min(1, 'projectId is required'),
  })
});

export const CompareWeeksSchema = z.object({
  body: z.object({
    currentWeekStart: z.string().min(1, 'currentWeekStart is required'),
    previousWeekStart: z.string().min(1, 'previousWeekStart is required'),
  })
});

// Response Schemas (used to enforce Gemini output format)
export const AIRecommendationSchema = z.object({
  title: z.string(),
  reason: z.string(),
  priority: z.enum(['LOW', 'MEDIUM', 'HIGH', 'CRITICAL']),
});

export const AIInsightSchema = z.object({
  title: z.string(),
  severity: z.enum(['LOW', 'MEDIUM', 'HIGH', 'CRITICAL']).optional(),
  description: z.string(),
  evidence: z.array(z.string()),
});

export const AIRiskSchema = z.object({
  title: z.string(),
  severity: z.enum(['LOW', 'MEDIUM', 'HIGH', 'CRITICAL']),
  confidence: z.number().min(0).max(1), // Represents AI model confidence
  description: z.string(),
  evidence: z.array(z.string()),
  recommendation: z.string(),
});

export const AIResponseSchema = z.object({
  answer: z.string(),
  summary: z.string().optional(),
  insights: z.array(AIInsightSchema).optional(),
  recommendations: z.array(AIRecommendationSchema).optional(),
  risks: z.array(AIRiskSchema).optional(),
  sources: z.array(z.object({
    type: z.string(),
    id: z.string(),
    project: z.string().optional(),
    week: z.string().optional(),
    relevance: z.number().optional()
  })).optional()
});

export type AIResponse = z.infer<typeof AIResponseSchema>;
