import prisma from '../lib/prisma.js';
import { CreateTaskInput, UpdateTaskInput, TaskFilters, TaskWithRelations } from '../models/task.model.js';

export class TaskRepository {
  /**
   * Find all tasks with filters and sorting
   */
  async findAll(
    filters: TaskFilters = {},
    sortBy: string = 'createdAt',
    sortOrder: 'asc' | 'desc' = 'desc'
  ): Promise<TaskWithRelations[]> {
    const where: any = {};

    if (filters.status) where.status = filters.status;
    if (filters.priority) where.priority = filters.priority;
    if (filters.creatorId) where.creatorId = filters.creatorId;
    if (filters.assigneeId) where.assigneeId = filters.assigneeId;

    return await prisma.task.findMany({
      where,
      include: {
        creator: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        assignee: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
      orderBy: {
        [sortBy]: sortOrder,
      },
    });
  }

  /**
   * Find task by ID
   */
  async findById(id: number): Promise<TaskWithRelations | null> {
    return await prisma.task.findUnique({
      where: { id },
      include: {
        creator: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        assignee: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });
  }

  /**
   * Create new task
   */
  async create(data: CreateTaskInput, creatorId: number): Promise<TaskWithRelations> {
    return await prisma.task.create({
      data: {
        ...data,
        dueDate: data.dueDate ? new Date(data.dueDate) : null,
        creatorId,
      },
      include: {
        creator: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        assignee: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });
  }

  /**
   * Update task by ID
   */
  async update(id: number, data: UpdateTaskInput): Promise<TaskWithRelations> {
    const updateData: any = { ...data };
    
    if (data.dueDate !== undefined) {
      updateData.dueDate = data.dueDate ? new Date(data.dueDate) : null;
    }

    return await prisma.task.update({
      where: { id },
      data: updateData,
      include: {
        creator: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        assignee: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });
  }

  /**
   * Delete task by ID
   */
  async delete(id: number): Promise<void> {
    await prisma.task.delete({
      where: { id },
    });
  }

  /**
   * Check if user can modify task (creator or assignee)
   */
  async canUserModify(taskId: number, userId: number): Promise<boolean> {
    const task = await prisma.task.findUnique({
      where: { id: taskId },
      select: { creatorId: true, assigneeId: true },
    });

    if (!task) return false;
    return task.creatorId === userId || task.assigneeId === userId;
  }
}

export const taskRepository = new TaskRepository();
