import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import { handleError } from './utils/error';
import bidRoutes from './routes/bid.routes';
import authRoutes from './routes/auth.routes';
import shipmentRoutes from './routes/shipment.routes';

const app = express();

// Middleware
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/v1/bids', bidRoutes);
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/shipments', shipmentRoutes);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Error handling
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  handleError(err, res);
});

export default app; 