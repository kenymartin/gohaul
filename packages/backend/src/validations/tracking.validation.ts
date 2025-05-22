import { z } from 'zod';

export const createTrackingSchema = z.object({
  shipmentId: z.string().uuid(),
  location: z.string().min(1),
  status: z.string().min(1),
  description: z.string().optional()
});

export const updateTrackingSchema = z.object({
  location: z.string().min(1).optional(),
  status: z.string().min(1).optional(),
  description: z.string().optional()
}); 