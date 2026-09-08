import mongoose from "mongoose";
import { Report, ReportStatus, TaskStatus } from "../../models/Report";
import { User, Role } from "../../models/User";

export class DashboardService {
  async getManagerDashboard(managerId: string, filters: any = {}) {
    const matchStage: any = {};

    if (filters.weekStart) {
      matchStage.weekStart = new Date(filters.weekStart);
    }
    if (filters.weekEnd) {
      matchStage.weekEnd = new Date(filters.weekEnd);
    }
    if (filters.memberId) {
      matchStage.owner = new mongoose.Types.ObjectId(filters.memberId);
    }
    if (filters.projectId) {
      matchStage.project = new mongoose.Types.ObjectId(filters.projectId);
    }
    if (filters.status) {
      matchStage.currentStatus = filters.status;
    }

    // 1. Report Status Summary
    const statusSummary = await Report.aggregate([
      { $match: matchStage },
      {
        $group: {
          _id: "$currentStatus",
          count: { $sum: 1 },
        },
      },
    ]);

    let notStartedCount = 0;

    // Calculate Not Yet Started if weekStart is provided
    if (filters.weekStart && !filters.status) {
      const activeMembers = await User.countDocuments({
        role: Role.TEAM_MEMBER,
        isActive: true,
      });

      const submittedReportsQuery: any = {
        weekStart: new Date(filters.weekStart),
      };
      if (filters.memberId) submittedReportsQuery.owner = matchStage.owner;

      const submittedReportsCount = await Report.countDocuments(
        submittedReportsQuery,
      );

      notStartedCount = Math.max(
        0,
        (filters.memberId ? 1 : activeMembers) - submittedReportsCount,
      );

      statusSummary.push({ _id: "NOT_STARTED", count: notStartedCount });
    } else if (filters.status === "NOT_STARTED") {
      const activeMembers = await User.countDocuments({
        role: Role.TEAM_MEMBER,
        isActive: true,
      });
      const submittedReportsCount = await Report.countDocuments({
        weekStart: new Date(filters.weekStart),
      });
      notStartedCount = Math.max(0, activeMembers - submittedReportsCount);
      statusSummary.push({ _id: "NOT_STARTED", count: notStartedCount });
    }

    // 2. Project workload (hours planned vs actual)
    const projectWorkload = await Report.aggregate([
      { $match: matchStage },
      { $unwind: "$tasksCompleted" },
      {
        $group: {
          _id: "$project",
          totalPlannedHours: { $sum: "$tasksCompleted.plannedHours" },
          totalSpentHours: { $sum: "$tasksCompleted.spentHours" },
        },
      },
      {
        $lookup: {
          from: "projects",
          localField: "_id",
          foreignField: "_id",
          as: "projectInfo",
        },
      },
      { $unwind: "$projectInfo" },
      {
        $project: {
          projectName: "$projectInfo.name",
          totalPlannedHours: 1,
          totalSpentHours: 1,
        },
      },
    ]);

    // 3. Blocked tasks
    const blockedTasks = await Report.aggregate([
      { $match: matchStage },
      { $unwind: "$tasksCompleted" },
      { $match: { "tasksCompleted.status": TaskStatus.BLOCKED } },
      {
        $lookup: {
          from: "users",
          localField: "owner",
          foreignField: "_id",
          as: "ownerInfo",
        },
      },
      { $unwind: "$ownerInfo" },
      {
        $project: {
          taskName: "$tasksCompleted.taskName",
          ownerName: {
            $concat: ["$ownerInfo.firstName", " ", "$ownerInfo.lastName"],
          },
          reportId: "$_id",
        },
      },
    ]);

    // 4. Open Blockers (from blockers array)
    const openBlockersList = await Report.aggregate([
      { $match: matchStage },
      { $unwind: "$blockers" },
      {
        $lookup: {
          from: "users",
          localField: "owner",
          foreignField: "_id",
          as: "ownerInfo",
        },
      },
      { $unwind: "$ownerInfo" },
      {
        $project: {
          description: "$blockers.description",
          isKeyIssue: "$blockers.isKeyIssue",
          ownerName: {
            $concat: ["$ownerInfo.firstName", " ", "$ownerInfo.lastName"],
          },
          reportId: "$_id",
        },
      },
    ]);

    // Calculate Compliance Rate
    let complianceRate = 100;
    const totalReportsExpected = filters.memberId
      ? 1
      : await User.countDocuments({ role: Role.TEAM_MEMBER, isActive: true });

    if (filters.weekStart && totalReportsExpected > 0) {
      const totalSubmitted = statusSummary
        .filter((s) => s._id !== "NOT_STARTED" && s._id !== ReportStatus.DRAFT)
        .reduce((acc, curr) => acc + curr.count, 0);
      complianceRate = Math.round(
        (totalSubmitted / totalReportsExpected) * 100,
      );
    } else {
      const allTimeSubmitted = await Report.countDocuments({
        currentStatus: { $ne: ReportStatus.DRAFT },
      });
      const allTimeDrafts = await Report.countDocuments({
        currentStatus: ReportStatus.DRAFT,
      });
      const totalKnown = allTimeSubmitted + allTimeDrafts;
      if (totalKnown > 0) {
        complianceRate = Math.round((allTimeSubmitted / totalKnown) * 100);
      }
    }

    return {
      statusSummary: statusSummary.map((s) => ({
        status: s._id,
        count: s.count,
      })),
      projectWorkload,
      blockedTasks,
      openBlockersList,
      complianceRate,
    };
  }
}

export const dashboardService = new DashboardService();
