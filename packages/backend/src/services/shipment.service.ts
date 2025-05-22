import { PrismaClient, ShipmentStatus } from '@prisma/client';
import type { Prisma } from '@prisma/client';
import { CreateShipmentDTO, UpdateShipmentDTO } from '../types/shipment.types';
import { AppError } from '../utils/error';

const prisma = new PrismaClient();

export class ShipmentService {
  async createShipment(data: CreateShipmentDTO) {
    return prisma.shipment.create({
      data: {
        ...data,
        status: 'PENDING'
      },
      include: {
        customer: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      }
    });
  }

  async getShipmentById(id: string) {
    const shipment = await prisma.shipment.findUnique({
      where: { id },
      include: {
        customer: {
          select: {
            id: true,
            name: true,
            email: true
          }
        },
        assignedTo: {
          select: {
            id: true,
            name: true,
            email: true
          }
        },
        bids: {
          include: {
            transporter: {
              select: {
                id: true,
                name: true,
                email: true
              }
            }
          }
        },
        trackings: true
      }
    });

    if (!shipment) {
      throw new AppError('Shipment not found', 404);
    }

    return shipment;
  }

  async updateShipment(id: string, data: UpdateShipmentDTO) {
    const shipment = await prisma.shipment.findUnique({
      where: { id }
    });

    if (!shipment) {
      throw new AppError('Shipment not found', 404);
    }

    return prisma.shipment.update({
      where: { id },
      data,
      include: {
        customer: {
          select: {
            id: true,
            name: true,
            email: true
          }
        },
        assignedTo: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      }
    });
  }

  async deleteShipment(id: string) {
    const shipment = await prisma.shipment.findUnique({
      where: { id }
    });

    if (!shipment) {
      throw new AppError('Shipment not found', 404);
    }

    await prisma.shipment.delete({
      where: { id }
    });
  }

  async getCustomerShipments(customerId: string) {
    return prisma.shipment.findMany({
      where: { customerId },
      include: {
        assignedTo: {
          select: {
            id: true,
            name: true,
            email: true
          }
        },
        bids: {
          include: {
            transporter: {
              select: {
                id: true,
                name: true,
                email: true
              }
            }
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });
  }

  async getTransporterShipments(transporterId: string) {
    return prisma.shipment.findMany({
      where: { transporterId },
      include: {
        customer: {
          select: {
            id: true,
            name: true,
            email: true
          }
        },
        bids: {
          include: {
            transporter: {
              select: {
                id: true,
                name: true,
                email: true
              }
            }
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });
  }

  async updateShipmentStatus(id: string, status: string) {
    const shipment = await prisma.shipment.findUnique({
      where: { id }
    });

    if (!shipment) {
      throw new AppError('Shipment not found', 404);
    }

    return prisma.shipment.update({
      where: { id },
      data: { status: status as ShipmentStatus },
      include: {
        customer: {
          select: {
            id: true,
            name: true,
            email: true
          }
        },
        assignedTo: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      }
    });
  }
} 