import { Request, Response, NextFunction } from 'express';
import { NotificationService } from '../services/notification.service';

const notificationService = new NotificationService();

export class NotificationController {
  async getNotifications(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        return res.status(401).json({
          status: 'error',
          message: 'User not authenticated',
        });
      }

      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 20;

      const result = await notificationService.getNotifications(req.user.userId, page, limit);

      res.status(200).json({
        status: 'success',
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  async markAsRead(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        return res.status(401).json({
          status: 'error',
          message: 'User not authenticated',
        });
      }

      const { id } = req.params;
      const notification = await notificationService.markAsRead(id, req.user.userId);

      res.status(200).json({
        status: 'success',
        data: notification,
      });
    } catch (error) {
      next(error);
    }
  }

  async markAllAsRead(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        return res.status(401).json({
          status: 'error',
          message: 'User not authenticated',
        });
      }

      const result = await notificationService.markAllAsRead(req.user.userId);

      res.status(200).json({
        status: 'success',
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  async deleteNotification(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        return res.status(401).json({
          status: 'error',
          message: 'User not authenticated',
        });
      }

      const { id } = req.params;
      await notificationService.deleteNotification(id, req.user.userId);

      res.status(200).json({
        status: 'success',
        message: 'Notification deleted successfully',
      });
    } catch (error) {
      next(error);
    }
  }
} 