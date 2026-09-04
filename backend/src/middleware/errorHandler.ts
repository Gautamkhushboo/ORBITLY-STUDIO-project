// backend/src/middleware/errorHandler.ts
import { Request, Response, NextFunction } from 'express';

/**
 * 404 Handler for undefined routes
 */
export const notFoundHandler = (req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    message: `Resource not found: ${req.method} ${req.originalUrl}`,
  });
};

/**
 * Global centralized error handler
 * Ensures consistent JSON responses and prevents stack traces or secrets leakage
 */
export const globalErrorHandler = (
  err: any,
  req: Request,
  res: Response,
  _next: NextFunction
) => {
  const statusCode = err.statusCode || err.status || 500;
  let message = err.message || 'Internal server error';

  // Handle CORS errors cleanly
  if (err.message === 'Blocked by CORS policy') {
    return res.status(403).json({
      success: false,
      message: 'Blocked by CORS policy',
    });
  }

  // Handle Mongoose / MongoDB duplicate key errors
  if (err.code === 11000) {
    const field = Object.keys(err.keyPattern || {})[0] || 'field';
    return res.status(409).json({
      success: false,
      message: `Duplicate conflict: a record with that ${field} already exists`,
    });
  }

  // Handle Mongoose CastError (invalid ObjectId)
  if (err.name === 'CastError') {
    return res.status(400).json({
      success: false,
      message: `Invalid identifier format: ${err.value}`,
    });
  }

  // Handle malformed JSON body errors from body-parser
  if (err instanceof SyntaxError && 'body' in err) {
    return res.status(400).json({
      success: false,
      message: 'Malformed JSON payload received',
    });
  }

  // In production, redact internal error messages for 500 errors
  if (statusCode === 500 && process.env.NODE_ENV === 'production') {
    message = 'An unexpected internal server error occurred';
  }

  return res.status(statusCode).json({
    success: false,
    message,
  });
};
