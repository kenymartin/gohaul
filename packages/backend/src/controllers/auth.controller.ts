import { Request, Response, NextFunction } from 'express';
import { AuthService } from '../services/auth.service';
import { RegisterInput, LoginInput } from '../validations/auth.validation';

const authService = new AuthService();

export class AuthController {
  async register(req: Request, res: Response, next: NextFunction) {
    try {
      const data = req.body as RegisterInput;
      const result = await authService.register(data);
      
      res.status(201).json({
        status: 'success',
        data: {
          user: {
            id: result.user.id,
            email: result.user.email,
            name: result.user.name,
            role: result.user.role,
          },
          token: result.token,
        },
      });
    } catch (error) {
      next(error);
    }
  }

  async login(req: Request, res: Response, next: NextFunction) {
    try {
      const data = req.body as LoginInput;
      const result = await authService.login(data);
      
      res.status(200).json({
        status: 'success',
        data: {
          user: {
            id: result.user.id,
            email: result.user.email,
            name: result.user.name,
            role: result.user.role,
          },
          token: result.token,
        },
      });
    } catch (error) {
      next(error);
    }
  }

  async getCurrentUser(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        return res.status(401).json({
          status: 'error',
          message: 'User not authenticated',
        });
      }

      const user = await authService.getCurrentUser(req.user.userId);
      
      res.status(200).json({
        status: 'success',
        data: {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
        },
      });
    } catch (error) {
      next(error);
    }
  }
} 