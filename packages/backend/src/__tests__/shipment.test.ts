import request from 'supertest';
import { PrismaClient } from '@prisma/client';
import { UserRole, ShipmentStatus } from '@prisma/client';
import { generateToken } from '../utils/auth';
import app from '../app';

const prisma = new PrismaClient();

describe('Shipment API', () => {
  let customerToken: string;
  let transporterToken: string;
  let customerId: string;

  beforeAll(async () => {
    // Create test users
    const customer = await prisma.user.create({
      data: {
        email: 'customer@test.com',
        password: 'hashedpassword',
        name: 'Test Customer',
        role: UserRole.CUSTOMER,
      },
    });

    const transporter = await prisma.user.create({
      data: {
        email: 'transporter@test.com',
        password: 'hashedpassword',
        name: 'Test Transporter',
        role: UserRole.TRANSPORTER,
      },
    });

    customerId = customer.id;
    customerToken = generateToken(customer);
    transporterToken = generateToken(transporter);
  });

  afterAll(async () => {
    // Clean up test data
    await prisma.shipment.deleteMany();
    await prisma.user.deleteMany();
    await prisma.$disconnect();
  });

  describe('POST /api/shipments', () => {
    it('should create a shipment when authenticated as customer', async () => {
      const shipmentData = {
        origin: 'New York',
        destination: 'Los Angeles',
        size: 'Large',
        weight: 100,
        description: 'Test shipment',
      };

      const response = await request(app)
        .post('/api/shipments')
        .set('Authorization', `Bearer ${customerToken}`)
        .send(shipmentData);

      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toMatchObject({
        ...shipmentData,
        customerId,
        status: ShipmentStatus.AWAITING_BIDS,
      });
    });

    it('should fail when not authenticated', async () => {
      const response = await request(app).post('/api/shipments').send({
        origin: 'New York',
        destination: 'Los Angeles',
        size: 'Large',
        weight: 100,
        description: 'Test shipment',
      });

      expect(response.status).toBe(401);
      expect(response.body.success).toBe(false);
    });

    it('should fail when authenticated as transporter', async () => {
      const response = await request(app)
        .post('/api/shipments')
        .set('Authorization', `Bearer ${transporterToken}`)
        .send({
          origin: 'New York',
          destination: 'Los Angeles',
          size: 'Large',
          weight: 100,
          description: 'Test shipment',
        });

      expect(response.status).toBe(403);
      expect(response.body.success).toBe(false);
    });

    it('should validate required fields', async () => {
      const response = await request(app)
        .post('/api/shipments')
        .set('Authorization', `Bearer ${customerToken}`)
        .send({
          // Missing required fields
        });

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.error).toBeDefined();
    });
  });
}); 