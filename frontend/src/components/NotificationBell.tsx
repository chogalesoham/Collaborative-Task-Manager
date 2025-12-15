import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppSelector } from '../store/hooks';
import {
  useGetNotificationsQuery,
  useGetUnreadCountQuery,
  useMarkAsReadMutation,
  useMarkAllAsReadMutation,
  useDeleteNotificationMutation,
  type Notification,
} from '../store/slices/notificationsApi';

export const NotificationBell = () => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);

  // Poll notifications every 30s as fallback (WebSocket is primary mechanism)
  const { data: notificationsData, refetch, isLoading } = useGetNotificationsQuery(undefined, {
    pollingInterval: 30000,
    refetchOnMountOrArgChange: true,
    skip: !isAuthenticated,
  });
  const { data: unreadData, refetch: refetchCount } = useGetUnreadCountQuery(undefined, {
    pollingInterval: 30000,
    refetchOnMountOrArgChange: true,
    skip: !isAuthenticated,
  });
  const [markAsRead] = useMarkAsReadMutation();
  const [markAllAsRead] = useMarkAllAsReadMutation();
  const [deleteNotification] = useDeleteNotificationMutation();

  const notifications = notificationsData?.data || [];
  const unreadCount = unreadData?.count || 0;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleNotificationClick = async (notification: Notification) => {
    // Mark as read before navigation for better UX
    if (!notification.isRead) {
      await markAsRead(notification.id);
    }

    if (notification.taskId) {
      navigate(`/tasks/${notification.taskId}`);
      setIsOpen(false);
    }
  };

  const handleMarkAllAsRead = async () => {
    await markAllAsRead();
    refetch();
    refetchCount();
  };

  const handleDelete = async (e: React.MouseEvent, notificationId: number) => {
    e.stopPropagation();
    await deleteNotification(notificationId);
    refetch();
    refetchCount();
  };

  const getNotificationIcon = (type: Notification['type']) => {
    switch (type) {
      case 'TASK_ASSIGNED':
        return '📋';
      case 'TASK_UNASSIGNED':
        return '❌';
      case 'TASK_UPDATED':
        return '✏️';
      case 'TASK_COMPLETED':
        return '✅';
      default:
        return '🔔';
    }
  };

  const getTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (seconds < 60) return 'Just now';
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
    if (seconds < 604800) return `${Math.floor(seconds / 86400)}d ago`;
    return date.toLocaleDateString();
  };

  return (
    <div className="notification-bell-container" ref={dropdownRef}>
      <button
        className="notification-bell-button"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Notifications"
        disabled={isLoading}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
          <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
        </svg>
        {unreadCount > 0 && <span className="notification-badge">{unreadCount}</span>}
      </button>

      {isOpen && (
        <div className="notification-dropdown">
          <div className="notification-header">
            <h3>Notifications</h3>
            {notifications.length > 0 && (
              <button className="mark-all-read-btn" onClick={handleMarkAllAsRead}>
                Mark all read
              </button>
            )}
          </div>

          <div className="notification-list">
            {notifications.length === 0 ? (
              <div className="no-notifications">
                <p>No notifications yet</p>
              </div>
            ) : (
              notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`notification-item ${notification.isRead ? 'read' : 'unread'}`}
                  onClick={() => handleNotificationClick(notification)}
                >
                  <div className="notification-icon">
                    {getNotificationIcon(notification.type)}
                  </div>
                  <div className="notification-content">
                    <p className="notification-message">{notification.message}</p>
                    <span className="notification-time">{getTimeAgo(notification.createdAt)}</span>
                  </div>
                  <button
                    className="delete-notification-btn"
                    onClick={(e) => handleDelete(e, notification.id)}
                    aria-label="Delete notification"
                  >
                    ×
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      <style>{`
        .notification-bell-container {
          position: relative;
        }

        .notification-bell-button {
          position: relative;
          background: none;
          border: none;
          cursor: pointer;
          padding: 8px;
          color: #333;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 50%;
          transition: background-color 0.2s;
        }

        .notification-bell-button:hover {
          background-color: #f0f0f0;
        }

        .notification-badge {
          position: absolute;
          top: 4px;
          right: 4px;
          background-color: #ef4444;
          color: white;
          border-radius: 10px;
          padding: 2px 6px;
          font-size: 11px;
          font-weight: 600;
          min-width: 18px;
          text-align: center;
        }

        .notification-dropdown {
          position: absolute;
          top: 100%;
          right: 0;
          margin-top: 8px;
          width: 380px;
          max-height: 500px;
          background: white;
          border-radius: 12px;
          box-shadow: 0 10px 40px rgba(0, 0, 0, 0.15);
          z-index: 1000;
          display: flex;
          flex-direction: column;
          overflow: hidden;
        }

        .notification-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 16px 20px;
          border-bottom: 1px solid #e5e5e5;
        }

        .notification-header h3 {
          margin: 0;
          font-size: 18px;
          font-weight: 600;
          color: #1f2937;
        }

        .mark-all-read-btn {
          background: none;
          border: none;
          color: #3b82f6;
          font-size: 14px;
          cursor: pointer;
          padding: 4px 8px;
          border-radius: 4px;
          transition: background-color 0.2s;
        }

        .mark-all-read-btn:hover {
          background-color: #eff6ff;
        }

        .notification-list {
          overflow-y: auto;
          max-height: 420px;
        }

        .no-notifications {
          padding: 60px 20px;
          text-align: center;
          color: #9ca3af;
        }

        .notification-item {
          display: flex;
          align-items: flex-start;
          padding: 16px 20px;
          border-bottom: 1px solid #f3f4f6;
          cursor: pointer;
          transition: background-color 0.2s;
          gap: 12px;
        }

        .notification-item:hover {
          background-color: #f9fafb;
        }

        .notification-item.unread {
          background-color: #eff6ff;
        }

        .notification-item.unread:hover {
          background-color: #dbeafe;
        }

        .notification-icon {
          font-size: 24px;
          flex-shrink: 0;
        }

        .notification-content {
          flex: 1;
          min-width: 0;
        }

        .notification-message {
          margin: 0 0 4px 0;
          font-size: 14px;
          color: #1f2937;
          line-height: 1.5;
        }

        .notification-time {
          font-size: 12px;
          color: #6b7280;
        }

        .delete-notification-btn {
          background: none;
          border: none;
          color: #9ca3af;
          font-size: 24px;
          cursor: pointer;
          padding: 0;
          width: 24px;
          height: 24px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 4px;
          transition: all 0.2s;
          flex-shrink: 0;
        }

        .delete-notification-btn:hover {
          background-color: #fee2e2;
          color: #ef4444;
        }

        @media (max-width: 640px) {
          .notification-dropdown {
            width: 100vw;
            max-width: 380px;
            right: -16px;
          }
        }
      `}</style>
    </div>
  );
};
