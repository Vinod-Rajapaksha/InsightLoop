import { useQuery, useMutation } from "@tanstack/react-query";
import { aiApi } from "../api/ai.api";
import {
  AskRequest,
  WeeklySummaryRequest,
  ProjectInsightsRequest,
  RiskAnalysisRequest,
  CompareWeeksRequest,
} from "../types/ai.types";

export const AI_QUERY_KEYS = {
  status: ["ai", "status"] as const,
  weeklySummary: (req: WeeklySummaryRequest) =>
    ["ai", "weeklySummary", req] as const,
  riskAnalysis: (req: RiskAnalysisRequest) =>
    ["ai", "riskAnalysis", req] as const,
  compareWeeks: (req: CompareWeeksRequest) =>
    ["ai", "compareWeeks", req] as const,
};

export const useAIStatus = () => {
  return useQuery({
    queryKey: AI_QUERY_KEYS.status,
    queryFn: aiApi.getStatus,
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 1,
  });
};

export const useAskAI = () => {
  return useMutation({
    mutationFn: (data: AskRequest) => aiApi.ask(data),
  });
};

export const useWeeklySummary = (
  data: WeeklySummaryRequest,
  enabled: boolean = false,
) => {
  return useQuery({
    queryKey: AI_QUERY_KEYS.weeklySummary(data),
    queryFn: () => aiApi.getWeeklySummary(data),
    enabled,
    staleTime: 5 * 60 * 1000,
  });
};

export const useProjectInsights = () => {
  return useMutation({
    mutationFn: (data: ProjectInsightsRequest) =>
      aiApi.getProjectInsights(data),
  });
};

export const useRiskAnalysis = (
  data: RiskAnalysisRequest,
  enabled: boolean = false,
) => {
  return useQuery({
    queryKey: AI_QUERY_KEYS.riskAnalysis(data),
    queryFn: () => aiApi.getRiskAnalysis(data),
    enabled,
    staleTime: 5 * 60 * 1000,
  });
};

export const useCompareWeeks = (
  data: CompareWeeksRequest,
  enabled: boolean = false,
) => {
  return useQuery({
    queryKey: AI_QUERY_KEYS.compareWeeks(data),
    queryFn: () => aiApi.getCompareWeeks(data),
    enabled,
    staleTime: 5 * 60 * 1000,
  });
};
