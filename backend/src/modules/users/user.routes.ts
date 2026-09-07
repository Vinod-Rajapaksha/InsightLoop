import { Router } from 'express';
import { userController } from './user.controller';
import { requireAuth } from '../../middleware/auth';

const router = Router();

/**
 * @swagger
 * /api/users/profile:
 *   put:
 *     summary: Update user profile
 *     tags: [Users]
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               firstName:
 *                 type: string
 *               lastName:
 *                 type: string
 *               password:
 *                 type: string
 *                 description: Optional new password
 *     responses:
 *       200:
 *         description: Profile updated successfully
 */
router.put('/profile', requireAuth, userController.updateProfile.bind(userController));

export const userRoutes = router;
