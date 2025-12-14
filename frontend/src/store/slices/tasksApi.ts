import { createApi, fakeBaseQuery } from '@reduxjs/toolkit/query/react';

export interface Task {
  id: string;
  title: string;
  description: string;
  status: 'todo' | 'in-progress' | 'completed';
  priority: 'low' | 'medium' | 'high';
  dueDate: string;
  assigneeId: string;
  assigneeName: string;
  createdById: string;
  createdByName: string;
  createdAt: string;
  updatedAt: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
}

// Mock data
const mockTasks: Task[] = [
  {
    id: '1',
    title: 'Implement Login Page',
    description: 'Create a responsive login page with form validation',
    status: 'in-progress',
    priority: 'high',
    dueDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 2).toISOString(),
    assigneeId: '1',
    assigneeName: 'John Doe',
    createdById: '2',
    createdByName: 'Jane Smith',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5).toISOString(),
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
  },
  {
    id: '2',
    title: 'Design System Setup',
    description: 'Set up Tailwind CSS design system with custom colors and components',
    status: 'completed',
    priority: 'medium',
    dueDate: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
    assigneeId: '1',
    assigneeName: 'John Doe',
    createdById: '1',
    createdByName: 'John Doe',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 10).toISOString(),
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(),
  },
  {
    id: '3',
    title: 'API Integration',
    description: 'Integrate REST API endpoints for task management',
    status: 'todo',
    priority: 'high',
    dueDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3).toISOString(),
    assigneeId: '1',
    assigneeName: 'John Doe',
    createdById: '2',
    createdByName: 'Jane Smith',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7).toISOString(),
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 6).toISOString(),
  },
  {
    id: '4',
    title: 'Database Schema Design',
    description: 'Design and implement PostgreSQL database schema',
    status: 'in-progress',
    priority: 'high',
    dueDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 5).toISOString(),
    assigneeId: '2',
    assigneeName: 'Jane Smith',
    createdById: '1',
    createdByName: 'John Doe',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 8).toISOString(),
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3).toISOString(),
  },
  {
    id: '5',
    title: 'User Authentication',
    description: 'Implement JWT-based authentication system',
    status: 'todo',
    priority: 'high',
    dueDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7).toISOString(),
    assigneeId: '3',
    assigneeName: 'Bob Johnson',
    createdById: '1',
    createdByName: 'John Doe',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 6).toISOString(),
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 4).toISOString(),
  },
  {
    id: '6',
    title: 'Task Dashboard',
    description: 'Create comprehensive task dashboard with filters and sorting',
    status: 'in-progress',
    priority: 'medium',
    dueDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 10).toISOString(),
    assigneeId: '1',
    assigneeName: 'John Doe',
    createdById: '2',
    createdByName: 'Jane Smith',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 4).toISOString(),
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 12).toISOString(),
  },
  {
    id: '7',
    title: 'Write Unit Tests',
    description: 'Write comprehensive unit tests for all components',
    status: 'todo',
    priority: 'low',
    dueDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 15).toISOString(),
    assigneeId: '2',
    assigneeName: 'Jane Smith',
    createdById: '1',
    createdByName: 'John Doe',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3).toISOString(),
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(),
  },
];

const mockUsers: User[] = [
  { id: '1', name: 'John Doe', email: 'john.doe@example.com' },
  { id: '2', name: 'Jane Smith', email: 'jane.smith@example.com' },
  { id: '3', name: 'Bob Johnson', email: 'bob.johnson@example.com' },
];

export const tasksApi = createApi({
  reducerPath: 'tasksApi',
  baseQuery: fakeBaseQuery(),
  tagTypes: ['Task'],
  endpoints: (builder) => ({
    getTasks: builder.query<Task[], void>({
      queryFn: () => {
        return { data: mockTasks };
      },
      providesTags: ['Task'],
    }),
    getTask: builder.query<Task, string>({
      queryFn: (id) => {
        const task = mockTasks.find((t) => t.id === id);
        return task ? { data: task } : { error: { status: 404, data: 'Not found' } };
      },
      providesTags: ['Task'],
    }),
    getUsers: builder.query<User[], void>({
      queryFn: () => {
        return { data: mockUsers };
      },
    }),
    createTask: builder.mutation<Task, Partial<Task>>({
      queryFn: (newTask) => {
        const task: Task = {
          id: String(mockTasks.length + 1),
          title: newTask.title || '',
          description: newTask.description || '',
          status: newTask.status || 'todo',
          priority: newTask.priority || 'medium',
          dueDate: newTask.dueDate || new Date().toISOString(),
          assigneeId: newTask.assigneeId || '1',
          assigneeName: newTask.assigneeName || 'John Doe',
          createdById: '1',
          createdByName: 'John Doe',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        mockTasks.push(task);
        return { data: task };
      },
      invalidatesTags: ['Task'],
    }),
    updateTask: builder.mutation<Task, { id: string; updates: Partial<Task> }>({
      queryFn: ({ id, updates }) => {
        const taskIndex = mockTasks.findIndex((t) => t.id === id);
        if (taskIndex === -1) {
          return { error: { status: 404, data: 'Not found' } };
        }
        mockTasks[taskIndex] = {
          ...mockTasks[taskIndex],
          ...updates,
          updatedAt: new Date().toISOString(),
        };
        return { data: mockTasks[taskIndex] };
      },
      invalidatesTags: ['Task'],
    }),
    deleteTask: builder.mutation<void, string>({
      queryFn: (id) => {
        const taskIndex = mockTasks.findIndex((t) => t.id === id);
        if (taskIndex === -1) {
          return { error: { status: 404, data: 'Not found' } };
        }
        mockTasks.splice(taskIndex, 1);
        return { data: undefined };
      },
      invalidatesTags: ['Task'],
    }),
  }),
});

export const {
  useGetTasksQuery,
  useGetTaskQuery,
  useGetUsersQuery,
  useCreateTaskMutation,
  useUpdateTaskMutation,
  useDeleteTaskMutation,
} = tasksApi;
