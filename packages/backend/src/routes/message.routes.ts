import { Router } from 'express';
import { MessageController } from '../controllers/message.controller';
import { validateRequest } from '../middleware/validation';
import { createMessageSchema, updateMessageSchema } from '../validations/message.validation';
import { authenticate } from '../middleware/auth';

const router = Router();
const messageController = new MessageController();

// Protected routes
router.use(authenticate);

// Message routes
router.post('/', validateRequest(createMessageSchema), messageController.createMessage);
router.get('/:id', messageController.getMessage);
router.put('/:id', validateRequest(updateMessageSchema), messageController.updateMessage);
router.delete('/:id', messageController.deleteMessage);
router.get('/shipment/:shipmentId', messageController.getShipmentMessages);
router.get('/my-messages', messageController.getMyMessages);
router.patch('/:id/read', messageController.markAsRead);

export default router; 