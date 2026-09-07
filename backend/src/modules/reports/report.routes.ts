import { Router } from 'express';
import { reportController } from './report.controller';
import { validate } from '../../middleware/validate';
import { createReportSchema, updateReportSchema, requestChangesSchema } from '../../schemas/report.schema';
import { requireAuth, requireManager } from '../../middleware/auth';

const router = Router();

router.use(requireAuth);

/**
 * @openapi
 * /api/reports/my:
 *   get:
 *     summary: Get logged-in user's weekly reports
 *     tags:
 *       - Reports
 *     responses:
 *       200:
 *         description: List of user reports
 */
router.get('/my', reportController.getMyReports);

/**
 * @openapi
 * /api/reports:
 *   post:
 *     summary: Create a weekly report draft
 *     tags:
 *       - Reports
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - weekStartDate
 *               - achievements
 *             properties:
 *               weekStartDate:
 *                 type: string
 *                 format: date
 *               achievements:
 *                 type: string
 *               plansForNextWeek:
 *                 type: string
 *               blockers:
 *                 type: string
 *               projectId:
 *                 type: string
 *     responses:
 *       201:
 *         description: Draft created
 */
router.post('/', validate(createReportSchema), reportController.createDraft);

/**
 * @openapi
 * /api/reports/{id}:
 *   put:
 *     summary: Update a draft or returned report
 *     tags:
 *       - Reports
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               achievements:
 *                 type: string
 *               plansForNextWeek:
 *                 type: string
 *               blockers:
 *                 type: string
 *     responses:
 *       200:
 *         description: Report updated
 */
router.put('/:id', validate(updateReportSchema), reportController.updateDraft);

/**
 * @openapi
 * /api/reports/{id}/submit:
 *   post:
 *     summary: Submit a draft or resubmit a corrected report
 *     tags:
 *       - Reports
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Report submitted successfully
 */
router.post('/:id/submit', reportController.submitReport);

/**
 * @openapi
 * /api/reports/{id}:
 *   get:
 *     summary: Get report details by ID
 *     tags:
 *       - Reports
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Report details
 */
router.get('/:id', reportController.getById);

/**
 * @openapi
 * /api/reports/{id}/versions:
 *   get:
 *     summary: Get version history of a report
 *     tags:
 *       - Reports
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Report audit versions
 */
router.get('/:id/versions', reportController.getVersions);

/**
 * @openapi
 * /api/reports/{id}/reviews:
 *   get:
 *     summary: Get review history of a report
 *     tags:
 *       - Reports
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Report review history
 */
router.get('/:id/reviews', reportController.getReviews);

/**
 * @openapi
 * /api/reports:
 *   get:
 *     summary: List all team reports (Manager/Admin only)
 *     tags:
 *       - Reports
 *     responses:
 *       200:
 *         description: List of team reports
 */
router.get('/', requireManager, reportController.getAllReports);

/**
 * @openapi
 * /api/reports/{id}/approve:
 *   post:
 *     summary: Approve a submitted report (Manager/Admin)
 *     tags:
 *       - Reports
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Report approved
 */
router.post('/:id/approve', requireManager, reportController.approveReport);

/**
 * @openapi
 * /api/reports/{id}/request-correction:
 *   post:
 *     summary: Return report for correction with feedback (Manager/Admin)
 *     tags:
 *       - Reports
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - comments
 *             properties:
 *               comments:
 *                 type: string
 *     responses:
 *       200:
 *         description: Report returned for correction
 */
router.post('/:id/request-correction', requireManager, validate(requestChangesSchema), reportController.requestCorrection);

export const reportRoutes = router;
