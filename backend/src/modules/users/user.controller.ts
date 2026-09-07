import { Response, NextFunction } from 'express';
import { userService } from './user.service';
import { successResponse } from '../../utils/response';
import { AuthenticatedRequest } from '../../middleware/auth';

export class UserController {
  async updateProfile(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        throw new Error('User not authenticated');
      }
      
      const user = await userService.updateProfile(req.user._id, req.body);
      res.status(200).json(successResponse('Profile updated successfully', { user }));
    } catch (error) {
      next(error);
    }
  }
}

export const userController = new UserController();
