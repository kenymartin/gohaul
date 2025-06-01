import { PrismaClient, Tracking } from '@prisma/client';
import { NotFoundError, BadRequestError } from '../utils/errors';

const prisma = new PrismaClient();

export class TrackingService {
  async createTracking(
    shipmentId: string,
    transporterId: string,
    data: { location: string; status: string; description?: string }
  ): Promise<Tracking> {
    const shipment = await prisma.shipment.findUnique({
      where: { id: shipmentId },
    });

    if (!shipment) {
      throw new NotFoundError('Shipment not found');
    }

    if (shipment.transporterId !== transporterId) {
      throw new BadRequestError('Only the assigned transporter can update tracking');
    }

    return prisma.tracking.create({
      data: {
        ...data,
        shipmentId,
      },
    });
  }

  async getShipmentTracking(shipmentId: string): Promise<Tracking[]> {
    const shipment = await prisma.shipment.findUnique({
      where: { id: shipmentId },
    });

    if (!shipment) {
      throw new NotFoundError('Shipment not found');
    }

    return prisma.tracking.findMany({
      where: { shipmentId },
      orderBy: { createdAt: 'desc' },
    });
  }
} 