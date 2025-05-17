// Common types shared between frontend and backend

export enum UserRole {
  CUSTOMER = 'CUSTOMER',
  TRANSPORTER = 'TRANSPORTER',
}

export enum ShipmentStatus {
  PENDING = 'PENDING',
  AWAITING_BIDS = 'AWAITING_BIDS',
  BID_ACCEPTED = 'BID_ACCEPTED',
  IN_TRANSIT = 'IN_TRANSIT',
  DELIVERED = 'DELIVERED',
}

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  createdAt: Date;
  updatedAt: Date;
}

export interface Shipment {
  id: string;
  customerId: string;
  origin: string;
  destination: string;
  size: string;
  weight: number;
  description: string;
  status: ShipmentStatus;
  transporterId?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Bid {
  id: string;
  shipmentId: string;
  transporterId: string;
  price: number;
  eta: Date;
  status: 'PENDING' | 'ACCEPTED' | 'REJECTED';
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateShipmentDto {
  origin: string;
  destination: string;
  size: string;
  weight: number;
  description: string;
}

export interface CreateBidDto {
  shipmentId: string;
  price: number;
  eta: Date;
}

export interface LoginDto {
  email: string;
  password: string;
}

export interface SignupDto {
  email: string;
  password: string;
  name: string;
  role: UserRole;
}

export interface DashboardStats {
  totalShipments: number;
  totalBids: number;
  shipmentsByStatus: Record<ShipmentStatus, number>;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
} 