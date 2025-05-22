import { ShipmentStatus } from '@prisma/client';

export interface CreateShipmentDTO {
  customerId: string;
  origin: string;
  destination: string;
  size: string;
  weight: number;
  description: string;
}

export interface UpdateShipmentDTO {
  origin?: string;
  destination?: string;
  size?: string;
  weight?: number;
  description?: string;
  status?: ShipmentStatus;
  transporterId?: string;
}

export interface ShipmentResponse {
  id: string;
  customerId: string;
  origin: string;
  destination: string;
  size: string;
  weight: number;
  description: string;
  status: ShipmentStatus;
  createdAt: Date;
  updatedAt: Date;
  customer?: {
    id: string;
    name: string;
    email: string;
  };
  assignedTo?: {
    id: string;
    name: string;
    email: string;
  };
  bids?: Array<{
    id: string;
    price: number;
    eta: Date;
    status: string;
    transporter: {
      id: string;
      name: string;
      email: string;
    };
  }>;
  trackings?: Array<{
    id: string;
    location: string;
    status: string;
    description?: string;
    createdAt: Date;
  }>;
} 