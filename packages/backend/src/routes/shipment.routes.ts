import { Router } from 'express';
import { ShipmentController } from '../controllers/shipment.controller';
import { validate } from '../middleware/validation.middleware';
import { authenticate, authorize } from '../middleware/auth.middleware';
import { UserRole } from '@prisma/client';
import {
  createShipmentSchema,
  updateShipmentStatusSchema,
  createBidSchema,
} from '../validations/shipment.validation';

const router = Router();
const shipmentController = new ShipmentController();

// Customer routes
router.post(
  '/',
  authenticate,
  authorize([UserRole.CUSTOMER]),
  validate(createShipmentSchema),
  shipmentController.createShipment.bind(shipmentController)
);

router.get(
  '/:id',
  authenticate,
  shipmentController.getShipment.bind(shipmentController)
);

router.patch(
  '/:id/status',
  authenticate,
  authorize([UserRole.CUSTOMER, UserRole.TRANSPORTER]),
  validate(updateShipmentStatusSchema),
  shipmentController.updateShipmentStatus.bind(shipmentController)
);

// Transporter routes
router.post(
  '/:shipmentId/bids',
  authenticate,
  authorize([UserRole.TRANSPORTER]),
  validate(createBidSchema),
  shipmentController.createBid.bind(shipmentController)
);

router.post(
  '/:shipmentId/bids/:bidId/accept',
  authenticate,
  authorize([UserRole.CUSTOMER]),
  shipmentController.acceptBid.bind(shipmentController)
);

export default router; 