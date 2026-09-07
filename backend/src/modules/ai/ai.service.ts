import { ContextBuilder } from "./agent/ContextBuilder";
import { AIInteraction } from "../../models/AIInteraction";
import { Type } from "@google/genai";

function getGeminiService() {
  return require("./agent/GeminiService").geminiService;
}

const geminiSchema = {
  type: Type.OBJECT,
  properties: {
    answer: { type: Type.STRING },
    summary: { type: Type.STRING },
    insights: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          title: { type: Type.STRING },
          severity: { type: Type.STRING },
          description: { type: Type.STRING },
          evidence: { type: Type.ARRAY, items: { type: Type.STRING } },
        },
      },
    },
    recommendations: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          title: { type: Type.STRING },
          reason: { type: Type.STRING },
          priority: { type: Type.STRING },
        },
      },
    },
    risks: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          title: { type: Type.STRING },
          severity: { type: Type.STRING },
          confidence: { type: Type.NUMBER },
          description: { type: Type.STRING },
          evidence: { type: Type.ARRAY, items: { type: Type.STRING } },
          recommendation: { type: Type.STRING },
        },
      },
    },
    sources: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          type: { type: Type.STRING },
          id: { type: Type.STRING },
          project: { type: Type.STRING },
          week: { type: Type.STRING },
          relevance: { type: Type.NUMBER },
        },
      },
    },
  },
};

export class AIService {
  async handleAIRequest(
    user: any,
    requestType: string,
    prompt: string,
    requestData: any,
  ) {
    const geminiService = getGeminiService();
    if (!geminiService.isConfigured()) {
      throw new Error("AI insights are temporarily unavailable.");
    }

    const startTime = Date.now();
    const contextBuilder = new ContextBuilder(user);

    let success = false;
    let responseData = null;

    try {
      const contextText = await contextBuilder.buildContext(
        requestType,
        requestData,
      );

      responseData = await getGeminiService().generateResponse(
        user,
        prompt,
        contextText,
        geminiSchema,
      );
      success = true;
      return responseData;
    } catch (error) {
      console.error("AI Request failed:", error);
      throw new Error("AI processing failed.");
    } finally {
      // Audit Log
      await AIInteraction.create({
        user: user._id,
        type: requestType,
        question: prompt,
        filters: requestData,
        sources: responseData?.sources || [],
        success,
        aiModel: "gemini-3.5-flash-lite",
        latencyMs: Date.now() - startTime,
      }).catch((err) => console.error("Failed to log AI Interaction", err));
    }
  }

  async getStatus() {
    return {
      enabled: getGeminiService().isConfigured(),
      provider: "gemini",
      model: "gemini-3.5-flash-lite",
      ragEnabled: true,
    };
  }
}

export const aiService = new AIService();
