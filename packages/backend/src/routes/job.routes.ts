import { Router } from 'express';
import { JobController } from '../controllers/job.controller';
import { authenticate } from '../middleware/auth.middleware';
import { validate } from '../middleware/validation.middleware';
import { z } from 'zod';

const router = Router();
const jobController = new JobController();

// Job validation schemas
const createJobSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  type: z.enum(['STANDARD', 'AUCTION']),
  pickupLocation: z.string().min(1, 'Pickup location is required'),
  pickupLatitude: z.number().optional(),
  pickupLongitude: z.number().optional(),
  pickupDateTime: z.string().datetime().optional(),
  pickupInstructions: z.string().optional(),
  deliveryLocation: z.string().min(1, 'Delivery location is required'),
  deliveryLatitude: z.number().optional(),
  deliveryLongitude: z.number().optional(),
  deliveryDateTime: z.string().datetime().optional(),
  deliveryInstructions: z.string().optional(),
  itemType: z.string().min(1, 'Item type is required'),
  weight: z.number().positive().optional(),
  dimensions: z.string().optional(),
  isFragile: z.boolean().optional(),
  isOversized: z.boolean().optional(),
  specialRequirements: z.string().optional(),
  fixedPrice: z.number().positive().optional(),
  startingBid: z.number().positive().optional(),
  maxBudget: z.number().positive().optional(),
  biddingEndsAt: z.string().datetime().optional(),
  expiresAt: z.string().datetime().optional(),
  images: z.array(z.string().url()).optional(),
});

const updateJobSchema = z.object({
  title: z.string().min(1).optional(),
  description: z.string().min(10).optional(),
  status: z.enum(['PENDING', 'OPEN_FOR_BIDS', 'BID_ACCEPTED', 'ASSIGNED', 'IN_TRANSIT', 'DELIVERED', 'CANCELLED']).optional(),
  pickupDateTime: z.string().datetime().optional(),
  deliveryDateTime: z.string().datetime().optional(),
  fixedPrice: z.number().positive().optional(),
  maxBudget: z.number().positive().optional(),
  biddingEndsAt: z.string().datetime().optional(),
});

const createBidSchema = z.object({
  jobId: z.string().min(1, 'Job ID is required'),
  amount: z.number().positive('Bid amount must be positive'),
  message: z.string().optional(),
  estimatedDelivery: z.string().datetime().optional(),
});

const assignJobSchema = z.object({
  transporterId: z.string().min(1, 'Transporter ID is required'),
  vehicleId: z.string().optional(),
});

// Job management routes
router.post(
  '/',
  authenticate,
  validate(createJobSchema),
  jobController.createJob.bind(jobController)
);

router.get(
  '/available',
  authenticate,
  jobController.getAvailableJobs.bind(jobController)
);

router.get(
  '/my',
  authenticate,
  jobController.getMyJobs.bind(jobController)
);

router.get(
  '/:id',
  jobController.getJobById.bind(jobController)
);

router.patch(
  '/:id',
  authenticate,
  validate(updateJobSchema),
  jobController.updateJob.bind(jobController)
);

router.patch(
  '/:id/assign',
  authenticate,
  validate(assignJobSchema),
  jobController.assignJob.bind(jobController)
);

router.delete(
  '/:id',
  authenticate,
  jobController.deleteJob.bind(jobController)
);

// Bidding routes
router.post(
  '/bids',
  authenticate,
  validate(createBidSchema),
  jobController.createBid.bind(jobController)
);

router.get(
  '/bids/my',
  authenticate,
  jobController.getMyBids.bind(jobController)
);

router.get(
  '/:id/bids',
  authenticate,
  jobController.getBidsForJob.bind(jobController)
);

router.patch(
  '/bids/:bidId/accept',
  authenticate,
  jobController.acceptBid.bind(jobController)
);

router.patch(
  '/bids/:bidId/reject',
  authenticate,
  jobController.rejectBid.bind(jobController)
);

router.patch(
  '/bids/:bidId/withdraw',
  authenticate,
  jobController.withdrawBid.bind(jobController)
);

router.patch(
  '/bids/:bidId',
  authenticate,
  jobController.updateBid.bind(jobController)
);

export default router; 