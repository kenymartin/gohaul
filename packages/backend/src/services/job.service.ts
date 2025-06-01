import { PrismaClient, Job, JobType, JobStatus, UserRole } from '@prisma/client';
import { NotFoundError, UnauthorizedError, BadRequestError } from '../utils/errors';
import { NotificationService } from './notification.service';

const prisma = new PrismaClient();

export interface CreateJobDto {
  title: string;
  description: string;
  type: JobType;
  pickupLocation: string;
  pickupLatitude?: number;
  pickupLongitude?: number;
  pickupDateTime?: Date;
  pickupInstructions?: string;
  deliveryLocation: string;
  deliveryLatitude?: number;
  deliveryLongitude?: number;
  deliveryDateTime?: Date;
  deliveryInstructions?: string;
  itemType: string;
  weight?: number;
  dimensions?: string;
  isFragile?: boolean;
  isOversized?: boolean;
  specialRequirements?: string;
  fixedPrice?: number;
  startingBid?: number;
  maxBudget?: number;
  biddingEndsAt?: Date;
  expiresAt?: Date;
  images?: string[];
}

export interface UpdateJobDto {
  title?: string;
  description?: string;
  status?: JobStatus;
  pickupDateTime?: Date;
  deliveryDateTime?: Date;
  fixedPrice?: number;
  maxBudget?: number;
  biddingEndsAt?: Date;
}

export class JobService {
  private notificationService = new NotificationService();

  async createJob(posterId: string, data: CreateJobDto): Promise<Job> {
    try {
      // Validate job type and pricing
      if (data.type === JobType.STANDARD && !data.fixedPrice) {
        throw new BadRequestError('Fixed price is required for standard jobs');
      }
      
      if (data.type === JobType.AUCTION && !data.startingBid) {
        throw new BadRequestError('Starting bid is required for auction jobs');
      }

      // Set default bidding end time for auctions (24 hours from now)
      if (data.type === JobType.AUCTION && !data.biddingEndsAt) {
        data.biddingEndsAt = new Date(Date.now() + 24 * 60 * 60 * 1000);
      }

      const job = await prisma.job.create({
        data: {
          ...data,
          posterId,
          status: data.type === JobType.AUCTION ? JobStatus.OPEN_FOR_BIDS : JobStatus.PENDING,
        },
        include: {
          poster: {
            select: {
              id: true,
              name: true,
              email: true,
              role: true,
              companyName: true,
            },
          },
        },
      });

      // Notify all transporters about the new job
      await this.notifyTransportersAboutNewJob(job);

      return job;
    } catch (error) {
      throw error;
    }
  }

