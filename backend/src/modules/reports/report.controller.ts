import { Request, Response, NextFunction } from 'express';
import { reportWorkflowService } from './report-workflow.service';
import { reportRepository } from './report.repository';
import { reportVersionRepository } from '../report-versions/report-version.repository';
import { reviewActionRepository } from '../reviews/review.repository';
import { successResponse } from '../../utils/response';
import { AuthenticatedRequest } from '../../middleware/auth';
import { AppError } from '../../middleware/error';

export class ReportController {
  // My Reports (Team Member)
  async getMyReports(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 20;
      
      const reports = await reportRepository.findMany({ owner: req.user!._id }, page, limit);
      res.status(200).json(successResponse('Reports retrieved', reports));
    } catch (error) {
      next(error);
    }
  }

  // Get specific report
  async getById(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const report = await reportRepository.findById(req.params.id as string);
      if (!report) throw new AppError('Report not found', 404);

      // Check ownership or manager access
      if (report.owner._id.toString() !== req.user!._id.toString() && req.user!.role === 'TEAM_MEMBER') {
        throw new AppError('Not authorized', 403);
      }

      res.status(200).json(successResponse('Report retrieved', { report }));
    } catch (error) {
      next(error);
    }
  }

  async getVersions(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const versions = await reportVersionRepository.findByReportId(req.params.id as string);
      res.status(200).json(successResponse('Report versions retrieved', { versions }));
    } catch (error) {
      next(error);
    }
  }

  async getReviews(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const reviews = await reviewActionRepository.findByReportId(req.params.id as string);
      res.status(200).json(successResponse('Report reviews retrieved', { reviews }));
    } catch (error) {
      next(error);
    }
  }

  // Draft lifecycle
  async createDraft(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const report = await reportWorkflowService.createDraft(req.user!._id.toString(), req.body);
      res.status(201).json(successResponse('Draft created', { report }));
    } catch (error) {
      next(error);
    }
  }

  async updateDraft(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const report = await reportWorkflowService.updateDraft(req.user!._id.toString(), req.params.id as string, req.body);
      res.status(200).json(successResponse('Draft updated', { report }));
    } catch (error) {
      next(error);
    }
  }

  async submitReport(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const report = await reportWorkflowService.submitReport(req.user!._id.toString(), req.params.id as string);
      res.status(200).json(successResponse('Report submitted', { report }));
    } catch (error) {
      next(error);
    }
  }

  // Manager Actions
  async getAllReports(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 20;
      
      const filter: any = {};
      if (req.query.status) {
        filter.currentStatus = req.query.status;
      }
      
      const reports = await reportRepository.findMany(filter, page, limit);
      res.status(200).json(successResponse('Reports retrieved', reports));
    } catch (error) {
      next(error);
    }
  }

  async approveReport(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const report = await reportWorkflowService.approveReport(req.user!._id.toString(), req.params.id as string);
      res.status(200).json(successResponse('Report approved', { report }));
    } catch (error) {
      next(error);
    }
  }

  async requestCorrection(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const report = await reportWorkflowService.requestCorrection(req.user!._id.toString(), req.params.id as string, req.body.comment);
      res.status(200).json(successResponse('Changes requested', { report }));
    } catch (error) {
      next(error);
    }
  }
}

export const reportController = new ReportController();
