import { reportRepository } from '../reports/report.repository';
import { reportVersionRepository } from '../report-versions/report-version.repository';
import { reviewActionRepository } from '../reviews/review.repository';
import { AppError } from '../../middleware/error';
import { IReport, ReportStatus } from '../../models/Report';
import { ReviewActionType } from '../../models/ReviewAction';

export class ReportWorkflowService {
  async createDraft(userId: string, data: any): Promise<IReport> {
    // Validate that a report for this week and project doesn't already exist for this user
    const existing = await reportRepository.findMany({
      owner: userId,
      weekStart: data.weekStart,
    }, 1, 1);

    if (existing.total > 0) {
      throw new AppError('A report for this week already exists', 409);
    }

    return await reportRepository.create({
      ...data,
      owner: userId,
      currentStatus: ReportStatus.DRAFT,
      currentVersion: 1,
    });
  }

  async updateDraft(userId: string, reportId: string, data: any): Promise<IReport> {
    const report = await reportRepository.findById(reportId);
    if (!report) throw new AppError('Report not found', 404);

    if (report.owner._id.toString() !== userId && report.owner.toString() !== userId) {
      throw new AppError('Not authorized to edit this report', 403);
    }

    if (![ReportStatus.DRAFT, ReportStatus.NEEDS_CORRECTION].includes(report.currentStatus)) {
      throw new AppError('Cannot edit a report that is already submitted or approved', 400);
    }

    return await reportRepository.update(reportId, data) as IReport;
  }

  async submitReport(userId: string, reportId: string): Promise<IReport> {
    const report = await reportRepository.findById(reportId);
    if (!report) throw new AppError('Report not found', 404);

    if (report.owner._id.toString() !== userId && report.owner.toString() !== userId) {
      throw new AppError('Not authorized to submit this report', 403);
    }

    if (![ReportStatus.DRAFT, ReportStatus.NEEDS_CORRECTION].includes(report.currentStatus)) {
      throw new AppError('Invalid status transition', 400);
    }

    const newVersion = report.currentStatus === ReportStatus.NEEDS_CORRECTION 
      ? report.currentVersion + 1 
      : report.currentVersion;

    // Create a snapshot version
    const version = await reportVersionRepository.create({
      reportId: report._id as any,
      versionNumber: newVersion,
      snapshot: report.toObject(),
      submittedBy: userId as any,
      statusAtSubmission: ReportStatus.SUBMITTED,
    });

    return await reportRepository.update(reportId, {
      currentStatus: ReportStatus.SUBMITTED,
      currentVersion: newVersion,
    }) as IReport;
  }

  async requestCorrection(managerId: string, reportId: string, comment: string): Promise<IReport> {
    const report = await reportRepository.findById(reportId);
    if (!report) throw new AppError('Report not found', 404);

    if (report.currentStatus !== ReportStatus.SUBMITTED) {
      throw new AppError('Can only request correction on SUBMITTED reports', 400);
    }

    // Find the latest version ID to associate with the review action
    const versions = await reportVersionRepository.findByReportId(reportId);
    const latestVersion = versions[0];

    await reviewActionRepository.create({
      reportId: report._id as any,
      reportVersionId: (latestVersion ? latestVersion._id : report._id) as any,
      reviewerId: managerId as any,
      action: ReviewActionType.CHANGES_REQUESTED,
      comment,
    });

    return await reportRepository.update(reportId, {
      currentStatus: ReportStatus.NEEDS_CORRECTION,
      latestReviewComment: comment,
      latestReviewedBy: managerId as any,
      latestReviewedAt: new Date(),
    }) as IReport;
  }

  async approveReport(managerId: string, reportId: string): Promise<IReport> {
    const report = await reportRepository.findById(reportId);
    if (!report) throw new AppError('Report not found', 404);

    if (report.currentStatus !== ReportStatus.SUBMITTED) {
      throw new AppError('Can only approve SUBMITTED reports', 400);
    }

    const versions = await reportVersionRepository.findByReportId(reportId);
    const latestVersion = versions[0];

    await reviewActionRepository.create({
      reportId: report._id as any,
      reportVersionId: (latestVersion ? latestVersion._id : report._id) as any, 
      reviewerId: managerId as any,
      action: ReviewActionType.APPROVED,
      comment: 'Approved',
    });

    return await reportRepository.update(reportId, {
      currentStatus: ReportStatus.APPROVED,
      latestReviewedBy: managerId as any,
      latestReviewedAt: new Date(),
    }) as IReport;
  }
}

export const reportWorkflowService = new ReportWorkflowService();
