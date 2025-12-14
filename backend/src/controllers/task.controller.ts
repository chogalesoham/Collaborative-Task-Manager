import { Request, Response, NextFunction } from 'express';
import { taskService } from '../services/task.service.js';
import { createTaskSchema, updateTaskSchema, taskFiltersSchema } from '../modules/tasks/task.dto.js';
import { AppError } from '../middleware/errorHandler.js';

export class TaskController {
  /**
   * GET /api/v1/tasks
   * Get all tasks with optional filters
   */
  getAllTasks = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = (req as any).userId;
      
      // Validate and parse filters from query params
      const filters = taskFiltersSchema.parse(req.query);

      const tasks = await taskService.getAllTasks(filters, userId);

      res.status(200).json({
        success: true,
        data: tasks,
        count: tasks.length,
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * GET /api/v1/tasks/:id
   * Get task by ID
   */
  getTaskById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = (req as any).userId;
      const taskId = parseInt(req.params.id);

      if (isNaN(taskId)) {
        throw new AppError('Invalid task ID', 400);
      }

      const task = await taskService.getTaskById(taskId, userId);

      res.status(200).json({
        success: true,
        data: task,
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * POST /api/v1/tasks
   * Create new task
   */
  createTask = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = (req as any).userId;

      if (!userId) {
        throw new AppError('Not authenticated', 401);
      }

      // Validate request body
      const validatedData = createTaskSchema.parse(req.body);

      const task = await taskService.createTask(validatedData, userId);

      res.status(201).json({
        success: true,
        message: 'Task created successfully',
        data: task,
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * PUT /api/v1/tasks/:id
   * Update task
   */
  updateTask = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = (req as any).userId;
      const taskId = parseInt(req.params.id);

      if (!userId) {
        throw new AppError('Not authenticated', 401);
      }

      if (isNaN(taskId)) {
        throw new AppError('Invalid task ID', 400);
      }

      // Validate request body
      const validatedData = updateTaskSchema.parse(req.body);

      const task = await taskService.updateTask(taskId, validatedData, userId);

      res.status(200).json({
        success: true,
        message: 'Task updated successfully',
        data: task,
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * DELETE /api/v1/tasks/:id
   * Delete task
   */
  deleteTask = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = (req as any).userId;
      const taskId = parseInt(req.params.id);

      if (!userId) {
        throw new AppError('Not authenticated', 401);
      }

      if (isNaN(taskId)) {
        throw new AppError('Invalid task ID', 400);
      }

      await taskService.deleteTask(taskId, userId);

      res.status(200).json({
        success: true,
        message: 'Task deleted successfully',
      });
    } catch (error) {
      next(error);
    }
  };
}

export const taskController = new TaskController();
