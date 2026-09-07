import { apiClient } from "@/lib/api-client";
import {
  AIStatus,
  AIResponse,
  AskRequest,
  WeeklySummaryRequest,
  ProjectInsightsRequest,
  RiskAnalysisRequest,
  CompareWeeksRequest,
} from "../types/ai.types";

export const aiApi = {
  getStatus: async (): Promise<AIStatus> => {
    const response = await apiClient.get<{ success: boolean; data: AIStatus }>(
      "/api/ai/status",
    );
    return response.data.data;
  },

  ask: async (data: AskRequest): Promise<AIResponse> => {
    const response = await apiClient.post<{
      success: boolean;
      data: AIResponse;
    }>("/api/ai/ask", data);
    return response.data.data;
  },

  getWeeklySummary: async (data: WeeklySummaryRequest): Promise<AIResponse> => {
    const response = await apiClient.post<{
      success: boolean;
      data: AIResponse;
    }>("/api/ai/weekly-summary", data);
    return response.data.data;
  },

  getProjectInsights: async (
    data: ProjectInsightsRequest,
  ): Promise<AIResponse> => {
    const response = await apiClient.post<{
      success: boolean;
      data: AIResponse;
    }>("/api/ai/project-insights", data);
    return response.data.data;
  },

  getRiskAnalysis: async (data: RiskAnalysisRequest): Promise<AIResponse> => {
    const response = await apiClient.post<{
      success: boolean;
      data: AIResponse;
    }>("/api/ai/risk-analysis", data);
    return response.data.data;
  },

  getCompareWeeks: async (data: CompareWeeksRequest): Promise<AIResponse> => {
    const response = await apiClient.post<{
      success: boolean;
      data: AIResponse;
    }>("/api/ai/compare-weeks", data);
    return response.data.data;
  },
};
