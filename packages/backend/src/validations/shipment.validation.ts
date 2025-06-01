import { z } from 'zod';
import { JobStatus } from '@prisma/client';

export const createShipmentSchema = z.object({
  origin: z.string().min(1),
  destination: z.string().min(1),
  size: z.string().min(1),
  weight: z.number().positive(),
  description: z.string().min(1),
});

export const updateShipmentSchema = z.object({
  origin: z.string().min(1).optional(),
  destination: z.string().min(1).optional(),
  size: z.string().min(1).optional(),
  weight: z.number().positive().optional(),
  description: z.string().min(1).optional(),
  status: z.nativeEnum(JobStatus).optional(),
  transporterId: z.string().uuid().optional()
});

export const updateStatusSchema = z.object({
  status: z.nativeEnum(JobStatus)
});

export const updateShipmentStatusSchema = z.object({
  status: z.enum([
    JobStatus.PENDING,
    JobStatus.OPEN_FOR_BIDS,
    JobStatus.BID_ACCEPTED,
    JobStatus.ASSIGNED,
    JobStatus.IN_TRANSIT,
    JobStatus.DELIVERED,
  ]),
});

export const createBidSchema = z.object({
  price: z.number().positive(),
  eta: z.string().datetime(),
});

export type CreateShipmentInput = z.infer<typeof createShipmentSchema>;
export type UpdateShipmentStatusInput = z.infer<typeof updateShipmentStatusSchema>;
export type CreateBidInput = z.infer<typeof createBidSchema>; 