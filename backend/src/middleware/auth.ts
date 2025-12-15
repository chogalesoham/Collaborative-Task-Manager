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
 * Verifies JWT token from cookies or Authorization header and attaches userId to request
 */
export const authMiddleware = async (
  req: Request,
  _res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    // Get token from cookies or Authorization header
    let token = req.cookies?.token;
    
    // If no token in cookies, check Authorization header
    if (!token) {
      const authHeader = req.headers.authorization;
      if (authHeader && authHeader.startsWith('Bearer ')) {
        token = authHeader.substring(7);
      }
    }

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
    // Get token from cookies or Authorization header
    let token = req.cookies?.token;
    
    // If no token in cookies, check Authorization header
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
    // Continue without authentication
    next();
  }
};
