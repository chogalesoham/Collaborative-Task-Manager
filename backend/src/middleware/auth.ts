import { Request, Response, NextFunction } from 'express';
import { authService } from '../modules/auth/auth.service.js';

// Extend Express Request type to include userId
declare global {
  namespace Express {
    interface Request {
      userId?: number;
    }
  }
}

export const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    // Get token from cookies
    const token = req.cookies?.token;

    if (!token) {
      res.status(401).json({
        success: false,
        message: 'No token provided. Please login.',
      });
      return;
    }

    // Verify token
    const decoded = authService.verifyToken(token);

    // Attach user ID to request
    req.userId = decoded.userId;

    next();
  } catch (error) {
    res.status(401).json({
      success: false,
      message: 'Invalid or expired token. Please login again.',
    });
  }
};
