import { PrismaClient } from '@prisma/client';
import type { Prisma } from '@prisma/client';
import { CreateTrackingDTO, UpdateTrackingDTO } from '../types/tracking.types';
import { AppError } from '../utils/error';

const prisma = new PrismaClient();

export class TrackingService {
  async createTracking(data: CreateTrackingDTO) {
    const shipment = await prisma.shipment.findUnique({
      where: { id: data.shipmentId }
    });

    if (!shipment) {
      throw new AppError('Shipment not found', 404);
    }

    if (shipment.status !== 'IN_TRANSIT') {
      throw new AppError('Can only track shipments that are in transit', 400);
    }

    return prisma.tracking.create({
      data,
      include: {
        shipment: {
          select: {
            id: true,
            origin: true,
            destination: true,
            status: true
          }
        }
      }
    });
  }

  async getTrackingById(id: string) {
    const tracking = await prisma.tracking.findUnique({
      where: { id },
      include: {
        shipment: {
          select: {
            id: true,
            origin: true,
            destination: true,
            status: true
          }
        }
      }
    });

    if (!tracking) {
      throw new AppError('Tracking not found', 404);
    }

    return tracking;
  }

  async updateTracking(id: string, data: UpdateTrackingDTO) {
    const tracking = await prisma.tracking.findUnique({
      where: { id }
    });

    if (!tracking) {
      throw new AppError('Tracking not found', 404);
    }

    return prisma.tracking.update({
      where: { id },
      data,
      include: {
        shipment: {
          select: {
            id: true,
            origin: true,
            destination: true,
            status: true
          }
        }
      }
    });
  }

  async deleteTracking(id: string) {
    const tracking = await prisma.tracking.findUnique({
      where: { id }
    });

    if (!tracking) {
      throw new AppError('Tracking not found', 404);
    }

    await prisma.tracking.delete({
      where: { id }
    });
  }

  async getShipmentTrackings(shipmentId: string) {
    const shipment = await prisma.shipment.findUnique({
      where: { id: shipmentId }
    });

    if (!shipment) {
      throw new AppError('Shipment not found', 404);
    }

    return prisma.tracking.findMany({
      where: { shipmentId },
      include: {
        shipment: {
          select: {
            id: true,
            origin: true,
            destination: true,
            status: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });
  }
} 