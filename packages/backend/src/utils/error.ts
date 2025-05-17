export class AppError extends Error {
  statusCode: number;
  status: string;

  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';

    Error.captureStackTrace(this, this.constructor);
  }
}

export const handleError = (err: any, res: any) => {
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      success: false,
      status: err.status,
      message: err.message
    });
  }

  // Handle Prisma errors
  if (err.code) {
    switch (err.code) {
      case 'P2002':
        return res.status(409).json({
          success: false,
          status: 'fail',
          message: 'A record with this value already exists'
        });
      case 'P2025':
        return res.status(404).json({
          success: false,
          status: 'fail',
          message: 'Record not found'
        });
      default:
        break;
    }
  }

  // Default error
  console.error('Error:', err);
  return res.status(500).json({
    success: false,
    status: 'error',
    message: 'Internal server error'
  });
}; 