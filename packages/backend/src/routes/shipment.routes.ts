import { Router } from 'express';
import { ShipmentController } from '../controllers/shipment.controller';
import { validateRequest } from '../middleware/validation';
import { createShipmentSchema, updateShipmentSchema, updateStatusSchema } from '../validations/shipment.validation';
import { authenticate } from '../middleware/auth';
import { validateRole } from '../middleware/roles';

const router = Router();
const shipmentController = new ShipmentController();

// Protected routes
router.use(authenticate);

// Customer routes
router.post('/', validateRole(['CUSTOMER']), validateRequest(createShipmentSchema), shipmentController.createShipment);
router.get('/my-shipments', validateRole(['CUSTOMER']), shipmentController.getMyShipments);

// Transporter routes
router.get('/assigned-shipments', validateRole(['TRANSPORTER']), shipmentController.getAssignedShipments);
router.patch('/:id/status', validateRole(['TRANSPORTER']), validateRequest(updateStatusSchema), shipmentController.updateStatus);

// Common routes
router.get('/:id', shipmentController.getShipment);
router.put('/:id', validateRequest(updateShipmentSchema), shipmentController.updateShipment);
router.delete('/:id', shipmentController.deleteShipment);

export default router; 