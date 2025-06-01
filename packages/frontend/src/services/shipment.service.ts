import { api } from '../lib/api';

export interface Shipment {
  id: string;
  origin: string;
  destination: string;
  status: 'PENDING' | 'AWAITING_BIDS' | 'BID_ACCEPTED' | 'IN_TRANSIT' | 'DELIVERED';
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

export interface CreateShipmentDto {
  origin: string;
  destination: string;
  size: 'SMALL' | 'MEDIUM' | 'LARGE';
  weight: number;
  description: string;
}

export const shipmentService = {
  async getAll(): Promise<Shipment[]> {
    const { data } = await api.get<{ status: string; data: Shipment[] }>('/shipments');
    return data.data;
  },

  async getById(id: string): Promise<Shipment> {
    const { data } = await api.get<{ status: string; data: Shipment }>(`/shipments/${id}`);
    return data.data;
  },

  async create(shipment: CreateShipmentDto): Promise<Shipment> {
    const { data } = await api.post<{ status: string; data: Shipment }>('/shipments', shipment);
    return data.data;
  },

  async updateStatus(id: string, status: Shipment['status']): Promise<Shipment> {
    const { data } = await api.patch<{ status: string; data: Shipment }>(`/shipments/${id}/status`, { status });
    return data.data;
  },

  async getMyShipments(): Promise<Shipment[]> {
    const { data } = await api.get<{ status: string; data: Shipment[] }>('/shipments/my');
    return data.data;
  },

  async getAvailableShipments(): Promise<Shipment[]> {
    const { data } = await api.get<{ status: string; data: Shipment[] }>('/shipments/available');
    return data.data;
  },
}; 