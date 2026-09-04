// backend/src/middleware/auth.ts
import { Request, Response, NextFunction } from 'express';
import { verifyToken, UserTokenPayload } from '../utils/jwt';

export interface AuthenticatedRequest extends Request {
  user?: UserTokenPayload;
}

/**
 * Middleware to authenticate requests using Bearer JWT
 */
export const authenticate = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      success: false,
      message: 'Authentication required',
    });
  }

  const token = authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Authentication token missing',
    });
  }

  try {
    const decoded = verifyToken(token);
    req.user = decoded;
    return next();
  } catch (error: any) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: 'Token has expired',
      });
    }
    return res.status(401).json({
      success: false,
      message: 'Invalid token',
    });
  }
};

/**
 * Middleware to restrict access to users with 'admin' role only
 */
export const requireAdmin = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: 'Authentication required',
    });
  }

  if (req.user.role !== 'admin') {
    return res.status(403).json({
      success: false,
      message: 'Admin access required',
    });
  }

  return next();
};
