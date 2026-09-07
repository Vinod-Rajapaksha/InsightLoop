import { Request, Response, NextFunction } from 'express';
import { authService } from './auth.service';
import { successResponse } from '../../utils/response';
import { env } from '../../config/env';
import { AuthenticatedRequest } from '../../middleware/auth';

export class AuthController {
  async register(req: Request, res: Response, next: NextFunction) {
    try {
      const user = await authService.register(req.body);
      res.status(201).json(successResponse('User registered successfully', { user }));
    } catch (error) {
      next(error);
    }
  }

  async login(req: Request, res: Response, next: NextFunction) {
    try {
      const { user, token } = await authService.login(req.body);

      // Set cookie
      res.cookie(env.COOKIE_NAME, token, {
        httpOnly: true,
        secure: env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      });

      res.status(200).json(successResponse('Login successful', { user, token }));
    } catch (error) {
      next(error);
    }
  }

  async logout(req: Request, res: Response, next: NextFunction) {
    try {
      res.clearCookie(env.COOKIE_NAME);
      res.status(200).json(successResponse('Logout successful'));
    } catch (error) {
      next(error);
    }
  }

  async me(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      res.status(200).json(successResponse('Current user retrieved', { user: req.user }));
    } catch (error) {
      next(error);
    }
  }
}

export const authController = new AuthController();
