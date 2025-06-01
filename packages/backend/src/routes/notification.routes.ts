import { Router } from 'express';
import { NotificationController } from '../controllers/notification.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();
const notificationController = new NotificationController();

// All notification routes require authentication
router.use(authenticate);

router.get(
  '/',
  notificationController.getNotifications.bind(notificationController)
);

router.patch(
  '/:id/read',
  notificationController.markAsRead.bind(notificationController)
);

router.patch(
  '/read-all',
  notificationController.markAllAsRead.bind(notificationController)
);

router.delete(
  '/:id',
  notificationController.deleteNotification.bind(notificationController)
);

export default router; 