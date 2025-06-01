import { PrismaClient, Shipment, ShipmentStatus, User } from '@prisma/client';
import { CreateShipmentInput, UpdateShipmentStatusInput, CreateBidInput } from '../validations/shipment.validation';
import { NotFoundError, BadRequestError } from '../utils/errors';

const prisma = new PrismaClient();

export class ShipmentService {
  async createShipment(data: CreateShipmentInput, customerId: string): Promise<Shipment> {
    return prisma.shipment.create({
      data: {
        ...data,
        customerId,
        status: ShipmentStatus.PENDING,
      },
    });
  }

  async getShipment(id: string): Promise<Shipment> {
    const shipment = await prisma.shipment.findUnique({
      where: { id },
      include: {
        customer: true,
        assignedTo: true,
        bids: {
          include: {
            transporter: true,
          },
        },
        trackings: true,
      },
    });

    if (!shipment) {
      throw new NotFoundError('Shipment not found');
    }

    return shipment;
  }

  async updateShipmentStatus(
    id: string,
    data: UpdateShipmentStatusInput
  ): Promise<Shipment> {
    const shipment = await prisma.shipment.findUnique({
      where: { id },
    });

    if (!shipment) {
      throw new NotFoundError('Shipment not found');
    }

    return prisma.shipment.update({
      where: { id },
      data: { status: data.status },
    });
  }

  async createBid(
    shipmentId: string,
    transporterId: string,
    data: CreateBidInput
  ) {
    const shipment = await prisma.shipment.findUnique({
      where: { id: shipmentId },
    });

    if (!shipment) {
      throw new NotFoundError('Shipment not found');
    }

    if (shipment.status !== ShipmentStatus.AWAITING_BIDS) {
      throw new BadRequestError('Shipment is not accepting bids');
    }

    return prisma.bid.create({
      data: {
        ...data,
        shipmentId,
        transporterId,
      },
    });
  }

  async acceptBid(shipmentId: string, bidId: string, customerId: string) {
    const shipment = await prisma.shipment.findUnique({
      where: { id: shipmentId },
      include: { bids: true },
    });

    if (!shipment) {
      throw new NotFoundError('Shipment not found');
    }

    if (shipment.customerId !== customerId) {
      throw new BadRequestError('Only the customer can accept bids');
    }

    const bid = shipment.bids.find((b) => b.id === bidId);
    if (!bid) {
      throw new NotFoundError('Bid not found');
    }

    return prisma.$transaction([
      prisma.shipment.update({
        where: { id: shipmentId },
        data: {
          status: ShipmentStatus.BID_ACCEPTED,
          transporterId: bid.transporterId,
        },
      }),
      prisma.bid.update({
        where: { id: bidId },
        data: { status: 'ACCEPTED' },
      }),
    ]);
  }
} 