import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export interface Task {
  id: number;
  title: string;
  description: string | null;
  status: 'TODO' | 'IN_PROGRESS' | 'REVIEW' | 'COMPLETED';
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
  dueDate: string | null;
  creatorId: number;
  assigneeId: number | null;
  createdAt: string;
  updatedAt: string;
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
  status?: 'TODO' | 'IN_PROGRESS' | 'REVIEW' | 'COMPLETED';
  priority?: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
  dueDate?: string;
  assigneeId?: number;
}

export interface UpdateTaskInput {
  title?: string;
  description?: string;
  status?: 'TODO' | 'IN_PROGRESS' | 'REVIEW' | 'COMPLETED';
  priority?: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
  dueDate?: string | null;
  assigneeId?: number | null;
}

export interface TaskFilters {
  status?: 'TODO' | 'IN_PROGRESS' | 'REVIEW' | 'COMPLETED';
  priority?: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
  creatorId?: number;
  assigneeId?: number;
  sortBy?: 'dueDate' | 'priority' | 'createdAt' | 'updatedAt';
  sortOrder?: 'asc' | 'desc';
}

export interface User {
  id: number;
  name: string;
  email: string;
}

export const tasksApi = createApi({
  reducerPath: 'tasksApi',
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_API_URL || 'http://localhost:3000',
    credentials: 'include',
  }),
  tagTypes: ['Task', 'User'],
  endpoints: (builder) => ({
    getUsers: builder.query<{ success: boolean; data: User[]; count: number }, void>({
      query: () => '/api/v1/users',
      providesTags: ['User'],
    }),
    getTasks: builder.query<{ success: boolean; data: Task[]; count: number }, TaskFilters | void>({
      query: (filters) => {
        const params = new URLSearchParams();
        if (filters) {
          Object.entries(filters).forEach(([key, value]) => {
            if (value !== undefined) {
              params.append(key, String(value));
            }
          });
        }
        return {
          url: `/api/v1/tasks?${params.toString()}`,
        };
      },
      providesTags: (result) =>
        result
          ? [
              ...result.data.map(({ id }) => ({ type: 'Task' as const, id })),
              { type: 'Task', id: 'LIST' },
            ]
          : [{ type: 'Task', id: 'LIST' }],
    }),

    getTask: builder.query<{ success: boolean; data: Task }, number>({
      query: (id) => `/api/v1/tasks/${id}`,
      providesTags: (result, error, id) => [{ type: 'Task', id }],
    }),

    createTask: builder.mutation<{ success: boolean; message: string; data: Task }, CreateTaskInput>({
      query: (body) => ({
        url: '/api/v1/tasks',
        method: 'POST',
        body,
      }),
      invalidatesTags: [{ type: 'Task', id: 'LIST' }],
    }),

    updateTask: builder.mutation<
      { success: boolean; message: string; data: Task },
      { id: number; updates: UpdateTaskInput }
    >({
      query: ({ id, updates }) => ({
        url: `/api/v1/tasks/${id}`,
        method: 'PUT',
        body: updates,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'Task', id },
        { type: 'Task', id: 'LIST' },
      ],
    }),

    deleteTask: builder.mutation<{ success: boolean; message: string }, number>({
      query: (id) => ({
        url: `/api/v1/tasks/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: [{ type: 'Task', id: 'LIST' }],
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
