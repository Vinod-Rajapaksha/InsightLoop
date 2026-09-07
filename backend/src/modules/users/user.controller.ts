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

  async getAllUsers(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const users = await userService.getAllUsers();
      res.status(200).json(successResponse('Users retrieved successfully', users));
    } catch (error) {
      next(error);
    }
  }

  async updateRole(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const { role } = req.body;
      const user = await userService.updateRole(req.params.userId as string, role);
      res.status(200).json(successResponse('User role updated successfully', user));
    } catch (error) {
      next(error);
    }
  }

  async updateStatus(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const { isActive } = req.body;
      const user = await userService.updateStatus(req.params.userId as string, isActive);
      res.status(200).json(successResponse('User status updated successfully', user));
    } catch (error) {
      next(error);
    }
  }
}

export const userController = new UserController();