  async getJobById(id: string, userId?: string): Promise<Job | null> {
    const job = await prisma.job.findUnique({
      where: { id },
      include: {
        poster: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
            companyName: true,
            rating: true,
            totalRatings: true,
          },
        },
        transporter: {
          select: {
            id: true,
            name: true,
            email: true,
            rating: true,
            totalRatings: true,
          },
        },
        vehicle: true,
        bids: {
          include: {
            transporter: {
              select: {
                id: true,
                name: true,
                email: true,
                rating: true,
                totalRatings: true,
              },
            },
          },
          orderBy: {
            amount: 'asc',
          },
        },
        reviews: {
          include: {
            author: {
              select: {
                id: true,
                name: true,
                role: true,
              },
            },
          },
        },
      },
    });

    return job;
  }

  async getAvailableJobs(userId: string): Promise<Job[]> {
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (user?.role !== UserRole.TRANSPORTER) {
      throw new UnauthorizedError('Only transporters can view available jobs');
    }

    return prisma.job.findMany({
      where: {
        OR: [
          { status: JobStatus.PENDING },
          { status: JobStatus.OPEN_FOR_BIDS, biddingEndsAt: { gt: new Date() } },
        ],
        posterId: { not: userId }, // Don't show own jobs
      },
      include: {
        poster: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
            companyName: true,
            rating: true,
            totalRatings: true,
          },
        },
        bids: {
          where: { transporterId: userId },
        },
        _count: {
          select: {
            bids: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async getMyJobs(userId: string): Promise<Job[]> {
    return prisma.job.findMany({
      where: {
        OR: [
          { posterId: userId },
          { transporterId: userId },
        ],
      },
      include: {
        poster: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
            companyName: true,
          },
        },
        transporter: {
          select: {
            id: true,
            name: true,
            email: true,
            rating: true,
            totalRatings: true,
          },
        },
        vehicle: true,
        _count: {
          select: {
            bids: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async updateJob(id: string, userId: string, data: UpdateJobDto): Promise<Job> {
    const job = await this.getJobById(id);
    
    if (!job) {
      throw new NotFoundError('Job not found');
    }

    if (job.posterId !== userId) {
      throw new UnauthorizedError('You can only update your own jobs');
    }

    // Validate status transitions
    if (data.status) {
      await this.validateStatusTransition(job, data.status, userId);
    }

    return prisma.job.update({
      where: { id },
      data,
      include: {
        poster: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
            companyName: true,
          },
        },
        transporter: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        vehicle: true,
      },
    });
  }

  async assignJob(jobId: string, transporterId: string, vehicleId?: string): Promise<Job> {
    const job = await this.getJobById(jobId);
    
    if (!job) {
      throw new NotFoundError('Job not found');
    }

    if (job.status !== JobStatus.PENDING && job.status !== JobStatus.BID_ACCEPTED) {
      throw new BadRequestError('Job cannot be assigned in current status');
    }

    const updatedJob = await prisma.job.update({
      where: { id: jobId },
      data: {
        transporterId,
        vehicleId,
        status: JobStatus.ASSIGNED,
      },
      include: {
        poster: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
            companyName: true,
          },
        },
        transporter: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        vehicle: true,
      },
    });

    // Notify both parties
    await this.notificationService.createNotification({
      userId: job.posterId,
      type: 'JOB_ASSIGNED',
      title: 'Job Assigned',
      message: `Your job "${job.title}" has been assigned to a transporter`,
      jobId: jobId,
    });

    await this.notificationService.createNotification({
      userId: transporterId,
      type: 'JOB_ASSIGNED',
      title: 'Job Assigned to You',
      message: `You have been assigned to job "${job.title}"`,
      jobId: jobId,
    });

    return updatedJob;
  }

  async deleteJob(id: string, userId: string): Promise<void> {
    const job = await this.getJobById(id);
    
    if (!job) {
      throw new NotFoundError('Job not found');
    }

    if (job.posterId !== userId) {
      throw new UnauthorizedError('You can only delete your own jobs');
    }

    if (job.status === JobStatus.ASSIGNED || job.status === JobStatus.IN_TRANSIT) {
      throw new BadRequestError('Cannot delete job that is already assigned or in transit');
    }

    await prisma.job.delete({
      where: { id },
    });
  }

  private async notifyTransportersAboutNewJob(job: any): Promise<void> {
    // Get all active transporters
    const transporters = await prisma.user.findMany({
      where: {
        role: UserRole.TRANSPORTER,
        isVerified: true,
      },
      select: {
        id: true,
      },
    });

    // Create notifications for all transporters
    const notifications = transporters.map(transporter => ({
      userId: transporter.id,
      type: 'NEW_JOB' as const,
      title: 'New Job Available',
      message: `New ${job.type.toLowerCase()} job: ${job.title}`,
      jobId: job.id,
    }));

    if (notifications.length > 0) {
      await prisma.notification.createMany({
        data: notifications,
      });
    }
  }

  private async validateStatusTransition(job: Job, newStatus: JobStatus, userId: string): Promise<void> {
    const validTransitions: Record<JobStatus, JobStatus[]> = {
      [JobStatus.PENDING]: [JobStatus.ASSIGNED, JobStatus.CANCELLED],
      [JobStatus.OPEN_FOR_BIDS]: [JobStatus.BID_ACCEPTED, JobStatus.CANCELLED],
      [JobStatus.BID_ACCEPTED]: [JobStatus.ASSIGNED, JobStatus.CANCELLED],
      [JobStatus.ASSIGNED]: [JobStatus.IN_TRANSIT, JobStatus.CANCELLED],
      [JobStatus.IN_TRANSIT]: [JobStatus.DELIVERED, JobStatus.CANCELLED],
      [JobStatus.DELIVERED]: [],
      [JobStatus.CANCELLED]: [],
    };

    if (!validTransitions[job.status].includes(newStatus)) {
      throw new BadRequestError(`Cannot transition from ${job.status} to ${newStatus}`);
    }
  }
} 