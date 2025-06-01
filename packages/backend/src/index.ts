import express from 'express';
import cors from 'cors';
import { PrismaClient } from '@prisma/client';
import { config } from 'dotenv';

// Import routes
import authRoutes from './routes/auth.routes';
import jobRoutes from './routes/job.routes';
import vehicleRoutes from './routes/vehicle.routes';
import notificationRoutes from './routes/notification.routes';
import dashboardRoutes from './routes/dashboard.routes';

// Legacy routes (for backward compatibility)
import shipmentRoutes from './routes/shipment.routes';
import bidRoutes from './routes/bid.routes';

// Load environment variables
config();

const app = express();
const prisma = new PrismaClient();
const port = process.env.PORT || 4000;

// Middleware
app.use(cors());
app.use(express.json());

// Enhanced API routes
app.use('/api/auth', authRoutes);
app.use('/api/jobs', jobRoutes);
app.use('/api/vehicles', vehicleRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/dashboard', dashboardRoutes);

// Legacy routes (for backward compatibility)
app.use('/api/shipments', shipmentRoutes);
app.use('/api/bids', bidRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok',
    timestamp: new Date().toISOString(),
    version: '2.0.0'
  });
});

// API info endpoint
app.get('/api', (req, res) => {
  res.json({
    name: 'GoHaul Transportation API',
    version: '2.0.0',
    description: 'Enhanced transportation services marketplace with auction-based and standard offers',
    endpoints: {
      auth: '/api/auth',
      jobs: '/api/jobs',
      vehicles: '/api/vehicles',
      notifications: '/api/notifications',
      dashboard: '/api/dashboard',
      // Legacy endpoints
      shipments: '/api/shipments (legacy)',
      bids: '/api/bids (legacy)',
    },
    features: [
      'Customer/Company/Transporter roles',
      'Standard and auction-based jobs',
      'Vehicle management',
      'Real-time notifications',
      'Competitive bidding',
      'Rating and review system'
    ]
  });
});

// Example user endpoint
app.get('/api/users', async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        companyName: true,
        rating: true,
        totalRatings: true,
        isVerified: true,
        createdAt: true,
      },
    });
    res.json({ 
      status: 'success', 
      data: users 
    });
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ 
      status: 'error', 
      message: 'Internal server error' 
    });
  }
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    status: 'error',
    message: 'Endpoint not found',
    path: req.originalUrl,
  });
});

// Error handling middleware
app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack);
  
  // Send appropriate error response
  const isDevelopment = process.env.NODE_ENV === 'development';
  
  res.status(500).json({
    status: 'error',
    message: isDevelopment ? err.message : 'Internal server error',
    ...(isDevelopment && { stack: err.stack }),
  });
});

// Graceful shutdown
process.on('SIGINT', async () => {
  console.log('\nReceived SIGINT. Shutting down gracefully...');
  await prisma.$disconnect();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  console.log('Received SIGTERM. Shutting down gracefully...');
  await prisma.$disconnect();
  process.exit(0);
});

// Start server
app.listen(port, () => {
  console.log(`🚛 GoHaul Transportation API v2.0.0`);
  console.log(`🚀 Server running at http://localhost:${port}`);
  console.log(`📚 API docs at http://localhost:${port}/api`);
  console.log(`❤️  Health check at http://localhost:${port}/api/health`);
}); 