import { Request, Response, NextFunction } from 'express';
import { BidService } from '../services/bid.service';
import { CreateBidDTO, UpdateBidDTO } from '../types/bid.types';
import { AppError } from '../utils/error';

const bidService = new BidService();

export class BidController {
  async createBid(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        throw new AppError('User not authenticated', 401);
      }
      const transporterId = req.user.userId;
      const bidData: CreateBidDTO = {
        shipmentId: req.body.shipmentId,
        price: parseFloat(req.body.price),
        eta: new Date(req.body.eta)
      };

      const bid = await bidService.createBid(transporterId, bidData);
      res.status(201).json(bid);
    } catch (error) {
      next(error);
    }
  }

  async getBidById(req: Request, res: Response, next: NextFunction) {
    try {
      const { bidId } = req.params;
      const bid = await bidService.getBidById(bidId);

      if (!bid) {
        throw new AppError('Bid not found', 404);
      }

      res.json(bid);
    } catch (error) {
      next(error);
    }
  }

  async getBidsForShipment(req: Request, res: Response, next: NextFunction) {
    try {
      const { shipmentId } = req.params;
      const bids = await bidService.getBidsForShipment(shipmentId);
      res.json(bids);
    } catch (error) {
      next(error);
    }
  }

  async getMyBids(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        throw new AppError('User not authenticated', 401);
      }
      const transporterId = req.user.userId;
      const bids = await bidService.getBidsByTransporter(transporterId);
      res.json(bids);
    } catch (error) {
      next(error);
    }
  }

  async updateBid(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        throw new AppError('User not authenticated', 401);
      }
      const { bidId } = req.params;
      const transporterId = req.user.userId;
      const updateData: UpdateBidDTO = {
        price: req.body.price ? parseFloat(req.body.price) : undefined,
        eta: req.body.eta ? new Date(req.body.eta) : undefined
      };

      const bid = await bidService.updateBid(bidId, transporterId, updateData);
      res.json(bid);
    } catch (error) {
      next(error);
    }
  }

  async acceptBid(req: Request, res: Response, next: NextFunction) {
    try {
      const { bidId } = req.params;
      if (!req.user) {
        throw new AppError('User not authenticated', 401);
      }
      const customerId = req.user.userId;

      const bid = await bidService.acceptBid(bidId, customerId);
      res.json(bid);
    } catch (error) {
      next(error);
    }
  }

  async deleteBid(req: Request, res: Response, next: NextFunction) {
    try {
      const { bidId } = req.params;
      if (!req.user) {
        throw new AppError('User not authenticated', 401);
      }
      const transporterId = req.user.userId;

      await bidService.deleteBid(bidId, transporterId);
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  }
} 