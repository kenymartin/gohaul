import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { CreateBidDto, ShipmentStatus, UserRole } from '@gohaul/shared';
import { authenticate, authorize, AuthRequest } from '../utils/auth';
import { sendBidPlacedEmail, sendBidAcceptedEmail } from '../services/email.service';
import { z } from 'zod';

const router = Router();
const prisma = new PrismaClient();

const createBidSchema = z.object({
  shipmentId: z.string().uuid(),
  price: z.number().positive(),
  eta: z.string().transform((str) => new Date(str)),
});

// Create bid
router.post(
  '/',
  authenticate,
  authorize([UserRole.TRANSPORTER]),
  async (req: AuthRequest, res) => {
    try {
      const data = createBidSchema.parse(req.body) as CreateBidDto;
      const transporterId = req.user!.userId;

      const shipment = await prisma.shipment.findUnique({
        where: { id: data.shipmentId },
        include: { customer: true },
      });

      if (!shipment) {
        return res.status(404).json({
          success: false,
          error: 'Shipment not found',
        });
      }

      if (shipment.status !== ShipmentStatus.AWAITING_BIDS) {
        return res.status(400).json({
          success: false,
          error: 'Shipment is not accepting bids',
        });
      }

      const bid = await prisma.bid.create({
        data: {
          ...data,
          transporterId,
        },
        include: {
          transporter: true,
        },
      });

      // Send email notification
      await sendBidPlacedEmail(bid, shipment, shipment.customer);

      res.status(201).json({
        success: true,
        data: bid,
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({
          success: false,
          error: error.errors,
        });
      }
      res.status(500).json({
        success: false,
        error: 'Internal server error',
      });
    }
  }
);

// Accept bid
router.post(
  '/:id/accept',
  authenticate,
  authorize([UserRole.CUSTOMER]),
  async (req: AuthRequest, res) => {
    try {
      const { id } = req.params;

      const bid = await prisma.bid.findUnique({
        where: { id },
        include: {
          shipment: true,
          transporter: true,
        },
      });

      if (!bid) {
        return res.status(404).json({
          success: false,
          error: 'Bid not found',
        });
      }

      if (bid.shipment.customerId !== req.user!.userId) {
        return res.status(403).json({
          success: false,
          error: 'Not authorized to accept this bid',
        });
      }

      // Update bid status
      const updatedBid = await prisma.bid.update({
        where: { id },
        data: { status: 'ACCEPTED' },
      });

      // Update shipment status and assign transporter
      await prisma.shipment.update({
        where: { id: bid.shipmentId },
        data: {
          status: ShipmentStatus.BID_ACCEPTED,
          transporterId: bid.transporterId,
        },
      });

      // Reject other bids
      await prisma.bid.updateMany({
        where: {
          shipmentId: bid.shipmentId,
          id: { not: id },
        },
        data: { status: 'REJECTED' },
      });

      // Send email notification
      await sendBidAcceptedEmail(bid, bid.shipment, bid.transporter);

      res.json({
        success: true,
        data: updatedBid,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: 'Internal server error',
      });
    }
  }
);

// Get bids for a shipment
router.get('/shipment/:shipmentId', authenticate, async (req: AuthRequest, res) => {
  try {
    const { shipmentId } = req.params;
    const { role, userId } = req.user!;

    const shipment = await prisma.shipment.findUnique({
      where: { id: shipmentId },
    });

    if (!shipment) {
      return res.status(404).json({
        success: false,
        error: 'Shipment not found',
      });
    }

    // Customers can only view bids for their shipments
    if (role === UserRole.CUSTOMER && shipment.customerId !== userId) {
      return res.status(403).json({
        success: false,
        error: 'Not authorized to view these bids',
      });
    }

    const bids = await prisma.bid.findMany({
      where: { shipmentId },
      include: {
        transporter: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    res.json({
      success: true,
      data: bids,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Internal server error',
    });
  }
});

export default router; 