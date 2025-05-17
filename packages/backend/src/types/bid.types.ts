import { Bid, Shipment, User } from '@prisma/client';

export type BidStatus = 'PENDING' | 'ACCEPTED' | 'REJECTED';

export interface CreateBidDTO {
  shipmentId: string;
  price: number;
  eta: Date;
}

export interface UpdateBidDTO {
  price?: number;
  eta?: Date;
  status?: BidStatus;
}

export interface BidWithDetails extends Bid {
  shipment: Shipment;
  transporter: User;
}

export interface BidResponse {
  id: string;
  shipmentId: string;
  transporterId: string;
  price: number;
  eta: Date;
  status: BidStatus;
  createdAt: Date;
  updatedAt: Date;
  shipment?: Shipment;
  transporter?: {
    id: string;
    name: string;
    email: string;
  };
} 