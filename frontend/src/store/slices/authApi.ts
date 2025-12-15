import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import Cookies from 'js-cookie';

// Auth API Types
export interface User {
  id: number;
  email: string;
  name: string;
  createdAt: string;
  updatedAt: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface AuthResponse {
  success: boolean;
  message?: string;
  user: User;
}

export interface ErrorResponse {
  success: false;
  message: string;
  errors?: Array<{ field: string; message: string }>;
}

// Create auth API slice
export const authApi = createApi({
  reducerPath: 'authApi',
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_API_URL || 'http://localhost:3000',
    credentials: 'include',
    prepareHeaders: (headers) => {
      const token = Cookies.get('token');
      if (token) {
        headers.set('authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ['Auth'],
  endpoints: (builder) => ({
    // Register new user
    register: builder.mutation<AuthResponse, RegisterRequest>({
      query: (credentials) => ({
        url: '/api/v1/auth/register',
        method: 'POST',
        body: credentials,
      }),
      invalidatesTags: ['Auth'],
    }),

    // Login user
    login: builder.mutation<AuthResponse, LoginRequest>({
      query: (credentials) => ({
        url: '/api/v1/auth/login',
        method: 'POST',
        body: credentials,
      }),
      invalidatesTags: ['Auth'],
    }),

    // Get current user
    getMe: builder.query<AuthResponse, void>({
      query: () => '/api/v1/auth/me',
      providesTags: ['Auth'],
    }),

    // Logout user
    logout: builder.mutation<{ success: boolean; message: string }, void>({
      query: () => ({
        url: '/api/v1/auth/logout',
        method: 'POST',
      }),
      invalidatesTags: ['Auth'],
    }),

    // Update profile
    updateProfile: builder.mutation<
      AuthResponse,
      { name?: string; email?: string; currentPassword?: string; newPassword?: string }
    >({
      query: (data) => ({
        url: '/api/v1/auth/profile',
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['Auth'],
    }),
  }),
});

// Export hooks for usage in components
export const {
  useRegisterMutation,
  useLoginMutation,
  useGetMeQuery,
  useLogoutMutation,
  useUpdateProfileMutation,
} = authApi;
