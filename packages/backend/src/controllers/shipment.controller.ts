import { Request, Response, NextFunction } from 'express';
import { ShipmentService } from '../services/shipment.service';
import { CreateShipmentInput, UpdateShipmentStatusInput, CreateBidInput } from '../validations/shipment.validation';
import { AppError } from '../utils/error';

const shipmentService = new ShipmentService();

export class ShipmentController {
  async createShipment(req: Request, res: Response, next: NextFunction) {
    try {
      const data = req.body as CreateShipmentInput;
      const customerId = req.user!.userId;
      
      const shipment = await shipmentService.createShipment(data, customerId);
      
      res.status(201).json({
        status: 'success',
        data: shipment,
      });
    } catch (error) {
      next(error);
    }
  }

  async getShipment(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const shipment = await shipmentService.getShipment(id);
      
      res.status(200).json({
        status: 'success',
        data: shipment,
      });
    } catch (error) {
      next(error);
    }
  }

  async updateShipmentStatus(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const data = req.body as UpdateShipmentStatusInput;
      
      const shipment = await shipmentService.updateShipmentStatus(id, data);
      
      res.status(200).json({
        status: 'success',
        data: shipment,
      });
    } catch (error) {
      next(error);
    }
  }

  async createBid(req: Request, res: Response, next: NextFunction) {
    try {
      const { shipmentId } = req.params;
      const data = req.body as CreateBidInput;
      const transporterId = req.user!.userId;
      
      const bid = await shipmentService.createBid(shipmentId, transporterId, data);
      
      res.status(201).json({
        status: 'success',
        data: bid,
      });
    } catch (error) {
      next(error);
    }
  }

  async acceptBid(req: Request, res: Response, next: NextFunction) {
    try {
      const { shipmentId, bidId } = req.params;
      const customerId = req.user!.userId;
      
      const result = await shipmentService.acceptBid(shipmentId, bidId, customerId);
      
      res.status(200).json({
        status: 'success',
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  async deleteShipment(req: Request, res: Response) {
    const { id } = req.params;
    await shipmentService.deleteShipment(id);
    res.status(204).send();
  }

  async getMyShipments(req: Request, res: Response) {
    const userId = req.user?.userId;
    if (!userId) {
      throw new AppError('Unauthorized', 401);
    }

    const shipments = await shipmentService.getCustomerShipments(userId);
    res.json(shipments);
  }

  async getAssignedShipments(req: Request, res: Response) {
    const userId = req.user?.userId;
    if (!userId) {
      throw new AppError('Unauthorized', 401);
    }

    const shipments = await shipmentService.getTransporterShipments(userId);
    res.json(shipments);
  }
} 