import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { env } from '../config/env';
import { User, IUser, Role } from '../models/User';
import { AppError } from './error';

export interface AuthenticatedRequest extends Request {
  user?: IUser;
}

export const requireAuth = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    let token;

    if (req.cookies && req.cookies[env.COOKIE_NAME]) {
      token = req.cookies[env.COOKIE_NAME];
    } else if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      // Fallback for Swagger / dev tools if needed
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return next(new AppError('Not authorized to access this route', 401));
    }

    const decoded = jwt.verify(token, env.JWT_SECRET) as { id: string; role: Role };

    const user = await User.findById(decoded.id);

    if (!user) {
      return next(new AppError('User not found', 401));
    }

    if (!user.isActive) {
      return next(new AppError('User account is deactivated', 403));
    }

    req.user = user;
    next();
  } catch (error) {
    return next(new AppError('Not authorized to access this route', 401));
  }
};

export const requireRole = (...roles: Role[]) => {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return next(new AppError('Not authorized', 401));
    }

    if (!roles.includes(req.user.role)) {
      return next(new AppError('Forbidden: Insufficient permissions', 403));
    }

    next();
  };
};

export const requireManager = requireRole(Role.MANAGER, Role.ADMIN);
export const requireAdmin = requireRole(Role.ADMIN);
