import React, { useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import Cookies from 'js-cookie';
import { Navbar } from '../components/Navbar';
import { ProtectedRoute } from '../components/ProtectedRoute';
import { initializeSocket, getSocket, disconnectSocket } from '../lib/socket';
import { tasksApi } from '../store/slices/tasksApi';
import { notificationsApi } from '../store/slices/notificationsApi';
import { useAppDispatch } from '../store/hooks';

export const ProtectedLayout: React.FC = () => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    const token = Cookies.get('token');
    
    if (token) {
      // Initialize Socket.io
      const socket = initializeSocket(token);

      // Listen for real-time task events
      socket.on('task:created', (data: any) => {
        console.log('📥 Received task:created', data);
        dispatch(tasksApi.util.invalidateTags(['Task']));
      });

      socket.on('task:updated', (data: any) => {
        console.log('📥 Received task:updated', data);
        dispatch(tasksApi.util.invalidateTags(['Task']));
      });

      socket.on('task:deleted', (data: any) => {
        console.log('📥 Received task:deleted', data);
        dispatch(tasksApi.util.invalidateTags(['Task']));
      });

      socket.on('task:assigned', (data: any) => {
        console.log('📥 Received task:assigned', data);
        // Refresh both tasks and notifications
        dispatch(tasksApi.util.invalidateTags(['Task']));
        dispatch(notificationsApi.util.invalidateTags(['Notification']));
        
        // Show browser notification
        if (Notification.permission === 'granted') {
          new Notification('New Task Assigned', {
            body: data.task?.title ? `You've been assigned: ${data.task.title}` : 'New task assigned to you',
            icon: '/vite.svg',
          });
        }
      });

      socket.on('task:reassigned', (data: any) => {
        console.log('📥 Received task:reassigned', data);
        // Refresh both tasks and notifications
        dispatch(tasksApi.util.invalidateTags(['Task']));
        dispatch(notificationsApi.util.invalidateTags(['Notification']));
        
        // Show browser notification
        if (Notification.permission === 'granted' && data.newAssigneeId) {
          new Notification('Task Reassigned', {
            body: data.task?.title ? `You've been assigned: ${data.task.title}` : 'Task reassigned to you',
            icon: '/vite.svg',
          });
        }
      });

      socket.on('task:unassigned', (data: any) => {
        console.log('📥 Received task:unassigned', data);
        dispatch(tasksApi.util.invalidateTags(['Task']));
        dispatch(notificationsApi.util.invalidateTags(['Notification']));
      });

      // Listen for new notifications
      socket.on('notification:new', (notification: any) => {
        console.log('📥 Received notification:new', notification);
        // Refresh notifications in UI
        dispatch(notificationsApi.util.invalidateTags(['Notification']));
        
        // Play notification sound or show toast
        if (Notification.permission === 'granted') {
          new Notification('New Notification', {
            body: notification.message,
            icon: '/vite.svg',
          });
        }
      });

      // Request notification permission
      if (Notification.permission === 'default') {
        Notification.requestPermission();
      }

      // Cleanup on unmount
      return () => {
        disconnectSocket();
      };
    }
  }, [dispatch]);

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <main>
          <Outlet />
        </main>
      </div>
    </ProtectedRoute>
  );
};
