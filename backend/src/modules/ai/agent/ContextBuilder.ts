import { AIToolHandlers } from "../tools";

export class ContextBuilder {
  constructor(private user: any) {}

  async buildContext(requestType: string, requestData: any) {
    const tools = new AIToolHandlers(this.user);

    // Deterministically gather data to minimize Gemini token usage & tool loops
    let contextText = "";

    try {
      if (requestType === "weekly-summary" || requestType === "risk-analysis" || requestType === "ask") {
        const summary = await tools.getTeamSummary({
          weekStart: requestData?.weekStart,
          weekEnd: requestData?.weekEnd,
        });
        contextText += `### Deterministic Team Summary\n${JSON.stringify(summary, null, 2)}\n\n`;
      }

      if (requestType === "project-insights" && requestData.projectId) {
        const projInsights = await tools.getProjectInsights({
          projectId: requestData.projectId,
          weekStart: requestData.weekStart,
          weekEnd: requestData.weekEnd,
        });
        contextText += `### Deterministic Project Insights\n${JSON.stringify(projInsights, null, 2)}\n\n`;
      }
    } catch (err) {
      console.warn("Failed to build deterministic context", err);
    }

    return contextText;
  }
}
