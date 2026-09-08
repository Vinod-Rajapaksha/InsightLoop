import { Response, NextFunction } from "express";
import { dashboardService } from "./dashboard.service";
import { successResponse } from "../../utils/response";
import { AuthenticatedRequest } from "../../middleware/auth";

export class DashboardController {
  async getDashboard(
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const filters = {
        weekStart: req.query.weekStartDate as string,
        weekEnd: req.query.weekEndDate as string,
        memberId: req.query.memberId as string,
        projectId: req.query.projectId as string,
        status: req.query.status as string,
      };
      const dashboard = await dashboardService.getManagerDashboard(
        req.user!._id.toString(),
        filters,
      );
      res
        .status(200)
        .json(successResponse("Manager dashboard retrieved", { dashboard }));
    } catch (error) {
      next(error);
    }
  }
}

export const dashboardController = new DashboardController();
