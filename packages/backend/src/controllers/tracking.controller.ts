import { Request, Response, NextFunction } from 'express';
import { TrackingService } from '../services/tracking.service';
import { CreateTrackingDTO, UpdateTrackingDTO } from '../types/tracking.types';
import { AppError } from '../utils/error';

const trackingService = new TrackingService();

export class TrackingController {
  async createTracking(req: Request, res: Response, next: NextFunction) {
    try {
      const { shipmentId } = req.params;
      const transporterId = req.user!.userId;
      const data = req.body;
      
      const tracking = await trackingService.createTracking(
        shipmentId,
        transporterId,
        data
      );
      
      res.status(201).json({
        status: 'success',
        data: tracking,
      });
    } catch (error) {
      next(error);
    }
  }

  async getTracking(req: Request, res: Response) {
    const { id } = req.params;
    const tracking = await trackingService.getTrackingById(id);
    res.json(tracking);
  }

  async updateTracking(req: Request, res: Response) {
    const { id } = req.params;
    const trackingData: UpdateTrackingDTO = req.body;
    const tracking = await trackingService.updateTracking(id, trackingData);
    res.json(tracking);
  }

  async deleteTracking(req: Request, res: Response) {
    const { id } = req.params;
    await trackingService.deleteTracking(id);
    res.status(204).send();
  }

  async getShipmentTrackings(req: Request, res: Response) {
    const { shipmentId } = req.params;
    const trackings = await trackingService.getShipmentTrackings(shipmentId);
    res.json(trackings);
  }

  async getShipmentTracking(req: Request, res: Response, next: NextFunction) {
    try {
      const { shipmentId } = req.params;
      const tracking = await trackingService.getShipmentTracking(shipmentId);
      
      res.status(200).json({
        status: 'success',
        data: tracking,
      });
    } catch (error) {
      next(error);
    }
  }
} 