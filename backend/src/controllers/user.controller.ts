import { Request, Response, NextFunction } from 'express';
import { userRepository } from '../repositories/user.repository.js';

export class UserController {
  /**
   * GET /api/v1/users
   * Get all users (for assignee dropdown)
   */
  getAllUsers = async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const users = await userRepository.findAll();
      const userList = users.map(user => ({
        id: user.id,
        name: user.name,
        email: user.email,
      }));

      res.status(200).json({
        success: true,
        data: userList,
        count: userList.length,
      });
    } catch (error) {
      next(error);
    }
  };
}

export const userController = new UserController();
