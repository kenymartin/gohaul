import { PrismaClient, Notification, NotificationType } from '@prisma/client';
import { NotFoundError, UnauthorizedError } from '../utils/errors';

const prisma = new PrismaClient();

export interface CreateNotificationDto {
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  jobId?: string;
}

export class NotificationService {
  async createNotification(data: CreateNotificationDto): Promise<Notification> {
    return prisma.notification.create({
      data,
      include: {
        job: {
          select: {
            id: true,
            title: true,
            status: true,
          },
        },
      },
    });
  }

  async getNotifications(userId: string, page: number = 1, limit: number = 20): Promise<{
    notifications: Notification[];
    total: number;
    unreadCount: number;
  }> {
    const skip = (page - 1) * limit;

    const [notifications, total, unreadCount] = await Promise.all([
      prisma.notification.findMany({
        where: { userId },
        include: {
          job: {
            select: {
              id: true,
              title: true,
              status: true,
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
        skip,
        take: limit,
      }),
      prisma.notification.count({
        where: { userId },
      }),
      prisma.notification.count({
        where: {
          userId,
          isRead: false,
        },
      }),
    ]);

    return {
      notifications,
      total,
      unreadCount,
    };
  }

  async markAsRead(notificationId: string, userId: string): Promise<Notification> {
    const notification = await prisma.notification.findUnique({
      where: { id: notificationId },
    });

    if (!notification) {
      throw new NotFoundError('Notification not found');
    }

    if (notification.userId !== userId) {
      throw new UnauthorizedError('You can only mark your own notifications as read');
    }

    return prisma.notification.update({
      where: { id: notificationId },
      data: { isRead: true },
    });
  }

  async markAllAsRead(userId: string): Promise<{ count: number }> {
    const result = await prisma.notification.updateMany({
      where: {
        userId,
        isRead: false,
      },
      data: {
        isRead: true,
      },
    });

    return { count: result.count };
  }

  async deleteNotification(notificationId: string, userId: string): Promise<void> {
    const notification = await prisma.notification.findUnique({
      where: { id: notificationId },
    });

    if (!notification) {
      throw new NotFoundError('Notification not found');
    }

    if (notification.userId !== userId) {
      throw new UnauthorizedError('You can only delete your own notifications');
    }

    await prisma.notification.delete({
      where: { id: notificationId },
    });
  }

  // Notification helpers for common scenarios
  async notifyJobPosted(jobId: string, transporterIds: string[]): Promise<void> {
    const job = await prisma.job.findUnique({
      where: { id: jobId },
      select: { title: true, type: true },
    });

    if (!job) return;

    const notifications = transporterIds.map(transporterId => ({
      userId: transporterId,
      type: NotificationType.NEW_JOB,
      title: 'New Job Available',
      message: `New ${job.type.toLowerCase()} job posted: ${job.title}`,
      jobId,
    }));

    await prisma.notification.createMany({
      data: notifications,
    });
  }

  async notifyBidReceived(jobId: string, bidAmount: number): Promise<void> {
    const job = await prisma.job.findUnique({
      where: { id: jobId },
      select: { posterId: true, title: true },
    });

    if (!job) return;

    await this.createNotification({
      userId: job.posterId,
      type: NotificationType.BID_RECEIVED,
      title: 'New Bid Received',
      message: `You received a bid of $${bidAmount} for "${job.title}"`,
      jobId,
    });
  }

  async notifyBidAccepted(transporterId: string, jobId: string): Promise<void> {
    const job = await prisma.job.findUnique({
      where: { id: jobId },
      select: { title: true },
    });

    if (!job) return;

    await this.createNotification({
      userId: transporterId,
      type: NotificationType.BID_ACCEPTED,
      title: 'Bid Accepted!',
      message: `Your bid for "${job.title}" has been accepted!`,
      jobId,
    });
  }

  async notifyBidRejected(transporterId: string, jobId: string): Promise<void> {
    const job = await prisma.job.findUnique({
      where: { id: jobId },
      select: { title: true },
    });

    if (!job) return;

    await this.createNotification({
      userId: transporterId,
      type: NotificationType.BID_REJECTED,
      title: 'Bid Rejected',
      message: `Your bid for "${job.title}" was not accepted`,
      jobId,
    });
  }

  async notifyJobCompleted(jobId: string): Promise<void> {
    const job = await prisma.job.findUnique({
      where: { id: jobId },
      select: { 
        posterId: true, 
        transporterId: true, 
        title: true 
      },
    });

    if (!job || !job.transporterId) return;

    // Notify both poster and transporter
    await Promise.all([
      this.createNotification({
        userId: job.posterId,
        type: NotificationType.JOB_COMPLETED,
        title: 'Job Completed',
        message: `Your job "${job.title}" has been completed`,
        jobId,
      }),
      this.createNotification({
        userId: job.transporterId,
        type: NotificationType.JOB_COMPLETED,
        title: 'Job Completed',
        message: `You have completed the job "${job.title}"`,
        jobId,
      }),
    ]);
  }
} 