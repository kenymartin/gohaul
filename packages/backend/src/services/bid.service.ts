import { PrismaClient, Bid, BidStatus, JobStatus, JobType, UserRole } from '@prisma/client';
import { NotFoundError, UnauthorizedError, BadRequestError } from '../utils/errors';
import { NotificationService } from './notification.service';

const prisma = new PrismaClient();

export interface CreateBidDto {
  jobId: string;
  amount: number;
  message?: string;
  estimatedDelivery?: Date;
}

export interface UpdateBidDto {
  amount?: number;
  message?: string;
  estimatedDelivery?: Date;
}

export class BidService {
  private notificationService = new NotificationService();

  async createBid(transporterId: string, data: CreateBidDto): Promise<Bid> {
    // Verify user is a transporter
    const user = await prisma.user.findUnique({
      where: { id: transporterId },
    });

    if (!user || user.role !== UserRole.TRANSPORTER) {
      throw new UnauthorizedError('Only transporters can place bids');
    }

    // Get job details
    const job = await prisma.job.findUnique({
      where: { id: data.jobId },
      include: {
        poster: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    if (!job) {
      throw new NotFoundError('Job not found');
    }

    // Validate job can receive bids
    if (job.posterId === transporterId) {
      throw new BadRequestError('You cannot bid on your own job');
    }

    if (job.status !== JobStatus.OPEN_FOR_BIDS && job.status !== JobStatus.PENDING) {
      throw new BadRequestError('Job is not accepting bids');
    }

    // For auction jobs, check if bidding period is still active
    if (job.type === JobType.AUCTION && job.biddingEndsAt && job.biddingEndsAt < new Date()) {
      throw new BadRequestError('Bidding period has ended');
    }

    // For auction jobs, validate bid amount
    if (job.type === JobType.AUCTION && job.startingBid && data.amount < job.startingBid) {
      throw new BadRequestError(`Bid amount must be at least $${job.startingBid}`);
    }

    // Check if user already has a bid for this job
    const existingBid = await prisma.bid.findUnique({
      where: {
        jobId_transporterId: {
          jobId: data.jobId,
          transporterId,
        },
      },
    });

    if (existingBid) {
      throw new BadRequestError('You already have a bid for this job. Update your existing bid instead.');
    }

    // Create the bid
    const bid = await prisma.bid.create({
      data: {
        ...data,
        transporterId,
      },
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
        job: {
          select: {
            id: true,
            title: true,
            type: true,
            posterId: true,
          },
        },
      },
    });

    // Update job status if it was PENDING
    if (job.status === JobStatus.PENDING && job.type === JobType.AUCTION) {
      await prisma.job.update({
        where: { id: data.jobId },
        data: { status: JobStatus.OPEN_FOR_BIDS },
      });
    }

    // Notify job poster about new bid
    await this.notificationService.notifyBidReceived(data.jobId, data.amount);

    return bid;
  }

  async updateBid(bidId: string, transporterId: string, data: UpdateBidDto): Promise<Bid> {
    const bid = await prisma.bid.findUnique({
      where: { id: bidId },
      include: {
        job: true,
      },
    });

    if (!bid) {
      throw new NotFoundError('Bid not found');
    }

    if (bid.transporterId !== transporterId) {
      throw new UnauthorizedError('You can only update your own bids');
    }

    if (bid.status !== BidStatus.PENDING) {
      throw new BadRequestError('Cannot update bid that is not pending');
    }

    // Check if job bidding is still active
    if (bid.job.type === JobType.AUCTION && bid.job.biddingEndsAt && bid.job.biddingEndsAt < new Date()) {
      throw new BadRequestError('Bidding period has ended');
    }

    // Validate new bid amount
    if (data.amount && bid.job.type === JobType.AUCTION && bid.job.startingBid && data.amount < bid.job.startingBid) {
      throw new BadRequestError(`Bid amount must be at least $${bid.job.startingBid}`);
    }

    return prisma.bid.update({
      where: { id: bidId },
      data,
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
        job: {
          select: {
            id: true,
            title: true,
            type: true,
          },
        },
      },
    });
  }

  async acceptBid(bidId: string, posterId: string): Promise<Bid> {
    const bid = await prisma.bid.findUnique({
      where: { id: bidId },
      include: {
        job: true,
        transporter: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    if (!bid) {
      throw new NotFoundError('Bid not found');
    }

    if (bid.job.posterId !== posterId) {
      throw new UnauthorizedError('You can only accept bids on your own jobs');
    }

    if (bid.status !== BidStatus.PENDING) {
      throw new BadRequestError('Bid is not pending');
    }

    if (bid.job.status !== JobStatus.OPEN_FOR_BIDS && bid.job.status !== JobStatus.PENDING) {
      throw new BadRequestError('Job is not accepting bids');
    }

    // Start transaction to accept bid and reject others
    const result = await prisma.$transaction(async (tx) => {
      // Accept the selected bid
      const acceptedBid = await tx.bid.update({
        where: { id: bidId },
        data: { status: BidStatus.ACCEPTED },
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
          job: {
            select: {
              id: true,
              title: true,
              type: true,
            },
          },
        },
      });

      // Reject all other pending bids for this job
      await tx.bid.updateMany({
        where: {
          jobId: bid.jobId,
          id: { not: bidId },
          status: BidStatus.PENDING,
        },
        data: { status: BidStatus.REJECTED },
      });

      // Update job status
      await tx.job.update({
        where: { id: bid.jobId },
        data: { status: JobStatus.BID_ACCEPTED },
      });

      return acceptedBid;
    });

    // Send notifications
    await Promise.all([
      // Notify winning transporter
      this.notificationService.notifyBidAccepted(bid.transporterId, bid.jobId),
      // Notify rejected transporters
      this.notifyRejectedBidders(bid.jobId, bidId),
    ]);

    return result;
  }

  async rejectBid(bidId: string, posterId: string): Promise<Bid> {
    const bid = await prisma.bid.findUnique({
      where: { id: bidId },
      include: {
        job: true,
      },
    });

    if (!bid) {
      throw new NotFoundError('Bid not found');
    }

    if (bid.job.posterId !== posterId) {
      throw new UnauthorizedError('You can only reject bids on your own jobs');
    }

    if (bid.status !== BidStatus.PENDING) {
      throw new BadRequestError('Bid is not pending');
    }

    const rejectedBid = await prisma.bid.update({
      where: { id: bidId },
      data: { status: BidStatus.REJECTED },
      include: {
        transporter: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        job: {
          select: {
            id: true,
            title: true,
            type: true,
          },
        },
      },
    });

    // Notify transporter about rejection
    await this.notificationService.notifyBidRejected(bid.transporterId, bid.jobId);

    return rejectedBid;
  }

  async withdrawBid(bidId: string, transporterId: string): Promise<void> {
    const bid = await prisma.bid.findUnique({
      where: { id: bidId },
      include: {
        job: true,
      },
    });

    if (!bid) {
      throw new NotFoundError('Bid not found');
    }

    if (bid.transporterId !== transporterId) {
      throw new UnauthorizedError('You can only withdraw your own bids');
    }

    if (bid.status !== BidStatus.PENDING) {
      throw new BadRequestError('Can only withdraw pending bids');
    }

    // Check if job bidding is still active
    if (bid.job.type === JobType.AUCTION && bid.job.biddingEndsAt && bid.job.biddingEndsAt < new Date()) {
      throw new BadRequestError('Cannot withdraw bid after bidding period has ended');
    }

    await prisma.bid.update({
      where: { id: bidId },
      data: { status: BidStatus.WITHDRAWN },
    });
  }

  async getBidsForJob(jobId: string, userId: string): Promise<Bid[]> {
    const job = await prisma.job.findUnique({
      where: { id: jobId },
    });

    if (!job) {
      throw new NotFoundError('Job not found');
    }

    // Only job poster can see all bids
    if (job.posterId !== userId) {
      throw new UnauthorizedError('You can only view bids on your own jobs');
    }

    return prisma.bid.findMany({
      where: { jobId },
      include: {
        transporter: {
          select: {
            id: true,
            name: true,
            email: true,
            rating: true,
            totalRatings: true,
            vehicles: {
              where: { isActive: true },
              select: {
                id: true,
                type: true,
                make: true,
                model: true,
                capacity: true,
              },
            },
          },
        },
      },
      orderBy: [
        { status: 'asc' }, // Show accepted/pending first
        { amount: 'asc' }, // Then by price
      ],
    });
  }

  async getMyBids(transporterId: string): Promise<Bid[]> {
    return prisma.bid.findMany({
      where: { transporterId },
      include: {
        job: {
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
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async getBidById(bidId: string): Promise<Bid | null> {
    return prisma.bid.findUnique({
      where: { id: bidId },
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
        job: {
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
        },
      },
    });
  }

  private async notifyRejectedBidders(jobId: string, acceptedBidId: string): Promise<void> {
    const rejectedBids = await prisma.bid.findMany({
      where: {
        jobId,
        id: { not: acceptedBidId },
        status: BidStatus.REJECTED,
      },
      select: {
        transporterId: true,
      },
    });

    const notifications = rejectedBids.map(bid =>
      this.notificationService.notifyBidRejected(bid.transporterId, jobId)
    );

    await Promise.all(notifications);
  }

  async getBidStatistics(transporterId: string): Promise<{
    totalBids: number;
    pendingBids: number;
    acceptedBids: number;
    rejectedBids: number;
    averageBidAmount: number;
    winRate: number;
  }> {
    const bids = await prisma.bid.findMany({
      where: { transporterId },
      select: {
        status: true,
        amount: true,
      },
    });

    const totalBids = bids.length;
    const pendingBids = bids.filter(bid => bid.status === BidStatus.PENDING).length;
    const acceptedBids = bids.filter(bid => bid.status === BidStatus.ACCEPTED).length;
    const rejectedBids = bids.filter(bid => bid.status === BidStatus.REJECTED).length;
    
    const averageBidAmount = totalBids > 0 
      ? bids.reduce((sum, bid) => sum + bid.amount, 0) / totalBids 
      : 0;
    
    const winRate = totalBids > 0 ? (acceptedBids / totalBids) * 100 : 0;

    return {
      totalBids,
      pendingBids,
      acceptedBids,
      rejectedBids,
      averageBidAmount,
      winRate,
    };
  }
} 