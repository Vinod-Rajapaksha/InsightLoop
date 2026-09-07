import { Router } from 'express';
import { dashboardController } from './dashboard.controller';
import { requireAuth, requireManager } from '../../middleware/auth';

const router = Router();

router.use(requireAuth);
router.use(requireManager);

/**
 * @openapi
 * /api/manager/dashboard:
 *   get:
 *     summary: Get Manager dashboard metrics, submissions, and status counts
 *     tags:
 *       - Dashboard
 *     parameters:
 *       - in: query
 *         name: weekStartDate
 *         schema:
 *           type: string
 *           format: date
 *         description: Filter dashboard metrics for a specific week
 *     responses:
 *       200:
 *         description: Dashboard metrics and summary
 *       403:
 *         description: Forbidden - Requires Manager role
 */
router.get('/', dashboardController.getDashboard);

export const dashboardRoutes = router;
