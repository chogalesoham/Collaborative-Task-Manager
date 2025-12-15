import { Request, Response, NextFunction } from 'express';
import { authService } from '../services/auth.service.js';
import { AppError } from './errorHandler.js';

declare global {
  namespace Express {
    interface Request {
      userId?: number;
    }
  }
}

/**
 * Authentication middleware
 * Verifies JWT token from cookies or Authorization header and attaches userId to request
 */
export const authMiddleware = async (
  req: Request,
  _res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    // Support both cookie-based (same-origin) and header-based (cross-origin) authentication
    let token = req.cookies?.token;
    if (!token) {
      const authHeader = req.headers.authorization;
      if (authHeader && authHeader.startsWith('Bearer ')) {
        token = authHeader.substring(7);
      }
    }

    if (!token) {
      throw new AppError('No token provided. Please login.', 401);
    }

    const decoded = authService.verifyToken(token);
    req.userId = decoded.userId;

    next();
  } catch (error) {
    next(error);
  }
};

/**
 * Optional authentication middleware
 * Attaches userId to request if token exists, but doesn't throw error
 */
export const optionalAuthMiddleware = async (
  req: Request,
  _res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    let token = req.cookies?.token;
    if (!token) {
      const authHeader = req.headers.authorization;
      if (authHeader && authHeader.startsWith('Bearer ')) {
        token = authHeader.substring(7);
      }
    }

    if (token) {
      const decoded = authService.verifyToken(token);
      req.userId = decoded.userId;
    }

    next();
  } catch (error) {
    next();
  }
};
