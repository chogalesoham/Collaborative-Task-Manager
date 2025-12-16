import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import Cookies from 'js-cookie';

export interface Notification {
  id: number;
  type: 'TASK_ASSIGNED' | 'TASK_UNASSIGNED' | 'TASK_UPDATED' | 'TASK_COMPLETED';
  message: string;
  taskId: number | null;
  isRead: boolean;
  userId: number;
  createdAt: string;
}

export const notificationsApi = createApi({
  reducerPath: 'notificationsApi',
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_API_URL ,
    credentials: 'include',
    prepareHeaders: (headers) => {
      const token = Cookies.get('token');
      if (token) {
        headers.set('authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ['Notification'],
  endpoints: (builder) => ({
    getNotifications: builder.query<{ success: boolean; data: Notification[]; count: number }, void>({
      query: () => '/api/v1/notifications',
      providesTags: (result) =>
        result
          ? [
              ...result.data.map(({ id }) => ({ type: 'Notification' as const, id })),
              { type: 'Notification', id: 'LIST' },
            ]
          : [{ type: 'Notification', id: 'LIST' }],
    }),

    getUnreadCount: builder.query<{ success: boolean; count: number }, void>({
      query: () => '/api/v1/notifications/unread-count',
      providesTags: [{ type: 'Notification', id: 'COUNT' }],
    }),

    markAsRead: builder.mutation<{ success: boolean; data: Notification }, number>({
      query: (id) => ({
        url: `/api/v1/notifications/${id}/read`,
        method: 'PATCH',
      }),
      invalidatesTags: (_result, _error, id) => [
        { type: 'Notification', id },
        { type: 'Notification', id: 'LIST' },
        { type: 'Notification', id: 'COUNT' },
      ],
    }),

    markAllAsRead: builder.mutation<{ success: boolean; message: string }, void>({
      query: () => ({
        url: '/api/v1/notifications/mark-all-read',
        method: 'PATCH',
      }),
      invalidatesTags: [
        { type: 'Notification', id: 'LIST' },
        { type: 'Notification', id: 'COUNT' },
      ],
    }),

    deleteNotification: builder.mutation<{ success: boolean; message: string }, number>({
      query: (id) => ({
        url: `/api/v1/notifications/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: [
        { type: 'Notification', id: 'LIST' },
        { type: 'Notification', id: 'COUNT' },
      ],
    }),
  }),
});

export const {
  useGetNotificationsQuery,
  useGetUnreadCountQuery,
  useMarkAsReadMutation,
  useMarkAllAsReadMutation,
  useDeleteNotificationMutation,
} = notificationsApi;
