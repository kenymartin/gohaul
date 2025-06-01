// Shared types for the GoHaul application

export interface LocationData {
  address: string;
  lat: number;
  lng: number;
  placeId?: string;
  city?: string;
  state?: string;
  country?: string;
  postalCode?: string;
}

export interface CreateShipmentDto {
  origin: string;
  destination: string;
  size: 'SMALL' | 'MEDIUM' | 'LARGE';
  weight: number;
  description: string;
  originLocation?: LocationData;
  destinationLocation?: LocationData;
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
  originLocation?: LocationData;
  destinationLocation?: LocationData;
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