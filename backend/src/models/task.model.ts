import { Task as PrismaTask, TaskStatus as PrismaTaskStatus, TaskPriority as PrismaTaskPriority } from '@prisma/client';

export type TaskStatus = PrismaTaskStatus;
export const TaskStatus = PrismaTaskStatus;

export type TaskPriority = PrismaTaskPriority;
export const TaskPriority = PrismaTaskPriority;

export type Task = PrismaTask;

export interface TaskWithRelations extends PrismaTask {
  creator: {
    id: number;
    name: string;
    email: string;
  };
  assignee: {
    id: number;
    name: string;
    email: string;
  } | null;
}

export interface CreateTaskInput {
  title: string;
  description?: string;
  status?: TaskStatus;
  priority?: TaskPriority;
  dueDate?: Date | string;
  assigneeId?: number;
}

export interface UpdateTaskInput {
  title?: string;
  description?: string;
  status?: TaskStatus;
  priority?: TaskPriority;
  dueDate?: Date | string;
  assigneeId?: number;
}

export interface TaskFilters {
  status?: TaskStatus;
  priority?: TaskPriority;
  creatorId?: number;
  assigneeId?: number;
}
