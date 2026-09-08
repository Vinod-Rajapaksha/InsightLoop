import { Router } from 'express';
import { projectController } from './project.controller';
import { validate } from '../../middleware/validate';
import { createProjectSchema, updateProjectSchema } from '../../schemas/project.schema';
import { requireAuth, requireManager } from '../../middleware/auth';

const router = Router();

router.use(requireAuth);

/**
 * @openapi
 * /api/projects:
 *   get:
 *     summary: List all projects
 *     tags:
 *       - Projects
 *     responses:
 *       200:
 *         description: List of projects
 */
router.get('/', projectController.getAll);

/**
 * @openapi
 * /api/projects/{id}:
 *   get:
 *     summary: Get project by ID
 *     tags:
 *       - Projects
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Project details
 *       44:
 *         description: Project not found
 */
router.get('/:id', projectController.getById);

/**
 * @openapi
 * /api/projects:
 *   post:
 *     summary: Create a project (Manager/Admin)
 *     tags:
 *       - Projects
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *     responses:
 *       201:
 *         description: Project created
 */
router.post('/', requireManager, validate(createProjectSchema), projectController.create);

/**
 * @openapi
 * /api/projects/{id}:
 *   put:
 *     summary: Update project details (Manager/Admin)
 *     tags:
 *       - Projects
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
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               status:
 *                 type: string
 *                 enum: [ACTIVE, COMPLETED, ON_HOLD, ARCHIVED]
 *     responses:
 *       200:
 *         description: Project updated
 */
router.put('/:id', requireManager, validate(updateProjectSchema), projectController.update);

/**
 * @openapi
 * /api/projects/{id}:
 *   delete:
 *     summary: Delete project (Manager/Admin)
 *     tags:
 *       - Projects
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Project deleted
 */
router.delete('/:id', requireManager, projectController.delete);

export const projectRoutes = router;
