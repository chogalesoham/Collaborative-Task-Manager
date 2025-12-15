import { Request, Response, NextFunction } from 'express';
import { authService } from '../services/auth.service.js';
import { registerSchema, loginSchema } from '../modules/auth/auth.dto.js';
import { updateProfileSchema } from '../modules/auth/profile.dto.js';
import { AppError } from '../middleware/errorHandler.js';

export class AuthController {
  /**
   * POST /api/v1/auth/register
   * Register a new user
   */
  register = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const validatedData = registerSchema.parse(req.body);

      const { user, token } = await authService.register(validatedData);

      // Set HttpOnly cookie to prevent XSS attacks
      res.cookie('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      });

      res.status(201).json({
        success: true,
        message: 'User registered successfully',
        user,
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * POST /api/v1/auth/login
   * Login user
   */
  login = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const validatedData = loginSchema.parse(req.body);

      const { user, token } = await authService.login(validatedData);

      res.cookie('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      });

      res.status(200).json({
        success: true,
        message: 'Login successful',
        user,
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * GET /api/v1/auth/me
   * Get current authenticated user
   */
  me = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = (req as any).userId;

      if (!userId) {
        throw new AppError('Not authenticated', 401);
      }

      const user = await authService.getUserById(userId);

      if (!user) {
        throw new AppError('User not found', 404);
      }

      res.status(200).json({
        success: true,
        user,
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * POST /api/v1/auth/logout
   * Logout user
   */
  logout = async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      res.clearCookie('token', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
      });

      res.status(200).json({
        success: true,
        message: 'Logout successful',
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * PUT /api/v1/auth/profile
   * Update user profile
   */
  updateProfile = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = (req as any).userId;

      if (!userId) {
        throw new AppError('Not authenticated', 401);
      }

      const validatedData = updateProfileSchema.parse(req.body);

      const updatedUser = await authService.updateProfile(userId, validatedData);

      res.status(200).json({
        success: true,
        message: 'Profile updated successfully',
        user: updatedUser,
      });
    } catch (error) {
      next(error);
    }
  };
}

export const authController = new AuthController();
