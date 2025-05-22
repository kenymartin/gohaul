import { PrismaClient, ShipmentStatus, UserRole } from '@prisma/client';
import { BidService } from '../bid.service';
import { AppError } from '../../utils/error';
import { mockDeep, mockReset } from 'jest-mock-extended';

// Mock Prisma
jest.mock('@prisma/client', () => ({
  PrismaClient: jest.fn(),
  ShipmentStatus: {
    AWAITING_BIDS: 'AWAITING_BIDS',
    BID_ACCEPTED: 'BID_ACCEPTED'
  },
  UserRole: {
    CUSTOMER: 'CUSTOMER',
    TRANSPORTER: 'TRANSPORTER'
  }
}));

describe('BidService', () => {
  const mockPrisma = mockDeep<PrismaClient>();
  let bidService: BidService;

  beforeEach(() => {
    mockReset(mockPrisma);
    // @ts-ignore - mock implementation
    PrismaClient.mockImplementation(() => mockPrisma);
    bidService = new BidService();
  });

  describe('createBid', () => {
    const mockTransporterId = 'transporter-123';
    const mockBidData = {
      shipmentId: 'shipment-123',
      price: 1000,
      eta: new Date()
    };

    it('should create a bid successfully', async () => {
      const mockShipment = {
        id: mockBidData.shipmentId,
        status: ShipmentStatus.AWAITING_BIDS,
        customerId: 'customer-123',
        origin: 'Origin',
        destination: 'Destination',
        size: 'MEDIUM',
        weight: 100,
        description: 'Test shipment',
        createdAt: new Date(),
        updatedAt: new Date(),
        transporterId: null
      };

      const mockCreatedBid = {
        id: 'bid-123',
        ...mockBidData,
        transporterId: mockTransporterId,
        status: 'PENDING',
        createdAt: new Date(),
        updatedAt: new Date()
      };

      mockPrisma.shipment.findUnique.mockResolvedValue(mockShipment);
      mockPrisma.bid.findFirst.mockResolvedValue(null);
      mockPrisma.bid.create.mockResolvedValue(mockCreatedBid);

      const result = await bidService.createBid(mockTransporterId, mockBidData);

      expect(result).toEqual(mockCreatedBid);
      expect(mockPrisma.shipment.findUnique).toHaveBeenCalledWith({
        where: { id: mockBidData.shipmentId }
      });
      expect(mockPrisma.bid.create).toHaveBeenCalledWith({
        data: {
          ...mockBidData,
          transporterId: mockTransporterId
        },
        include: {
          shipment: true,
          transporter: true
        }
      });
    });

    it('should throw error if shipment not found', async () => {
      mockPrisma.shipment.findUnique.mockResolvedValue(null);

      await expect(bidService.createBid(mockTransporterId, mockBidData))
        .rejects
        .toThrow(new AppError('Shipment not found', 404));
    });

    it('should throw error if shipment is not accepting bids', async () => {
      const mockShipment = {
        id: mockBidData.shipmentId,
        status: ShipmentStatus.BID_ACCEPTED,
        customerId: 'customer-123',
        origin: 'Origin',
        destination: 'Destination',
        size: 'MEDIUM',
        weight: 100,
        description: 'Test shipment',
        createdAt: new Date(),
        updatedAt: new Date(),
        transporterId: null
      };

      mockPrisma.shipment.findUnique.mockResolvedValue(mockShipment);

      await expect(bidService.createBid(mockTransporterId, mockBidData))
        .rejects
        .toThrow(new AppError('Shipment is not accepting bids', 400));
    });

    it('should throw error if transporter already placed a bid', async () => {
      const mockShipment = {
        id: mockBidData.shipmentId,
        status: ShipmentStatus.AWAITING_BIDS,
        customerId: 'customer-123',
        origin: 'Origin',
        destination: 'Destination',
        size: 'MEDIUM',
        weight: 100,
        description: 'Test shipment',
        createdAt: new Date(),
        updatedAt: new Date(),
        transporterId: null
      };

      const existingBid = {
        id: 'existing-bid',
        ...mockBidData,
        transporterId: mockTransporterId,
        status: 'PENDING',
        createdAt: new Date(),
        updatedAt: new Date()
      };

      mockPrisma.shipment.findUnique.mockResolvedValue(mockShipment);
      mockPrisma.bid.findFirst.mockResolvedValue(existingBid);

      await expect(bidService.createBid(mockTransporterId, mockBidData))
        .rejects
        .toThrow(new AppError('You have already placed a bid for this shipment', 400));
    });
  });

  describe('acceptBid', () => {
    const mockBidId = 'bid-123';
    const mockCustomerId = 'customer-123';

    it('should accept bid and update related records', async () => {
      const mockBid = {
        id: mockBidId,
        shipmentId: 'shipment-123',
        transporterId: 'transporter-123',
        status: 'PENDING',
        price: 1000,
        eta: new Date(),
        createdAt: new Date(),
        updatedAt: new Date(),
        shipment: {
          customerId: mockCustomerId
        }
      };

      const mockUpdatedBid = {
        ...mockBid,
        status: 'ACCEPTED'
      };

      mockPrisma.bid.findUnique.mockResolvedValue(mockBid);
      mockPrisma.bid.update.mockResolvedValue(mockUpdatedBid);
      mockPrisma.$transaction.mockImplementation((callback: any) => callback(mockPrisma));

      const result = await bidService.acceptBid(mockBidId, mockCustomerId);

      expect(result).toEqual(mockUpdatedBid);
      expect(mockPrisma.bid.update).toHaveBeenCalledWith({
        where: { id: mockBidId },
        data: { status: 'ACCEPTED' },
        include: {
          shipment: true,
          transporter: true
        }
      });
      expect(mockPrisma.shipment.update).toHaveBeenCalledWith({
        where: { id: mockBid.shipmentId },
        data: {
          status: ShipmentStatus.BID_ACCEPTED,
          transporterId: mockBid.transporterId
        }
      });
    });

    it('should throw error if bid not found', async () => {
      mockPrisma.bid.findUnique.mockResolvedValue(null);

      await expect(bidService.acceptBid(mockBidId, mockCustomerId))
        .rejects
        .toThrow(new AppError('Bid not found', 404));
    });

    it('should throw error if user is not the shipment customer', async () => {
      const mockBid = {
        id: mockBidId,
        shipmentId: 'shipment-123',
        transporterId: 'transporter-123',
        status: 'PENDING',
        price: 1000,
        eta: new Date(),
        createdAt: new Date(),
        updatedAt: new Date(),
        shipment: {
          customerId: 'different-customer'
        }
      };

      mockPrisma.bid.findUnique.mockResolvedValue(mockBid);

      await expect(bidService.acceptBid(mockBidId, mockCustomerId))
        .rejects
        .toThrow(new AppError('Unauthorized to accept this bid', 403));
    });
  });
}); 