export interface CreateTrackingDTO {
  shipmentId: string;
  location: string;
  status: string;
  description?: string;
}

export interface UpdateTrackingDTO {
  location?: string;
  status?: string;
  description?: string;
}

export interface TrackingResponse {
  id: string;
  shipmentId: string;
  location: string;
  status: string;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
  shipment?: {
    id: string;
    origin: string;
    destination: string;
    status: string;
  };
} 