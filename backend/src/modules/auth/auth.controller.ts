import { Request, Response } from 'express';
import { authService } from './auth.service.js';
import { registerSchema, loginSchema } from './auth.dto.js';
import { updateProfileSchema } from './profile.dto.js';
import { z } from 'zod';

export class AuthController {
  async register(req: Request, res: Response): Promise<void> {
    try {
      const validatedData = registerSchema.parse(req.body);
      const result = await authService.register(validatedData);
      const token = authService.generateToken(result.user.id);

      res.cookie('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });

      res.status(201).json({
        success: true,
        message: result.message,
        user: result.user,
        token,
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({
          success: false,
          message: 'Validation error',
          errors: error.issues.map((e: z.ZodIssue) => ({
            field: e.path.join('.'),
            message: e.message,
          })),
        });
        return;
      }

      if (error instanceof Error) {
        res.status(400).json({
          success: false,
          message: error.message,
        });
        return;
      }

      res.status(500).json({
        success: false,
        message: 'Internal server error',
      });
    }
  }

  async login(req: Request, res: Response): Promise<void> {
    try {
      const validatedData = loginSchema.parse(req.body);
      const result = await authService.login(validatedData);

      res.cookie('token', result.token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });

      res.status(200).json({
        success: true,
        message: 'Login successful',
        user: result.user,
        token: result.token,
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({
          success: false,
          message: 'Validation error',
          errors: error.issues.map((e: z.ZodIssue) => ({
            field: e.path.join('.'),
            message: e.message,
          })),
        });
        return;
      }

      if (error instanceof Error) {
        res.status(401).json({
          success: false,
          message: error.message,
        });
        return;
      }

      res.status(500).json({
        success: false,
        message: 'Internal server error',
      });
    }
  }

  async me(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req as any).userId;

      if (!userId) {
        res.status(401).json({
          success: false,
          message: 'Not authenticated',
        });
        return;
      }

      const user = await authService.getUserById(userId);

      if (!user) {
        res.status(404).json({
          success: false,
          message: 'User not found',
        });
        return;
      }

      res.status(200).json({
        success: true,
        user,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Internal server error',
      });
    }
  }

  async logout(_req: Request, res: Response): Promise<void> {
    try {
      res.clearCookie('token', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
      });

      res.status(200).json({
        success: true,
        message: 'Logout successful',
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Internal server error',
      });
    }
  }

  async updateProfile(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req as any).userId;

      if (!userId) {
        res.status(401).json({
          success: false,
          message: 'Not authenticated',
        });
        return;
      }

      const validatedData = updateProfileSchema.parse(req.body);
      const updatedUser = await authService.updateProfile(userId, validatedData);

      res.status(200).json({
        success: true,
        message: 'Profile updated successfully',
        user: updatedUser,
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({
          success: false,
          message: 'Validation error',
          errors: error.issues.map((e: z.ZodIssue) => ({
            field: e.path.join('.'),
            message: e.message,
          })),
        });
        return;
      }

      if (error instanceof Error) {
        res.status(400).json({
          success: false,
          message: error.message,
        });
        return;
      }

      res.status(500).json({
        success: false,
        message: 'Internal server error',
      });
    }
  }
}

export const authController = new AuthController();
