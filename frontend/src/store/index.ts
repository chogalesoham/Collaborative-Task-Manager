import { configureStore } from '@reduxjs/toolkit';
import { tasksApi } from './slices/tasksApi';
import { authApi } from './slices/authApi';
import { notificationsApi } from './slices/notificationsApi';
import uiReducer from './slices/uiSlice';
import authReducer from './slices/authSlice';

export const store = configureStore({
  reducer: {
    [tasksApi.reducerPath]: tasksApi.reducer,
    [authApi.reducerPath]: authApi.reducer,
    [notificationsApi.reducerPath]: notificationsApi.reducer,
    ui: uiReducer,
    auth: authReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      tasksApi.middleware,
      authApi.middleware,
      notificationsApi.middleware
    ),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
