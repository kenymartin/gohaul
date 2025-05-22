import { z } from 'zod';
import { ShipmentStatus } from '@prisma/client';

export const createShipmentSchema = z.object({
  customerId: z.string().uuid(),
  origin: z.string().min(1),
  destination: z.string().min(1),
  size: z.string().min(1),
  weight: z.number().positive(),
  description: z.string().min(1)
});

export const updateShipmentSchema = z.object({
  origin: z.string().min(1).optional(),
  destination: z.string().min(1).optional(),
  size: z.string().min(1).optional(),
  weight: z.number().positive().optional(),
  description: z.string().min(1).optional(),
  status: z.nativeEnum(ShipmentStatus).optional(),
  transporterId: z.string().uuid().optional()
});

export const updateStatusSchema = z.object({
  status: z.nativeEnum(ShipmentStatus)
}); 