import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { errorHandler } from './middleware/error.middleware';
import authRoutes from './routes/auth.routes';
import shipmentRoutes from './routes/shipment.routes';
import trackingRoutes from './routes/tracking.routes';
import messageRoutes from './routes/message.routes';

const app = express();

// Middleware
app.use(helmet());
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/shipments', shipmentRoutes);
app.use('/api', trackingRoutes);
app.use('/api', messageRoutes);

// Error handling
app.use(errorHandler);

export default app; 