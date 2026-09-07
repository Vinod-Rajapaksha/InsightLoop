import { Report, IReport } from '../../../models/Report';
import { Project } from '../../../models/Project';
import { User, Role } from '../../../models/User';
import { vectorDocumentRepository } from '../rag/VectorDocumentRepository';
import { embeddingService } from '../rag/EmbeddingService';
import mongoose from 'mongoose';

export const aiToolsDeclarations = [
  {
    name: 'getTeamSummary',
    description: 'Get aggregated summary of team reports for a given week.',
    parameters: {
      type: 'OBJECT',
      properties: {
        weekStart: { type: 'STRING', description: 'Start of the week (YYYY-MM-DD)' },
        weekEnd: { type: 'STRING', description: 'End of the week (YYYY-MM-DD)' },
      },
      required: ['weekStart', 'weekEnd'],
    },
  },
  {
    name: 'getProjectInsights',
    description: 'Get project specific insights like completed tasks and blockers.',
    parameters: {
      type: 'OBJECT',
      properties: {
        projectId: { type: 'STRING' },
        weekStart: { type: 'STRING' },
        weekEnd: { type: 'STRING' },
      },
      required: ['projectId'],
    },
  },
  {
    name: 'searchReportKnowledge',
    description: 'Search historical reports using vector search (RAG) for specific topics or blockers.',
    parameters: {
      type: 'OBJECT',
      properties: {
        query: { type: 'STRING', description: 'The semantic query to search for' },
        projectId: { type: 'STRING' },
        weekStart: { type: 'STRING' },
      },
      required: ['query'],
    },
  }
];

export class AIToolHandlers {
  constructor(private user: any) {}

  private enforceManager() {
    if (this.user.role === Role.TEAM_MEMBER) {
      throw new Error('Unauthorized: Tool requires Manager or Admin privileges');
    }
  }

  async getTeamSummary(args: any) {
    this.enforceManager();
    const { weekStart, weekEnd } = args;
    
    const start = new Date(weekStart);
    const end = new Date(weekEnd);

    const reports = await Report.find({ weekStart: { $gte: start }, weekEnd: { $lte: end } }).populate('owner', 'firstName lastName');
    
    let totalPlanned = 0;
    let totalSpent = 0;
    let blockersCount = 0;
    let achievementsCount = 0;

    reports.forEach(r => {
      r.tasksCompleted.forEach(t => totalSpent += t.spentHours);
      r.nextWeekTasks.forEach(t => totalPlanned += t.plannedHours);
      blockersCount += r.blockers.length;
      achievementsCount += r.achievements.length;
    });

    return {
      reportCount: reports.length,
      statusBreakdown: reports.reduce((acc: any, r) => {
        acc[r.currentStatus] = (acc[r.currentStatus] || 0) + 1;
        return acc;
      }, {}),
      totalSpentHours: totalSpent,
      totalPlannedHoursNextWeek: totalPlanned,
      totalBlockers: blockersCount,
      totalAchievements: achievementsCount
    };
  }

  async getProjectInsights(args: any) {
    this.enforceManager();
    const { projectId, weekStart, weekEnd } = args;

    const query: any = { project: new mongoose.Types.ObjectId(projectId) };
    if (weekStart) query.weekStart = { $gte: new Date(weekStart) };
    if (weekEnd) query.weekEnd = { $lte: new Date(weekEnd) };

    const reports = await Report.find(query).populate('owner', 'firstName lastName');
    const project = await Project.findById(projectId);

    return {
      projectName: project?.name,
      reportsCount: reports.length,
      blockers: reports.flatMap(r => r.blockers.map(b => b.description)),
      achievements: reports.flatMap(r => r.achievements.map(a => a.description)),
    };
  }

  async searchReportKnowledge(args: any) {
    this.enforceManager();
    const { query, projectId, weekStart } = args;
    
    try {
      const embedding = await embeddingService.generateEmbedding(query);
      
      const filters: any = {};
      if (projectId) filters.projectId = projectId;
      if (weekStart) filters.weekStart = new Date(weekStart);

      const results = await vectorDocumentRepository.searchSimilar(embedding, filters, 5);
      
      return results.map(r => ({
        content: r.content,
        metadata: r.metadata,
        score: r.score,
        sourceId: r.sourceId,
      }));
    } catch (error) {
      console.warn('RAG search failed or not configured', error);
      return { message: 'Vector search unavailable. Please rely on deterministic data.' };
    }
  }

  async handleToolCall(name: string, args: any) {
    switch (name) {
      case 'getTeamSummary': return this.getTeamSummary(args);
      case 'getProjectInsights': return this.getProjectInsights(args);
      case 'searchReportKnowledge': return this.searchReportKnowledge(args);
      default: throw new Error(`Tool ${name} not found`);
    }
  }
}
