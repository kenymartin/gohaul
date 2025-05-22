import { PrismaClient } from '@prisma/client';
import type { Prisma } from '@prisma/client';
import { CreateMessageDTO, UpdateMessageDTO } from '../types/message.types';
import { AppError } from '../utils/error';

const prisma = new PrismaClient();

export class MessageService {
  async createMessage(data: CreateMessageDTO) {
    const shipment = await prisma.shipment.findUnique({
      where: { id: data.shipmentId }
    });

    if (!shipment) {
      throw new AppError('Shipment not found', 404);
    }

    return prisma.message.create({
      data,
      include: {
        sender: {
          select: {
            id: true,
            name: true,
            email: true
          }
        },
        receiver: {
          select: {
            id: true,
            name: true,
            email: true
          }
        },
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

  async getMessageById(id: string) {
    const message = await prisma.message.findUnique({
      where: { id },
      include: {
        sender: {
          select: {
            id: true,
            name: true,
            email: true
          }
        },
        receiver: {
          select: {
            id: true,
            name: true,
            email: true
          }
        },
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

    if (!message) {
      throw new AppError('Message not found', 404);
    }

    return message;
  }

  async updateMessage(id: string, data: UpdateMessageDTO) {
    const message = await prisma.message.findUnique({
      where: { id }
    });

    if (!message) {
      throw new AppError('Message not found', 404);
    }

    return prisma.message.update({
      where: { id },
      data,
      include: {
        sender: {
          select: {
            id: true,
            name: true,
            email: true
          }
        },
        receiver: {
          select: {
            id: true,
            name: true,
            email: true
          }
        },
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

  async deleteMessage(id: string) {
    const message = await prisma.message.findUnique({
      where: { id }
    });

    if (!message) {
      throw new AppError('Message not found', 404);
    }

    await prisma.message.delete({
      where: { id }
    });
  }

  async getShipmentMessages(shipmentId: string) {
    const shipment = await prisma.shipment.findUnique({
      where: { id: shipmentId }
    });

    if (!shipment) {
      throw new AppError('Shipment not found', 404);
    }

    return prisma.message.findMany({
      where: { shipmentId },
      include: {
        sender: {
          select: {
            id: true,
            name: true,
            email: true
          }
        },
        receiver: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });
  }

  async getUserMessages(userId: string) {
    return prisma.message.findMany({
      where: {
        OR: [
          { senderId: userId },
          { receiverId: userId }
        ]
      },
      include: {
        sender: {
          select: {
            id: true,
            name: true,
            email: true
          }
        },
        receiver: {
          select: {
            id: true,
            name: true,
            email: true
          }
        },
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

  async markAsRead(id: string) {
    const message = await prisma.message.findUnique({
      where: { id }
    });

    if (!message) {
      throw new AppError('Message not found', 404);
    }

    return prisma.message.update({
      where: { id },
      data: { isRead: true },
      include: {
        sender: {
          select: {
            id: true,
            name: true,
            email: true
          }
        },
        receiver: {
          select: {
            id: true,
            name: true,
            email: true
          }
        },
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
} 