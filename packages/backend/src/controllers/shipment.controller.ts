import { Request, Response } from 'express';
import { ShipmentService } from '../services/shipment.service';
import { CreateShipmentDTO, UpdateShipmentDTO } from '../types/shipment.types';
import { AppError } from '../utils/error';

const shipmentService = new ShipmentService();

export class ShipmentController {
  async createShipment(req: Request, res: Response) {
    const shipmentData: CreateShipmentDTO = {
      ...req.body,
      customerId: req.user?.userId
    };
    const shipment = await shipmentService.createShipment(shipmentData);
    res.status(201).json(shipment);
  }

  async getShipment(req: Request, res: Response) {
    const { id } = req.params;
    const shipment = await shipmentService.getShipmentById(id);
    res.json(shipment);
  }

  async updateShipment(req: Request, res: Response) {
    const { id } = req.params;
    const shipmentData: UpdateShipmentDTO = req.body;
    const shipment = await shipmentService.updateShipment(id, shipmentData);
    res.json(shipment);
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

  async updateStatus(req: Request, res: Response) {
    const { id } = req.params;
    const { status } = req.body;
    const shipment = await shipmentService.updateShipmentStatus(id, status);
    res.json(shipment);
  }
} 