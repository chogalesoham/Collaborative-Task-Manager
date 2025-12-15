import { taskRepository } from '../repositories/task.repository.js';
import { CreateTaskDto, UpdateTaskDto, TaskFiltersDto } from '../modules/tasks/task.dto.js';
import { TaskWithRelations } from '../models/task.model.js';
import { AppError } from '../middleware/errorHandler.js';
import { notificationRepository } from '../repositories/notification.repository.js';
import { NotificationType } from '@prisma/client';
import { emitTaskCreated, emitTaskAssigned, emitTaskReassigned, emitTaskUpdated, emitTaskDeleted, emitNewNotification } from '../lib/socket.js';

export class TaskService {
  /**
   * Get all tasks with filters
   */
  async getAllTasks(filters: TaskFiltersDto, _userId?: number): Promise<TaskWithRelations[]> {
    return await taskRepository.findAll(
      filters as any,
      filters.sortBy || 'createdAt',
      filters.sortOrder || 'desc'
    );
  }

  /**
   * Get task by ID
   */
  async getTaskById(id: number, _userId?: number): Promise<TaskWithRelations> {
    const task = await taskRepository.findById(id);

    if (!task) {
      throw new AppError('Task not found', 404);
    }

    return task;
  }

  /**
   * Create new task
   */
  async createTask(data: CreateTaskDto, creatorId: number): Promise<TaskWithRelations> {
    // Validate assignee exists if provided
    if (data.assigneeId) {
      const { userRepository } = await import('../repositories/user.repository.js');
      const assignee = await userRepository.findById(data.assigneeId);
      if (!assignee) {
        throw new AppError('Assignee user not found', 404);
      }
    }

    const task = await taskRepository.create(data as any, creatorId);

    // Emit real-time event
    emitTaskCreated(task);

    // Create notification if task is assigned
    if (task.assigneeId && task.assigneeId !== creatorId) {
      const notification = await notificationRepository.create({
        type: NotificationType.TASK_ASSIGNED,
        message: `You have been assigned a new task: "${task.title}"`,
        taskId: task.id,
        userId: task.assigneeId,
      });

      // Emit assignment event
      emitTaskAssigned(task.assigneeId, task);
      
      // Emit notification event
      emitNewNotification(task.assigneeId, notification);
    }

    return task;
  }

  /**
   * Update task
   */
  async updateTask(id: number, data: UpdateTaskDto, userId: number): Promise<TaskWithRelations> {
    const task = await taskRepository.findById(id);

    if (!task) {
      throw new AppError('Task not found', 404);
    }

    // Check permissions: only creator or assignee can update
    const canModify = await taskRepository.canUserModify(id, userId);
    if (!canModify) {
      throw new AppError('You do not have permission to update this task', 403);
    }

    // Validate new assignee if provided
    if (data.assigneeId !== undefined && data.assigneeId !== null) {
      const { userRepository } = await import('../repositories/user.repository.js');
      const assignee = await userRepository.findById(data.assigneeId);
      if (!assignee) {
        throw new AppError('Assignee user not found', 404);
      }
    }

    const oldAssigneeId = task.assigneeId;
    const updatedTask = await taskRepository.update(id, data as any);

    // Handle assignment changes
    if (data.assigneeId !== undefined && data.assigneeId !== oldAssigneeId) {
      // Reassignment occurred
      if (data.assigneeId) {
        // Create notification for new assignee (if not the updater)
        if (data.assigneeId !== userId) {
          const notification = await notificationRepository.create({
            type: NotificationType.TASK_ASSIGNED,
            message: `You have been assigned to task: "${updatedTask.title}"`,
            taskId: updatedTask.id,
            userId: data.assigneeId,
          });
          
          // Emit notification event
          emitNewNotification(data.assigneeId, notification);
        }

        // Emit reassignment event
        emitTaskReassigned(oldAssigneeId, data.assigneeId, updatedTask);
      } else if (oldAssigneeId) {
        // Task unassigned
        const notification = await notificationRepository.create({
          type: NotificationType.TASK_UNASSIGNED,
          message: `You have been unassigned from task: "${updatedTask.title}"`,
          taskId: updatedTask.id,
          userId: oldAssigneeId,
        });
        
        // Emit notification event
        emitNewNotification(oldAssigneeId, notification);
      }
    } else {
      // Regular update (no assignment change)
      emitTaskUpdated(updatedTask);
    }

    // Notify about task completion
    if (data.status === 'COMPLETED' && task.status !== 'COMPLETED') {
      if (task.creatorId !== userId) {
        const notification = await notificationRepository.create({
          type: NotificationType.TASK_COMPLETED,
          message: `Task completed: "${updatedTask.title}"`,
          taskId: updatedTask.id,
          userId: task.creatorId,
        });
        
        // Emit notification event
        emitNewNotification(task.creatorId, notification);
      }
    }

    return updatedTask;
  }

  /**
   * Delete task
   */
  async deleteTask(id: number, userId: number): Promise<void> {
    const task = await taskRepository.findById(id);

    if (!task) {
      throw new AppError('Task not found', 404);
    }

    // Only creator can delete
    if (task.creatorId !== userId) {
      throw new AppError('Only the task creator can delete this task', 403);
    }

    await taskRepository.delete(id);

    // Emit delete event
    emitTaskDeleted(id);
  }
}

export const taskService = new TaskService();
