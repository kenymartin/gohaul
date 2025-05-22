import express from 'express';
import cors from 'cors';
import { handleError } from './utils/error';
import userRoutes from './routes/user.routes';
import shipmentRoutes from './routes/shipment.routes';
import bidRoutes from './routes/bid.routes';
import trackingRoutes from './routes/tracking.routes';
import messageRoutes from './routes/message.routes';

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/users', userRoutes);
app.use('/api/shipments', shipmentRoutes);
app.use('/api/bids', bidRoutes);
app.use('/api/tracking', trackingRoutes);
app.use('/api/messages', messageRoutes);

// Error handling
app.use(handleError);

export default app; 