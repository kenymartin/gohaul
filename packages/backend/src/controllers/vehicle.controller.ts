import { Request, Response, NextFunction } from 'express';
import { VehicleService, CreateVehicleDto, UpdateVehicleDto } from '../services/vehicle.service';

const vehicleService = new VehicleService();

export class VehicleController {
  async createVehicle(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        return res.status(401).json({
          status: 'error',
          message: 'User not authenticated',
        });
      }

      const data = req.body as CreateVehicleDto;
      const vehicle = await vehicleService.createVehicle(req.user.userId, data);

      res.status(201).json({
        status: 'success',
        data: vehicle,
      });
    } catch (error) {
      next(error);
    }
  }

  async getVehicleById(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const vehicle = await vehicleService.getVehicleById(id);

      if (!vehicle) {
        return res.status(404).json({
          status: 'error',
          message: 'Vehicle not found',
        });
      }

      res.status(200).json({
        status: 'success',
        data: vehicle,
      });
    } catch (error) {
      next(error);
    }
  }

  async getUserVehicles(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        return res.status(401).json({
          status: 'error',
          message: 'User not authenticated',
        });
      }

      const vehicles = await vehicleService.getUserVehicles(req.user.userId);

      res.status(200).json({
        status: 'success',
        data: vehicles,
      });
    } catch (error) {
      next(error);
    }
  }

  async getActiveVehicles(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        return res.status(401).json({
          status: 'error',
          message: 'User not authenticated',
        });
      }

      const vehicles = await vehicleService.getActiveVehicles(req.user.userId);

      res.status(200).json({
        status: 'success',
        data: vehicles,
      });
    } catch (error) {
      next(error);
    }
  }

  async updateVehicle(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        return res.status(401).json({
          status: 'error',
          message: 'User not authenticated',
        });
      }

      const { id } = req.params;
      const data = req.body as UpdateVehicleDto;
      
      const vehicle = await vehicleService.updateVehicle(id, req.user.userId, data);

      res.status(200).json({
        status: 'success',
        data: vehicle,
      });
    } catch (error) {
      next(error);
    }
  }

  async deleteVehicle(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        return res.status(401).json({
          status: 'error',
          message: 'User not authenticated',
        });
      }

      const { id } = req.params;
      
      await vehicleService.deleteVehicle(id, req.user.userId);

      res.status(200).json({
        status: 'success',
        message: 'Vehicle deleted successfully',
      });
    } catch (error) {
      next(error);
    }
  }

  async searchVehicles(req: Request, res: Response, next: NextFunction) {
    try {
      const { type, location, available } = req.query;
      
      const filters = {
        type: type as any,
        location: location as string,
        available: available === 'true',
      };

      const vehicles = await vehicleService.searchVehicles(filters);

      res.status(200).json({
        status: 'success',
        data: vehicles,
      });
    } catch (error) {
      next(error);
    }
  }

  async getVehiclesByType(req: Request, res: Response, next: NextFunction) {
    try {
      const { type } = req.params;
      const vehicles = await vehicleService.getVehiclesByType(type as any);

      res.status(200).json({
        status: 'success',
        data: vehicles,
      });
    } catch (error) {
      next(error);
    }
  }

  async getVehicleStatistics(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        return res.status(401).json({
          status: 'error',
          message: 'User not authenticated',
        });
      }

      const statistics = await vehicleService.getVehicleStatistics(req.user.userId);

      res.status(200).json({
        status: 'success',
        data: statistics,
      });
    } catch (error) {
      next(error);
    }
  }
} 