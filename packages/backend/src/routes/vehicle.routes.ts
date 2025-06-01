import { Router } from 'express';
import { VehicleController } from '../controllers/vehicle.controller';
import { authenticate } from '../middleware/auth';
import { validate } from '../middleware/validation.middleware';
import { z } from 'zod';

const router = Router();
const vehicleController = new VehicleController();

// Vehicle validation schemas
const createVehicleSchema = z.object({
  type: z.enum(['MOTORCYCLE', 'CAR', 'VAN', 'SMALL_TRUCK', 'MEDIUM_TRUCK', 'LARGE_TRUCK', 'TRAILER', 'SPECIALIZED']),
  make: z.string().min(1, 'Make is required'),
  model: z.string().min(1, 'Model is required'),
  year: z.number().int().min(1900).max(new Date().getFullYear() + 1),
  licensePlate: z.string().min(1, 'License plate is required'),
  capacity: z.string().min(1, 'Capacity is required'),
  description: z.string().optional(),
  images: z.array(z.string().url()).optional(),
});

const updateVehicleSchema = z.object({
  type: z.enum(['MOTORCYCLE', 'CAR', 'VAN', 'SMALL_TRUCK', 'MEDIUM_TRUCK', 'LARGE_TRUCK', 'TRAILER', 'SPECIALIZED']).optional(),
  make: z.string().min(1).optional(),
  model: z.string().min(1).optional(),
  year: z.number().int().min(1900).max(new Date().getFullYear() + 1).optional(),
  licensePlate: z.string().min(1).optional(),
  capacity: z.string().min(1).optional(),
  description: z.string().optional(),
  images: z.array(z.string().url()).optional(),
  isActive: z.boolean().optional(),
});

// Vehicle management routes
router.post(
  '/',
  authenticate,
  validate(createVehicleSchema),
  vehicleController.createVehicle.bind(vehicleController)
);

router.get(
  '/my',
  authenticate,
  vehicleController.getUserVehicles.bind(vehicleController)
);

router.get(
  '/my/active',
  authenticate,
  vehicleController.getActiveVehicles.bind(vehicleController)
);

router.get(
  '/search',
  vehicleController.searchVehicles.bind(vehicleController)
);

router.get(
  '/type/:type',
  vehicleController.getVehiclesByType.bind(vehicleController)
);

router.get(
  '/statistics',
  authenticate,
  vehicleController.getVehicleStatistics.bind(vehicleController)
);

router.get(
  '/:id',
  vehicleController.getVehicleById.bind(vehicleController)
);

router.patch(
  '/:id',
  authenticate,
  validate(updateVehicleSchema),
  vehicleController.updateVehicle.bind(vehicleController)
);

router.delete(
  '/:id',
  authenticate,
  vehicleController.deleteVehicle.bind(vehicleController)
);

export default router; 