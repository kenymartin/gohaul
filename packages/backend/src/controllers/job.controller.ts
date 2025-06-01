import { Request, Response, NextFunction } from 'express';
import { JobService, CreateJobDto, UpdateJobDto } from '../services/job.service';
import { BidService, CreateBidDto } from '../services/bid.service';

const jobService = new JobService();
const bidService = new BidService();

export class JobController {
  async createJob(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        return res.status(401).json({
          status: 'error',
          message: 'User not authenticated',
        });
      }

      const data = req.body as CreateJobDto;
      const job = await jobService.createJob(req.user.userId, data);

      res.status(201).json({
        status: 'success',
        data: job,
      });
    } catch (error) {
      next(error);
    }
  }

  async getJobById(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const userId = req.user?.userId;
      
      const job = await jobService.getJobById(id, userId);

      if (!job) {
        return res.status(404).json({
          status: 'error',
          message: 'Job not found',
        });
      }

      res.status(200).json({
        status: 'success',
        data: job,
      });
    } catch (error) {
      next(error);
    }
  }

  async getAvailableJobs(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        return res.status(401).json({
          status: 'error',
          message: 'User not authenticated',
        });
      }

      const jobs = await jobService.getAvailableJobs(req.user.userId);

      res.status(200).json({
        status: 'success',
        data: jobs,
      });
    } catch (error) {
      next(error);
    }
  }

  async getMyJobs(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        return res.status(401).json({
          status: 'error',
          message: 'User not authenticated',
        });
      }

      const jobs = await jobService.getMyJobs(req.user.userId);

      res.status(200).json({
        status: 'success',
        data: jobs,
      });
    } catch (error) {
      next(error);
    }
  }

  async updateJob(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        return res.status(401).json({
          status: 'error',
          message: 'User not authenticated',
        });
      }

      const { id } = req.params;
      const data = req.body as UpdateJobDto;
      
      const job = await jobService.updateJob(id, req.user.userId, data);

      res.status(200).json({
        status: 'success',
        data: job,
      });
    } catch (error) {
      next(error);
    }
  }

  async assignJob(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        return res.status(401).json({
          status: 'error',
          message: 'User not authenticated',
        });
      }

      const { id } = req.params;
      const { transporterId, vehicleId } = req.body;
      
      const job = await jobService.assignJob(id, transporterId, vehicleId);

      res.status(200).json({
        status: 'success',
        data: job,
      });
    } catch (error) {
      next(error);
    }
  }

  async deleteJob(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        return res.status(401).json({
          status: 'error',
          message: 'User not authenticated',
        });
      }

      const { id } = req.params;
      
      await jobService.deleteJob(id, req.user.userId);

      res.status(200).json({
        status: 'success',
        message: 'Job deleted successfully',
      });
    } catch (error) {
      next(error);
    }
  }

  // Bid-related endpoints
  async createBid(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        return res.status(401).json({
          status: 'error',
          message: 'User not authenticated',
        });
      }

      const data = req.body as CreateBidDto;
      const bid = await bidService.createBid(req.user.userId, data);

      res.status(201).json({
        status: 'success',
        data: bid,
      });
    } catch (error) {
      next(error);
    }
  }

  async getBidsForJob(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        return res.status(401).json({
          status: 'error',
          message: 'User not authenticated',
        });
      }

      const { id } = req.params;
      const bids = await bidService.getBidsForJob(id, req.user.userId);

      res.status(200).json({
        status: 'success',
        data: bids,
      });
    } catch (error) {
      next(error);
    }
  }

  async getMyBids(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        return res.status(401).json({
          status: 'error',
          message: 'User not authenticated',
        });
      }

      const bids = await bidService.getMyBids(req.user.userId);

      res.status(200).json({
        status: 'success',
        data: bids,
      });
    } catch (error) {
      next(error);
    }
  }

  async acceptBid(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        return res.status(401).json({
          status: 'error',
          message: 'User not authenticated',
        });
      }

      const { bidId } = req.params;
      const bid = await bidService.acceptBid(bidId, req.user.userId);

      res.status(200).json({
        status: 'success',
        data: bid,
      });
    } catch (error) {
      next(error);
    }
  }

  async rejectBid(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        return res.status(401).json({
          status: 'error',
          message: 'User not authenticated',
        });
      }

      const { bidId } = req.params;
      const bid = await bidService.rejectBid(bidId, req.user.userId);

      res.status(200).json({
        status: 'success',
        data: bid,
      });
    } catch (error) {
      next(error);
    }
  }

  async withdrawBid(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        return res.status(401).json({
          status: 'error',
          message: 'User not authenticated',
        });
      }

      const { bidId } = req.params;
      await bidService.withdrawBid(bidId, req.user.userId);

      res.status(200).json({
        status: 'success',
        message: 'Bid withdrawn successfully',
      });
    } catch (error) {
      next(error);
    }
  }

  async updateBid(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        return res.status(401).json({
          status: 'error',
          message: 'User not authenticated',
        });
      }

      const { bidId } = req.params;
      const data = req.body;
      const bid = await bidService.updateBid(bidId, req.user.userId, data);

      res.status(200).json({
        status: 'success',
        data: bid,
      });
    } catch (error) {
      next(error);
    }
  }
} 