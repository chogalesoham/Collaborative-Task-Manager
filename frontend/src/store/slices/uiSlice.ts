import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

interface Notification {
  id: string;
  message: string;
  type: 'assignment' | 'update' | 'comment';
  read: boolean;
  timestamp: string;
  taskId?: string;
}

interface UiState {
  notifications: Notification[];
  isNotificationOpen: boolean;
  currentUser: {
    id: string;
    name: string;
    email: string;
    avatar?: string;
  } | null;
}

const initialState: UiState = {
  notifications: [
    {
      id: '1',
      message: 'You were assigned to "Implement Login Page"',
      type: 'assignment',
      read: false,
      timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
      taskId: '1',
    },
    {
      id: '2',
      message: 'Task "Design System Setup" was updated',
      type: 'update',
      read: false,
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
      taskId: '2',
    },
    {
      id: '3',
      message: 'You were assigned to "API Integration"',
      type: 'assignment',
      read: true,
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
      taskId: '3',
    },
  ],
  isNotificationOpen: false,
  currentUser: {
    id: '1',
    name: 'John Doe',
    email: 'john.doe@example.com',
    avatar: undefined,
  },
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    toggleNotifications: (state) => {
      state.isNotificationOpen = !state.isNotificationOpen;
    },
    closeNotifications: (state) => {
      state.isNotificationOpen = false;
    },
    markNotificationAsRead: (state, action: PayloadAction<string>) => {
      const notification = state.notifications.find((n) => n.id === action.payload);
      if (notification) {
        notification.read = true;
      }
    },
    markAllNotificationsAsRead: (state) => {
      state.notifications.forEach((n) => {
        n.read = true;
      });
    },
  },
});

export const {
  toggleNotifications,
  closeNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
} = uiSlice.actions;

export default uiSlice.reducer;
