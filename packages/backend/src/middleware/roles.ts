import { Response, NextFunction, RequestHandler } from 'express';
import { UserRole } from '@prisma/client';
import { AppError } from '../utils/error';
import { AuthRequest } from '../utils/auth';

export const validateRole = (allowedRoles: UserRole[]): RequestHandler => {
  return (req, res: Response, next: NextFunction) => {
    const authReq = req as AuthRequest;
    if (!authReq.user) {
      throw new AppError('User not authenticated', 401);
    }

    if (!allowedRoles.includes(authReq.user.role)) {
      throw new AppError('User not authorized for this action', 403);
    }

    next();
  };
}; 