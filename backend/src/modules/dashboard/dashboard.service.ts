import { Report, ReportStatus, TaskStatus } from '../../models/Report';

export class DashboardService {
  async getManagerDashboard(managerId: string) {
    // Basic analytics for all reports
    
    // 1. Report Status Summary
    const statusSummary = await Report.aggregate([
      {
        $group: {
          _id: '$currentStatus',
          count: { $sum: 1 }
        }
      }
    ]);

    // 2. Project workload (hours planned vs actual)
    const projectWorkload = await Report.aggregate([
      { $unwind: '$tasksCompleted' },
      {
        $group: {
          _id: '$project',
          totalPlannedHours: { $sum: '$tasksCompleted.plannedHours' },
          totalSpentHours: { $sum: '$tasksCompleted.spentHours' }
        }
      },
      {
        $lookup: {
          from: 'projects',
          localField: '_id',
          foreignField: '_id',
          as: 'projectInfo'
        }
      },
      { $unwind: '$projectInfo' },
      {
        $project: {
          projectName: '$projectInfo.name',
          totalPlannedHours: 1,
          totalSpentHours: 1
        }
      }
    ]);

    // 3. Blocked tasks
    const blockedTasks = await Report.aggregate([
      { $unwind: '$tasksCompleted' },
      { $match: { 'tasksCompleted.status': TaskStatus.BLOCKED } },
      {
        $lookup: {
          from: 'users',
          localField: 'owner',
          foreignField: '_id',
          as: 'ownerInfo'
        }
      },
      { $unwind: '$ownerInfo' },
      {
        $project: {
          taskName: '$tasksCompleted.taskName',
          ownerName: { $concat: ['$ownerInfo.firstName', ' ', '$ownerInfo.lastName'] },
          reportId: '$_id'
        }
      }
    ]);

    return {
      statusSummary: statusSummary.map(s => ({ status: s._id, count: s.count })),
      projectWorkload,
      blockedTasks
    };
  }
}

export const dashboardService = new DashboardService();
