import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import { aiController } from './ai.controller';
import { requireAuth, requireManager } from '../../middleware/auth';
import { validate } from '../../middleware/validate';
import { env } from '../../config/env';
import {
  AskRequestSchema,
  DateRangeSchema,
  ProjectInsightsSchema,
  CompareWeeksSchema,
} from './ai.types';

const router = Router();

const aiRateLimiter = rateLimit({
  windowMs: env.AI_RATE_LIMIT_WINDOW_MS,
  max: env.AI_RATE_LIMIT_MAX,
  message: { success: false, message: 'Too many AI requests. Please try again later.' },
  standardHeaders: true,
  legacyHeaders: false,
});

// All AI routes require authentication and manager/admin privileges.
router.use(requireAuth, requireManager, aiRateLimiter);

router.post('/ask', validate(AskRequestSchema), aiController.ask);
router.post('/weekly-summary', validate(DateRangeSchema), aiController.weeklySummary);
router.post('/project-insights', validate(ProjectInsightsSchema), aiController.projectInsights);
router.post('/risk-analysis', validate(DateRangeSchema), aiController.riskAnalysis);
router.post('/compare-weeks', validate(CompareWeeksSchema), aiController.compareWeeks);
router.get('/status', aiController.getStatus);

export default router;
