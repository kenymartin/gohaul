import { PrismaClient, Vehicle, VehicleType, UserRole } from '@prisma/client';
import { NotFoundError, UnauthorizedError, BadRequestError } from '../utils/errors';

const prisma = new PrismaClient();

export interface CreateVehicleDto {
  type: VehicleType;
  make: string;
  model: string;
  year: number;
  licensePlate: string;
  capacity: string;
  description?: string;
  images?: string[];
}

export interface UpdateVehicleDto {
  type?: VehicleType;
  make?: string;
  model?: string;
  year?: number;
  licensePlate?: string;
  capacity?: string;
  description?: string;
  images?: string[];
  isActive?: boolean;
}

export class VehicleService {
  async createVehicle(userId: string, data: CreateVehicleDto): Promise<Vehicle> {
    // Verify user is a transporter
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user || user.role !== UserRole.TRANSPORTER) {
      throw new UnauthorizedError('Only transporters can add vehicles');
    }

    // Check if license plate is already registered
    const existingVehicle = await prisma.vehicle.findFirst({
      where: {
        licensePlate: data.licensePlate,
        isActive: true,
      },
    });

    if (existingVehicle) {
      throw new BadRequestError('Vehicle with this license plate is already registered');
    }

    return prisma.vehicle.create({
      data: {
        ...data,
        userId,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });
  }

  async getVehicleById(id: string): Promise<Vehicle | null> {
    return prisma.vehicle.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            rating: true,
            totalRatings: true,
          },
        },
        jobs: {
          where: {
            status: {
              in: ['ASSIGNED', 'IN_TRANSIT'],
            },
          },
          select: {
            id: true,
            title: true,
            status: true,
            pickupLocation: true,
            deliveryLocation: true,
          },
        },
      },
    });
  }

  async getUserVehicles(userId: string): Promise<Vehicle[]> {
    return prisma.vehicle.findMany({
      where: { userId },
      include: {
        _count: {
          select: {
            jobs: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async getActiveVehicles(userId: string): Promise<Vehicle[]> {
    return prisma.vehicle.findMany({
      where: {
        userId,
        isActive: true,
      },
      include: {
        _count: {
          select: {
            jobs: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async updateVehicle(id: string, userId: string, data: UpdateVehicleDto): Promise<Vehicle> {
    const vehicle = await this.getVehicleById(id);

    if (!vehicle) {
      throw new NotFoundError('Vehicle not found');
    }

    if (vehicle.userId !== userId) {
      throw new UnauthorizedError('You can only update your own vehicles');
    }

    // Check license plate uniqueness if being updated
    if (data.licensePlate && data.licensePlate !== vehicle.licensePlate) {
      const existingVehicle = await prisma.vehicle.findFirst({
        where: {
          licensePlate: data.licensePlate,
          isActive: true,
          id: { not: id },
        },
      });

      if (existingVehicle) {
        throw new BadRequestError('Vehicle with this license plate is already registered');
      }
    }

    return prisma.vehicle.update({
      where: { id },
      data,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });
  }

  async deleteVehicle(id: string, userId: string): Promise<void> {
    const vehicle = await this.getVehicleById(id);

    if (!vehicle) {
      throw new NotFoundError('Vehicle not found');
    }

    if (vehicle.userId !== userId) {
      throw new UnauthorizedError('You can only delete your own vehicles');
    }

    // Check if vehicle has active jobs
    const activeJobs = await prisma.job.count({
      where: {
        vehicleId: id,
        status: {
          in: ['ASSIGNED', 'IN_TRANSIT'],
        },
      },
    });

    if (activeJobs > 0) {
      throw new BadRequestError('Cannot delete vehicle with active jobs');
    }

    // Soft delete by setting isActive to false
    await prisma.vehicle.update({
      where: { id },
      data: { isActive: false },
    });
  }

  async getVehiclesByType(type: VehicleType): Promise<Vehicle[]> {
    return prisma.vehicle.findMany({
      where: {
        type,
        isActive: true,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            rating: true,
            totalRatings: true,
          },
        },
      },
      orderBy: [
        { user: { rating: 'desc' } },
        { createdAt: 'desc' },
      ],
    });
  }

  async searchVehicles(filters: {
    type?: VehicleType;
    location?: string;
    available?: boolean;
  }): Promise<Vehicle[]> {
    const where: any = {
      isActive: true,
    };

    if (filters.type) {
      where.type = filters.type;
    }

    if (filters.available) {
      // Find vehicles not currently assigned to active jobs
      const activeVehicleIds = await prisma.job.findMany({
        where: {
          status: {
            in: ['ASSIGNED', 'IN_TRANSIT'],
          },
          vehicleId: { not: null },
        },
        select: {
          vehicleId: true,
        },
      });

      const busyVehicleIds = activeVehicleIds
        .map(job => job.vehicleId)
        .filter(Boolean);

      if (busyVehicleIds.length > 0) {
        where.id = { notIn: busyVehicleIds };
      }
    }

    return prisma.vehicle.findMany({
      where,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            rating: true,
            totalRatings: true,
            address: true,
          },
        },
        _count: {
          select: {
            jobs: true,
          },
        },
      },
      orderBy: [
        { user: { rating: 'desc' } },
        { createdAt: 'desc' },
      ],
    });
  }

  async getVehicleStatistics(userId: string): Promise<{
    totalVehicles: number;
    activeVehicles: number;
    vehiclesByType: Record<VehicleType, number>;
    totalJobsCompleted: number;
  }> {
    const [vehicles, jobStats] = await Promise.all([
      prisma.vehicle.findMany({
        where: { userId },
        select: {
          type: true,
          isActive: true,
        },
      }),
      prisma.job.count({
        where: {
          transporterId: userId,
          status: 'DELIVERED',
        },
      }),
    ]);

    const vehiclesByType = vehicles.reduce((acc, vehicle) => {
      acc[vehicle.type] = (acc[vehicle.type] || 0) + 1;
      return acc;
    }, {} as Record<VehicleType, number>);

    return {
      totalVehicles: vehicles.length,
      activeVehicles: vehicles.filter(v => v.isActive).length,
      vehiclesByType,
      totalJobsCompleted: jobStats,
    };
  }
} 