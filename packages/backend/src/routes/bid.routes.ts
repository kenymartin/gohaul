import { Router } from 'express';
import { BidController } from '../controllers/bid.controller';
import { authenticate } from '../middleware/auth.middleware';
import { validateRole } from '../middleware/roles';
import { validateRequest } from '../middleware/validation';
import { z } from 'zod';

const router = Router();
const bidController = new BidController();

// Validation schemas
const createBidSchema = z.object({
  body: z.object({
    shipmentId: z.string().uuid(),
    price: z.number().positive(),
    eta: z.string().datetime()
  })
});

const updateBidSchema = z.object({
  body: z.object({
    price: z.number().positive().optional(),
    eta: z.string().datetime().optional()
  }),
  params: z.object({
    bidId: z.string().uuid()
  })
});

const bidIdParamSchema = z.object({
  params: z.object({
    bidId: z.string().uuid()
  })
});

const shipmentIdParamSchema = z.object({
  params: z.object({
    shipmentId: z.string().uuid()
  })
});

// Routes
router.post(
  '/',
  authenticate,
  validateRole(['TRANSPORTER']),
  validateRequest(createBidSchema),
  bidController.createBid.bind(bidController)
);

router.get(
  '/my-bids',
  authenticate,
  validateRole(['TRANSPORTER']),
  bidController.getMyBids.bind(bidController)
);

router.get(
  '/shipment/:shipmentId',
  authenticate,
  validateRequest(shipmentIdParamSchema),
  bidController.getBidsForShipment.bind(bidController)
);

router.get(
  '/:bidId',
  authenticate,
  validateRequest(bidIdParamSchema),
  bidController.getBidById.bind(bidController)
);

router.put(
  '/:bidId',
  authenticate,
  validateRole(['TRANSPORTER']),
  validateRequest(updateBidSchema),
  bidController.updateBid.bind(bidController)
);

router.post(
  '/:bidId/accept',
  authenticate,
  validateRole(['CUSTOMER']),
  validateRequest(bidIdParamSchema),
  bidController.acceptBid.bind(bidController)
);

router.delete(
  '/:bidId',
  authenticate,
  validateRole(['TRANSPORTER']),
  validateRequest(bidIdParamSchema),
  bidController.deleteBid.bind(bidController)
);

export default router; 