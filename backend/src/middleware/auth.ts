import { Request, Response, NextFunction } from 'express';
import { authService } from '../services/auth.service.js';
import { AppError } from './errorHandler.js';

// Extend Express Request type to include userId
declare global {
  namespace Express {
    interface Request {
      userId?: number;
    }
  }
}

/**
 * Authentication middleware
 * Verifies JWT token from cookies and attaches userId to request
 */
export const authMiddleware = async (
  req: Request,
  _res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    // Get token from cookies
    const token = req.cookies?.token;

    if (!token) {
      throw new AppError('No token provided. Please login.', 401);
    }

    // Verify token
    const decoded = authService.verifyToken(token);

    // Attach user ID to request
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
    const token = req.cookies?.token;

    if (token) {
      const decoded = authService.verifyToken(token);
      req.userId = decoded.userId;
    }

    next();
  } catch (error) {
    // Continue without authentication
    next();
  }
};
