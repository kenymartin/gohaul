import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { ShipmentStatus, UserRole } from '@gohaul/shared';
import { authenticate, authorize, AuthRequest } from '../utils/auth';

const router = Router();
const prisma = new PrismaClient();

router.get('/stats', authenticate, async (req: AuthRequest, res) => {
  try {
    const { role, userId } = req.user!;
    let whereClause = {};

    if (role === UserRole.CUSTOMER) {
      whereClause = { customerId: userId };
    } else if (role === UserRole.TRANSPORTER) {
      whereClause = { transporterId: userId };
    }

    // Get total shipments
    const totalShipments = await prisma.shipment.count({
      where: whereClause,
    });

    // Get total bids
    const totalBids = await prisma.bid.count({
      where: role === UserRole.TRANSPORTER ? { transporterId: userId } : {},
    });

    // Get shipments by status
    const shipmentsByStatus = await prisma.shipment.groupBy({
      by: ['status'],
      where: whereClause,
      _count: true,
    });

    // Format status counts
    const statusCounts = Object.values(ShipmentStatus).reduce(
      (acc, status) => ({
        ...acc,
        [status]: 0,
      }),
      {} as Record<ShipmentStatus, number>
    );

    shipmentsByStatus.forEach((item) => {
      statusCounts[item.status as ShipmentStatus] = item._count;
    });

    res.json({
      success: true,
      data: {
        totalShipments,
        totalBids,
        shipmentsByStatus: statusCounts,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Internal server error',
    });
  }
});

export default router; 