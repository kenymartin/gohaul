import { PrismaClient } from '@prisma/client';
import type { Prisma } from '@prisma/client';
import { CreateBidDTO, UpdateBidDTO, BidWithDetails } from '../types/bid.types';
import { AppError } from '../utils/error';

const prisma = new PrismaClient();

export class BidService {
  async createBid(transporterId: string, data: CreateBidDTO): Promise<BidWithDetails> {
    const shipment = await prisma.shipment.findUnique({
      where: { id: data.shipmentId }
    });

    if (!shipment) {
      throw new AppError('Shipment not found', 404);
    }

    if (shipment.status !== 'AWAITING_BIDS') {
      throw new AppError('Shipment is not accepting bids', 400);
    }

    const existingBid = await prisma.bid.findFirst({
      where: {
        shipmentId: data.shipmentId,
        transporterId: transporterId
      }
    });

    if (existingBid) {
      throw new AppError('You have already placed a bid for this shipment', 400);
    }

    return prisma.bid.create({
      data: {
        ...data,
        transporterId
      },
      include: {
        shipment: true,
        transporter: true
      }
    });
  }

  async getBidById(bidId: string): Promise<BidWithDetails | null> {
    return prisma.bid.findUnique({
      where: { id: bidId },
      include: {
        shipment: true,
        transporter: true
      }
    });
  }

  async getBidsForShipment(shipmentId: string): Promise<BidWithDetails[]> {
    return prisma.bid.findMany({
      where: { shipmentId },
      include: {
        shipment: true,
        transporter: true
      },
      orderBy: {
        price: 'asc'
      }
    });
  }

  async getBidsByTransporter(transporterId: string): Promise<BidWithDetails[]> {
    return prisma.bid.findMany({
      where: { transporterId },
      include: {
        shipment: true,
        transporter: true
      }
    });
  }

  async updateBid(bidId: string, transporterId: string, data: UpdateBidDTO): Promise<BidWithDetails> {
    const bid = await prisma.bid.findUnique({
      where: { id: bidId },
      include: { shipment: true }
    });

    if (!bid) {
      throw new AppError('Bid not found', 404);
    }

    if (bid.transporterId !== transporterId) {
      throw new AppError('Unauthorized to update this bid', 403);
    }

    if (bid.status !== 'PENDING') {
      throw new AppError('Cannot update bid that is not pending', 400);
    }

    return prisma.bid.update({
      where: { id: bidId },
      data,
      include: {
        shipment: true,
        transporter: true
      }
    });
  }

  async acceptBid(bidId: string, customerId: string): Promise<BidWithDetails> {
    const bid = await prisma.bid.findUnique({
      where: { id: bidId },
      include: { shipment: true }
    });

    if (!bid) {
      throw new AppError('Bid not found', 404);
    }

    if (bid.shipment.customerId !== customerId) {
      throw new AppError('Unauthorized to accept this bid', 403);
    }

    if (bid.status !== 'PENDING') {
      throw new AppError('Can only accept pending bids', 400);
    }

    // Start a transaction to update both bid and shipment
    return prisma.$transaction(async (tx: Prisma.TransactionClient) => {
      // Update the accepted bid
      const updatedBid = await tx.bid.update({
        where: { id: bidId },
        data: { status: 'ACCEPTED' },
        include: {
          shipment: true,
          transporter: true
        }
      });

      // Reject all other bids for this shipment
      await tx.bid.updateMany({
        where: {
          shipmentId: bid.shipmentId,
          id: { not: bidId },
          status: 'PENDING'
        },
        data: { status: 'REJECTED' }
      });

      // Update shipment status and assign transporter
      await tx.shipment.update({
        where: { id: bid.shipmentId },
        data: {
          status: 'BID_ACCEPTED',
          transporterId: bid.transporterId
        }
      });

      return updatedBid;
    });
  }

  async deleteBid(bidId: string, transporterId: string): Promise<void> {
    const bid = await prisma.bid.findUnique({
      where: { id: bidId }
    });

    if (!bid) {
      throw new AppError('Bid not found', 404);
    }

    if (bid.transporterId !== transporterId) {
      throw new AppError('Unauthorized to delete this bid', 403);
    }

    if (bid.status !== 'PENDING') {
      throw new AppError('Cannot delete bid that is not pending', 400);
    }

    await prisma.bid.delete({
      where: { id: bidId }
    });
  }
} 