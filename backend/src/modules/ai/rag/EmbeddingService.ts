import { GoogleGenAI } from '@google/genai';
import { env } from '../../../config/env';
import { IReport } from '../../../models';

export class EmbeddingService {
  private ai: GoogleGenAI | null = null;

  constructor() {
    if (env.GEMINI_API_KEY) {
      this.ai = new GoogleGenAI({ apiKey: env.GEMINI_API_KEY });
    }
  }

  async generateEmbedding(text: string): Promise<number[]> {
    if (!this.ai) {
      throw new Error('Gemini API key is not configured.');
    }

    try {
      let response;
      try {
        response = await this.ai.models.embedContent({
          model: 'gemini-embedding-001',
          contents: text,
        });
      } catch (err) {
        response = await this.ai.models.embedContent({
          model: 'text-embedding-004',
          contents: text,
        });
      }

      if (!response.embeddings || response.embeddings.length === 0 || !response.embeddings[0].values) {
        throw new Error('Failed to generate embedding: Empty response');
      }

      return response.embeddings[0].values;
    } catch (error) {
      console.error('Embedding generation failed:', error);
      throw new Error('Embedding generation failed.');
    }
  }

  convertReportToText(report: IReport): string {
    const projectInfo = `Project ID: ${report.project.toString()}\n`;
    const weekInfo = `Week: ${report.weekStart.toISOString().split('T')[0]} to ${report.weekEnd.toISOString().split('T')[0]}\n`;
    
    let completedText = 'Completed Tasks:\n';
    report.tasksCompleted.forEach(t => {
      completedText += `- ${t.taskName} (${t.spentHours}h) - ${t.deliverable || 'No deliverable'}\n`;
    });

    let nextWeekText = 'Next Week Tasks:\n';
    report.nextWeekTasks.forEach(t => {
      nextWeekText += `- ${t.taskName} (Planned: ${t.plannedHours}h)\n`;
    });

    let blockersText = 'Blockers:\n';
    report.blockers.forEach(b => {
      blockersText += `- ${b.description} ${b.isKeyIssue ? '[KEY ISSUE]' : ''}\n`;
    });

    let achievementsText = 'Achievements:\n';
    report.achievements.forEach(a => {
      achievementsText += `- ${a.description} ${a.isKeyAchievement ? '[KEY ACHIEVEMENT]' : ''}\n`;
    });

    let reviewText = '';
    if (report.latestReviewComment) {
      reviewText = `Manager Review Comment: ${report.latestReviewComment}\n`;
    }

    return `${projectInfo}${weekInfo}\n${completedText}\n${nextWeekText}\n${blockersText}\n${achievementsText}\n${reviewText}\nNotes: ${report.notes || 'None'}`;
  }
}

export const embeddingService = new EmbeddingService();
