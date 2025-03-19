'use client';

import { createContext, PropsWithChildren, useContext, useState } from 'react';

export type NotificationPartialType = {
  type: 'success' | 'error';
  message: string;
};

export type NotificationType = NotificationPartialType & {
  id: string;
};

type NotificationsContextType = {
  addNotification: (notification: NotificationPartialType) => void;
  removeNotification: (id: string) => void;
  notifications: NotificationType[];
  setLoading: (loading: boolean) => void;
  loading: boolean;
  setLoadingMessage: (message: string) => void;
  loadingMessage: string;
};

type NotificationsProviderProps = PropsWithChildren<object>;

export const NotificationsContext = createContext(
  {} as NotificationsContextType
);

export const NotificationsContextProvider = ({
  children,
}: NotificationsProviderProps) => {
  const [loading, setLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState('');
  const [notifications, setNotifications] = useState<NotificationType[]>([]);

  const addNotification = (notification: NotificationType) => {
    const id = Math.random().toString(36);
    setNotifications((prevNotifications) => [
      ...prevNotifications,
      { ...notification, id },
    ]);
    setTimeout(() => removeNotification(id), 5000);
  };

  const removeNotification = (id: string) => {
    setNotifications(notifications.filter((notif) => notif.id !== id));
  };

  const contextValue = {
    addNotification,
    removeNotification,
    notifications,
    setLoading,
    loading,
    setLoadingMessage,
    loadingMessage,
  };
  return (
    <NotificationsContext.Provider value={contextValue}>
      {children}
    </NotificationsContext.Provider>
  );
};

export const useNotifications = () => useContext(NotificationsContext);
