import { Router } from 'express';
import { authController } from './auth.controller';
import { validate } from '../../middleware/validate';
import { registerSchema, loginSchema } from '../../schemas/user.schema';
import { requireAuth } from '../../middleware/auth';

const router = Router();

/**
 * @openapi
 * /api/auth/register:
 *   post:
 *     summary: Register a new user
 *     tags:
 *       - Auth
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - firstName
 *               - lastName
 *               - email
 *               - password
 *             properties:
 *               firstName:
 *                 type: string
 *               lastName:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               role:
 *                 type: string
 *                 enum: [TEAM_MEMBER, MANAGER, ADMIN]
 *     responses:
 *       201:
 *         description: User registered successfully
 *       400:
 *         description: Bad request / Validation error
 */
router.post('/register', validate(registerSchema), authController.register);

/**
 * @openapi
 * /api/auth/login:
 *   post:
 *     summary: Login user and receive HTTP-only cookie token
 *     tags:
 *       - Auth
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login successful
 *       401:
 *         description: Invalid credentials
 */
router.post('/login', validate(loginSchema), authController.login);

/**
 * @openapi
 * /api/auth/logout:
 *   post:
 *     summary: Logout user and clear auth cookie
 *     tags:
 *       - Auth
 *     responses:
 *       200:
 *         description: Logout successful
 */
router.post('/logout', authController.logout);

/**
 * @openapi
 * /api/auth/me:
 *   get:
 *     summary: Get current authenticated user profile
 *     tags:
 *       - Auth
 *     responses:
 *       200:
 *         description: Current user profile
 *       401:
 *         description: Unauthorized
 */
router.get('/me', requireAuth, authController.me);

export const authRoutes = router;
