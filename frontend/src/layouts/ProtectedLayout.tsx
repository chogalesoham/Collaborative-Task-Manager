import React, { useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import Cookies from 'js-cookie';
import { Navbar } from '../components/Navbar';
import { ProtectedRoute } from '../components/ProtectedRoute';

import { initializeSocket } from '../lib/socket';
import { tasksApi } from '../store/slices/tasksApi';
import { notificationsApi } from '../store/slices/notificationsApi';
import { useAppDispatch } from '../store/hooks';

export const ProtectedLayout: React.FC = () => {
  const dispatch = useAppDispatch();
  const [showPermissionPrompt, setShowPermissionPrompt] = React.useState(false);

  React.useEffect(() => {
    // Delay permission prompt to avoid disrupting initial page load
    if ('Notification' in window && Notification.permission === 'default') {
      const timer = setTimeout(() => setShowPermissionPrompt(true), 1000);
      return () => clearTimeout(timer);
    }
  }, []);

  const requestNotificationPermission = async () => {
    try {
      const permission = await Notification.requestPermission();
      
      if (permission === 'granted') {
        setShowPermissionPrompt(false);
        
        try {
          const testNotification = new Notification('✅ Notifications Enabled!', {
            body: 'You will now receive real-time task notifications with sound.',
            icon: '/vite.svg',
            badge: '/vite.svg',
          });
          setTimeout(() => testNotification.close(), 3000);
        } catch (err) {}
      } else {
        setShowPermissionPrompt(false);
      }
    } catch (error) {
      setShowPermissionPrompt(false);
    }
  };

  const playNotificationSound = () => {
    try {
      const audio = new Audio('/sound.wav');
      audio.volume = 0.5;
      audio.play().catch(() => {});
    } catch (error) {}
  };

  const showBrowserNotification = (title: string, body: string) => {
    playNotificationSound();
    
    if (!('Notification' in window)) return;
    
    if (Notification.permission === 'granted') {
      try {
        const notification = new Notification(title, {
          body,
          icon: '/vite.svg',
          badge: '/vite.svg',
          requireInteraction: false,
          silent: false,
        });
        
        notification.onclick = () => {
          window.focus();
          notification.close();
        };
        
        setTimeout(() => notification.close(), 8000);
      } catch (error) {}
    } else if (Notification.permission === 'default') {
      setShowPermissionPrompt(true);
    }
  };

  useEffect(() => {
    const token = Cookies.get('token');
    
    // Initialize WebSocket connection with JWT for real-time updates
    if (token) {
      const socket = initializeSocket(token);

      socket.on('task:created', () => {
        dispatch(tasksApi.util.invalidateTags(['Task']));
      });

      socket.on('task:updated', () => {
        dispatch(tasksApi.util.invalidateTags(['Task']));
      });

      socket.on('task:deleted', () => {
        dispatch(tasksApi.util.invalidateTags(['Task']));
      });

      socket.on('task:assigned', (data: any) => {
        dispatch(tasksApi.util.invalidateTags(['Task']));
        dispatch(notificationsApi.util.invalidateTags(['Notification']));
        
        const taskTitle = data.task?.title || data.taskTitle || 'New task';
        showBrowserNotification(
          '📋 New Task Assigned',
          `You have been assigned: ${taskTitle}`
        );
      });

      socket.on('task:reassigned', (data: any) => {
        dispatch(tasksApi.util.invalidateTags(['Task']));
        dispatch(notificationsApi.util.invalidateTags(['Notification']));
        
        const taskTitle = data.task?.title || data.taskTitle || 'Task';
        showBrowserNotification(
          '🔄 Task Reassigned',
          `You have been assigned: ${taskTitle}`
        );
      });

      socket.on('task:unassigned', () => {
        dispatch(tasksApi.util.invalidateTags(['Task']));
        dispatch(notificationsApi.util.invalidateTags(['Notification']));
      });

      socket.on('notification:new', (notification: any) => {
        dispatch(notificationsApi.util.invalidateTags(['Notification']));
        showBrowserNotification(
          '🔔 New Notification',
          notification.message || 'You have a new notification'
        );
      });

      if (!socket.connected) {
        socket.connect();
      }

      if ('Notification' in window && Notification.permission === 'default') {
        Notification.requestPermission();
      }

      return () => {
        socket.off('task:created');
        socket.off('task:updated');
        socket.off('task:deleted');
        socket.off('task:assigned');
        socket.off('task:reassigned');
        socket.off('task:unassigned');
        socket.off('notification:new');
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
        
        {/* Notification Permission Prompt - ENHANCED */}
        {showPermissionPrompt && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
            <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl shadow-2xl p-8 max-w-md w-full animate-pulse">
              <div className="text-center">
                <div className="mb-4">
                  <span className="text-7xl">🔔</span>
                </div>
                <h2 className="text-2xl font-bold text-white mb-3">
                  Enable Desktop Notifications
                </h2>
                <p className="text-blue-100 mb-6 text-base">
                  Get instant alerts with sound when you're assigned new tasks. 
                  Never miss an important update!
                </p>
                <div className="space-y-3">
                  <button
                    onClick={requestNotificationPermission}
                    className="w-full bg-white text-blue-600 text-base font-bold px-6 py-4 rounded-xl hover:bg-blue-50 transition-all transform hover:scale-105 shadow-lg"
                  >
                    ✅ Yes, Enable Notifications
                  </button>
                  <button
                    onClick={() => setShowPermissionPrompt(false)}
                    className="w-full bg-blue-700 bg-opacity-50 text-white text-sm font-medium px-6 py-3 rounded-xl hover:bg-opacity-70 transition-colors"
                  >
                    Maybe Later
                  </button>
                </div>
                <p className="text-blue-200 text-xs mt-4">
                  🔊 Sound notifications will work even if you skip this
                </p>
              </div>
            </div>
          </div>
        )}

      </div>
    </ProtectedRoute>
  );
};
