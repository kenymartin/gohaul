import { api } from '../lib/api';
import { Bid } from './shipment.service';

export interface CreateBidDto {
  shipmentId: string;
  price: number;
  eta: string;
}

export interface BidResponse {
  id: string;
  shipmentId: string;
  transporterId: string;
  price: number;
  eta: string;
  status: 'PENDING' | 'ACCEPTED' | 'REJECTED';
  createdAt: string;
  updatedAt: string;
  transporter: {
    id: string;
    name: string;
    email: string;
    role: string;
  };
}

export const bidService = {
  async createBid(bid: CreateBidDto): Promise<BidResponse> {
    const { data } = await api.post<{ status: string; data: BidResponse }>('/bids', bid);
    return data.data;
  },

  async getBidsForShipment(shipmentId: string): Promise<BidResponse[]> {
    const { data } = await api.get<{ status: string; data: BidResponse[] }>(`/bids/shipment/${shipmentId}`);
    return data.data;
  },

  async getMyBids(): Promise<BidResponse[]> {
    const { data } = await api.get<{ status: string; data: BidResponse[] }>('/bids/my');
    return data.data;
  },

  async acceptBid(bidId: string): Promise<BidResponse> {
    const { data } = await api.patch<{ status: string; data: BidResponse }>(`/bids/${bidId}/accept`);
    return data.data;
  },

  async rejectBid(bidId: string): Promise<BidResponse> {
    const { data } = await api.patch<{ status: string; data: BidResponse }>(`/bids/${bidId}/reject`);
    return data.data;
  },
}; 