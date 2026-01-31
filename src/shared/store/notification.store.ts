/**
 * Shared - Store - Notifications Store
 * 
 * Notification state management
 */

import {create} from 'zustand';
import type {Notification} from 'expo-notifications';

interface NotificationState {
  // Push token
  expoPushToken: string | null;
  
  // Permission
  permissionStatus: 'undetermined' | 'denied' | 'granted' | 'provisional';
  
  // Notification history
  notifications: Notification[];
  unreadCount: number;
  
  // Actions
  setExpoPushToken: (token: string | null) => void;
  setPermissionStatus: (status: NotificationState['permissionStatus']) => void;
  addNotification: (notification: Notification) => void;
  markAsRead: (notificationId: string) => void;
  markAllAsRead: () => void;
  clearNotifications: () => void;
  removeNotification: (notificationId: string) => void;
}

export const useNotificationStore = create<NotificationState>((set, get) => ({
  expoPushToken: null,
  permissionStatus: 'undetermined',
  notifications: [],
  unreadCount: 0,

  setExpoPushToken: token => {
    set({expoPushToken: token});
  },

  setPermissionStatus: status => {
    set({permissionStatus: status});
  },

  addNotification: notification => {
    set(state => ({
      notifications: [notification, ...state.notifications].slice(0, 50), // Keep last 50
      unreadCount: state.unreadCount + 1,
    }));
  },

  markAsRead: notificationId => {
    set(state => ({
      unreadCount: Math.max(0, state.unreadCount - 1),
    }));
  },

  markAllAsRead: () => {
    set({unreadCount: 0});
  },

  clearNotifications: () => {
    set({
      notifications: [],
      unreadCount: 0,
    });
  },

  removeNotification: notificationId => {
    set(state => ({
      notifications: state.notifications.filter(
        n => n.request.identifier !== notificationId,
      ),
    }));
  },
}));

export default useNotificationStore;
