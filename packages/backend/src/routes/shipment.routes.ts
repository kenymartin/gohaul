import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { CreateShipmentDto, ShipmentStatus, UserRole } from '@gohaul/shared';
import { authenticate, authorize, AuthRequest } from '../utils/auth';
import { sendShipmentCreatedEmail } from '../services/email.service';
import { z } from 'zod';

const router = Router();
const prisma = new PrismaClient();

const createShipmentSchema = z.object({
  origin: z.string().min(1),
  destination: z.string().min(1),
  size: z.string().min(1),
  weight: z.number().positive(),
  description: z.string().min(1),
});

// Create shipment
router.post(
  '/',
  authenticate,
  authorize([UserRole.CUSTOMER]),
  async (req: AuthRequest, res) => {
    try {
      const data = createShipmentSchema.parse(req.body) as CreateShipmentDto;
      const userId = req.user!.userId;

      const shipment = await prisma.shipment.create({
        data: {
          ...data,
          customerId: userId,
          status: ShipmentStatus.AWAITING_BIDS,
        },
        include: {
          customer: true,
        },
      });

      // Send email notification
      await sendShipmentCreatedEmail(shipment, shipment.customer);

      res.status(201).json({
        success: true,
        data: shipment,
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

// Get all shipments (filtered by role)
router.get('/', authenticate, async (req: AuthRequest, res) => {
  try {
    const { role, userId } = req.user!;
    let shipments;

    if (role === UserRole.CUSTOMER) {
      shipments = await prisma.shipment.findMany({
        where: {
          customerId: userId,
        },
        include: {
          bids: true,
          assignedTo: true,
        },
      });
    } else {
      shipments = await prisma.shipment.findMany({
        where: {
          status: ShipmentStatus.AWAITING_BIDS,
        },
        include: {
          bids: {
            where: {
              transporterId: userId,
            },
          },
        },
      });
    }

    res.json({
      success: true,
      data: shipments,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Internal server error',
    });
  }
});

// Update shipment status
router.patch(
  '/:id/status',
  authenticate,
  authorize([UserRole.TRANSPORTER]),
  async (req: AuthRequest, res) => {
    try {
      const { id } = req.params;
      const { status } = req.body;

      const shipment = await prisma.shipment.findUnique({
        where: { id },
      });

      if (!shipment) {
        return res.status(404).json({
          success: false,
          error: 'Shipment not found',
        });
      }

      if (shipment.transporterId !== req.user!.userId) {
        return res.status(403).json({
          success: false,
          error: 'Not authorized to update this shipment',
        });
      }

      const updatedShipment = await prisma.shipment.update({
        where: { id },
        data: { status },
      });

      res.json({
        success: true,
        data: updatedShipment,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: 'Internal server error',
      });
    }
  }
);

// Delete shipment
router.delete(
  '/:id',
  authenticate,
  authorize([UserRole.CUSTOMER]),
  async (req: AuthRequest, res) => {
    try {
      const { id } = req.params;

      const shipment = await prisma.shipment.findUnique({
        where: { id },
      });

      if (!shipment) {
        return res.status(404).json({
          success: false,
          error: 'Shipment not found',
        });
      }

      if (shipment.customerId !== req.user!.userId) {
        return res.status(403).json({
          success: false,
          error: 'Not authorized to delete this shipment',
        });
      }

      await prisma.shipment.delete({
        where: { id },
      });

      res.json({
        success: true,
        data: null,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: 'Internal server error',
      });
    }
  }
);

export default router; 