'use client';

import {
  NotificationType,
  useNotifications,
} from '@/context/notificationsContext';
import { createPortal } from 'react-dom';
import { useEffect, useState } from 'react';

export const Notifications = () => {
  const { notifications, removeNotification } = useNotifications();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) return null;

  return createPortal(
    <div className="fixed top-4 left-4 z-[9999] flex flex-col gap-3">
      {notifications.map((notification: NotificationType) => (
        <div
          key={notification.id}
          className={`alert shadow-lg w-80 flex items-center animate-slide-in ${
            notification.type === 'success' ? 'alert-success' : 'alert-error'
          }`}
        >
          <span className="flex-1">{notification.message}</span>
          <button
            onClick={() => removeNotification(notification.id)}
            className="btn btn-sm btn-circle btn-ghost"
          >
            ✕
          </button>
        </div>
      ))}
    </div>,
    document.body
  );
};
