import { ContextBuilder } from "./agent/ContextBuilder";
import { AIInteraction } from "../../models/AIInteraction";
import { AIResponseSchema } from "./ai.types";
import { zodToJsonSchema } from "zod-to-json-schema";

function getGeminiService() {
  return require("./agent/GeminiService").geminiService;
}

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

      const jsonSchema = zodToJsonSchema(AIResponseSchema as any, "AIResponse");
      const schemaDef = (jsonSchema as any).definitions["AIResponse"];

      // Remove any zod specific fields that Gemini SDK rejects
      delete schemaDef.additionalProperties;

      responseData = await getGeminiService().generateResponse(
        user,
        prompt,
        contextText,
        schemaDef as any,
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
