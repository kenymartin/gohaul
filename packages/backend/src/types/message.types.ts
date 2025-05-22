export interface CreateMessageDTO {
  shipmentId: string;
  senderId: string;
  receiverId: string;
  content: string;
}

export interface UpdateMessageDTO {
  content?: string;
  isRead?: boolean;
}

export interface MessageResponse {
  id: string;
  shipmentId: string;
  senderId: string;
  receiverId: string;
  content: string;
  isRead: boolean;
  createdAt: Date;
  updatedAt: Date;
  sender?: {
    id: string;
    name: string;
    email: string;
  };
  receiver?: {
    id: string;
    name: string;
    email: string;
  };
  shipment?: {
    id: string;
    origin: string;
    destination: string;
    status: string;
  };
} 