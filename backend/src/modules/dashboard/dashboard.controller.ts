import { Request, Response, NextFunction } from 'express';
import { dashboardService } from './dashboard.service';
import { successResponse } from '../../utils/response';
import { AuthenticatedRequest } from '../../middleware/auth';

export class DashboardController {
  async getDashboard(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const dashboard = await dashboardService.getManagerDashboard(req.user!._id.toString());
      res.status(200).json(successResponse('Manager dashboard retrieved', { dashboard }));
    } catch (error) {
      next(error);
    }
  }
}

export const dashboardController = new DashboardController();
