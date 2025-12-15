import { z } from 'zod';

export const TaskStatus = z.enum(['TODO', 'IN_PROGRESS', 'REVIEW', 'COMPLETED']);
export const TaskPriority = z.enum(['LOW', 'MEDIUM', 'HIGH', 'URGENT']);

export const createTaskSchema = z.object({
  title: z.string().min(1, 'Title is required').max(100, 'Title must be less than 100 characters'),
  description: z.string().optional(),
  status: TaskStatus.optional().default('TODO'),
  priority: TaskPriority.optional().default('MEDIUM'),
  dueDate: z.string().datetime().optional().or(z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional()),
  assigneeId: z.number().int().positive().optional(),
});

export type CreateTaskDto = z.infer<typeof createTaskSchema>;

export const updateTaskSchema = z.object({
  title: z.string().min(1, 'Title is required').max(100, 'Title must be less than 100 characters').optional(),
  description: z.string().optional(),
  status: TaskStatus.optional(),
  priority: TaskPriority.optional(),
  dueDate: z.string().datetime().optional().or(z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional()).nullable(),
  assigneeId: z.number().int().positive().optional().nullable(),
});

export type UpdateTaskDto = z.infer<typeof updateTaskSchema>;

export const taskFiltersSchema = z.object({
  status: TaskStatus.optional(),
  priority: TaskPriority.optional(),
  creatorId: z.string().optional().transform((val) => val ? parseInt(val) : undefined),
  assigneeId: z.string().optional().transform((val) => val ? parseInt(val) : undefined),
  sortBy: z.enum(['dueDate', 'priority', 'createdAt', 'updatedAt']).optional().default('createdAt'),
  sortOrder: z.enum(['asc', 'desc']).optional().default('desc'),
});

export type TaskFiltersDto = z.infer<typeof taskFiltersSchema>;
