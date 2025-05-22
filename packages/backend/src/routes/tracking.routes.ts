import { Router } from 'express';
import { TrackingController } from '../controllers/tracking.controller';
import { validateRequest } from '../middleware/validation';
import { createTrackingSchema, updateTrackingSchema } from '../validations/tracking.validation';
import { authenticate } from '../middleware/auth';
import { validateRole } from '../middleware/roles';

const router = Router();
const trackingController = new TrackingController();

// Protected routes
router.use(authenticate);

// Transporter routes
router.post('/', validateRole(['TRANSPORTER']), validateRequest(createTrackingSchema), trackingController.createTracking);
router.put('/:id', validateRole(['TRANSPORTER']), validateRequest(updateTrackingSchema), trackingController.updateTracking);
router.delete('/:id', validateRole(['TRANSPORTER']), trackingController.deleteTracking);

// Common routes
router.get('/:id', trackingController.getTracking);
router.get('/shipment/:shipmentId', trackingController.getShipmentTrackings);

export default router; 