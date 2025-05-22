import { z } from 'zod';

export const createMessageSchema = z.object({
  shipmentId: z.string().uuid(),
  receiverId: z.string().uuid(),
  content: z.string().min(1)
});

export const updateMessageSchema = z.object({
  content: z.string().min(1).optional(),
  isRead: z.boolean().optional()
}); 