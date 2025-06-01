// Shared types for the GoHaul application
export interface CreateShipmentDto {
  origin: string;
  destination: string;
  size: 'SMALL' | 'MEDIUM' | 'LARGE';
  weight: number;
  description: string;
}

export interface Shipment {
  id: string;
  origin: string;
  destination: string;
  status: ShipmentStatus;
  size: 'SMALL' | 'MEDIUM' | 'LARGE';
  weight: number;
  description: string;
  createdAt: string;
  customer: {
    id: string;
    name: string;
    email: string;
  };
  transporter?: {
    id: string;
    name: string;
    email: string;
  };
  bids?: Bid[];
}

export interface Bid {
  id: string;
  price: number;
  eta: string;
  status: 'PENDING' | 'ACCEPTED' | 'REJECTED';
  transporter: {
    id: string;
    name: string;
    email: string;
  };
  createdAt: string;
}

export type ShipmentStatus = 'PENDING' | 'AWAITING_BIDS' | 'BID_ACCEPTED' | 'IN_TRANSIT' | 'DELIVERED'; 