import { Request, Response, NextFunction } from 'express';
import { aiService } from './ai.service';
import { AppError } from '../../middleware/error';

export class AIController {
  async ask(req: any, res: Response, next: NextFunction) {
    try {
      const { question, weekStart, weekEnd, projectId } = req.body;
      const data = await aiService.handleAIRequest(req.user, 'ask', question, { weekStart, weekEnd, projectId });
      res.status(200).json({ success: true, data });
    } catch (error: any) {
      next(new AppError(error.message, 500));
    }
  }

  async weeklySummary(req: any, res: Response, next: NextFunction) {
    try {
      const { weekStart, weekEnd } = req.body;
      const prompt = `Please provide an executive weekly summary for the team based on the context data.`;
      const data = await aiService.handleAIRequest(req.user, 'weekly-summary', prompt, { weekStart, weekEnd });
      res.status(200).json({ success: true, data });
    } catch (error: any) {
      next(new AppError(error.message, 500));
    }
  }

  async projectInsights(req: any, res: Response, next: NextFunction) {
    try {
      const { projectId, weekStart, weekEnd } = req.body;
      const prompt = `Please analyze the project insights and provide blockers, achievements, and recommendations.`;
      const data = await aiService.handleAIRequest(req.user, 'project-insights', prompt, { projectId, weekStart, weekEnd });
      res.status(200).json({ success: true, data });
    } catch (error: any) {
      next(new AppError(error.message, 500));
    }
  }

  async riskAnalysis(req: any, res: Response, next: NextFunction) {
    try {
      const { weekStart, weekEnd } = req.body;
      const prompt = `Please analyze the reports and identify major risks. Rate the severity and provide recommendations.`;
      const data = await aiService.handleAIRequest(req.user, 'risk-analysis', prompt, { weekStart, weekEnd });
      res.status(200).json({ success: true, data });
    } catch (error: any) {
      next(new AppError(error.message, 500));
    }
  }

  async compareWeeks(req: any, res: Response, next: NextFunction) {
    try {
      const { currentWeekStart, previousWeekStart } = req.body;
      const prompt = `Please compare the data from ${previousWeekStart} and ${currentWeekStart}. Note any changes in blockers, workload, or task completion.`;
      const data = await aiService.handleAIRequest(req.user, 'compare-weeks', prompt, { currentWeekStart, previousWeekStart });
      res.status(200).json({ success: true, data });
    } catch (error: any) {
      next(new AppError(error.message, 500));
    }
  }

  async getStatus(req: Request, res: Response, next: NextFunction) {
    try {
      const status = await aiService.getStatus();
      res.status(200).json({ success: true, data: status });
    } catch (error: any) {
      next(new AppError(error.message, 500));
    }
  }
}

export const aiController = new AIController();
