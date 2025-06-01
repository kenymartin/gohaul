import { PrismaClient, Message } from '@prisma/client';
import { NotFoundError, BadRequestError } from '../utils/errors';

const prisma = new PrismaClient();

export class MessageService {
  async createMessage(
    shipmentId: string,
    senderId: string,
    receiverId: string,
    content: string
  ): Promise<Message> {
    const shipment = await prisma.shipment.findUnique({
      where: { id: shipmentId },
      include: { customer: true, assignedTo: true },
    });

    if (!shipment) {
      throw new NotFoundError('Shipment not found');
    }

    // Verify sender and receiver are involved in the shipment
    if (
      senderId !== shipment.customerId &&
      senderId !== shipment.transporterId
    ) {
      throw new BadRequestError('Sender is not involved in this shipment');
    }

    if (
      receiverId !== shipment.customerId &&
      receiverId !== shipment.transporterId
    ) {
      throw new BadRequestError('Receiver is not involved in this shipment');
    }

    return prisma.message.create({
      data: {
        shipmentId,
        senderId,
        receiverId,
        content,
      },
    });
  }

  async getShipmentMessages(shipmentId: string): Promise<Message[]> {
    const shipment = await prisma.shipment.findUnique({
      where: { id: shipmentId },
    });

    if (!shipment) {
      throw new NotFoundError('Shipment not found');
    }

    return prisma.message.findMany({
      where: { shipmentId },
      include: {
        sender: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        receiver: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
      orderBy: { createdAt: 'asc' },
    });
  }

  async markMessageAsRead(messageId: string, userId: string): Promise<Message> {
    const message = await prisma.message.findUnique({
      where: { id: messageId },
    });

    if (!message) {
      throw new NotFoundError('Message not found');
    }

    if (message.receiverId !== userId) {
      throw new BadRequestError('Only the receiver can mark messages as read');
    }

    return prisma.message.update({
      where: { id: messageId },
      data: { isRead: true },
    });
  }
} 