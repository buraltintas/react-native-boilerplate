/**
 * Shared - Hooks - useNotifications
 * 
 * Notification management hooks
 */

import {useEffect, useCallback} from 'react';
import {useNavigation} from '@react-navigation/native';
import {notificationService} from '@infra/notifications';
import {useNotificationStore} from '@shared/store/notification.store';
import {useQueryClient} from '@tanstack/react-query';
import type {Notification, NotificationResponse} from 'expo-notifications';
import type {LocalNotificationConfig, NotificationData} from '@infra/notifications';

/**
 * Hook for managing push notifications
 */
export function useNotifications() {
  const {
    expoPushToken,
    permissionStatus,
    unreadCount,
    setExpoPushToken,
    setPermissionStatus,
  } = useNotificationStore();

  const requestPermissions = useCallback(async () => {
    const granted = await notificationService.requestPermissions();
    setPermissionStatus(granted ? 'granted' : 'denied');
    return granted;
  }, [setPermissionStatus]);

  const getToken = useCallback(async () => {
    const token = await notificationService.getExpoPushToken();
    setExpoPushToken(token);
    return token;
  }, [setExpoPushToken]);

  const scheduleNotification = useCallback(
    async (config: LocalNotificationConfig, delaySeconds?: number) => {
      return await notificationService.scheduleNotification(config, delaySeconds);
    },
    [],
  );

  const setBadge = useCallback(async (count: number) => {
    await notificationService.setBadgeCount(count);
  }, []);

  const clearBadge = useCallback(async () => {
    await notificationService.clearBadge();
  }, []);

  return {
    expoPushToken,
    permissionStatus,
    unreadCount,
    requestPermissions,
    getToken,
    scheduleNotification,
    setBadge,
    clearBadge,
  };
}

/**
 * Hook for handling notification events
 */
export function useNotificationHandlers() {
  const navigation = useNavigation();
  const queryClient = useQueryClient();
  const {addNotification} = useNotificationStore();

  useEffect(() => {
    // Initialize notification service
    notificationService.initialize();

    // Handle foreground notifications
    const foregroundSub = notificationService.onNotificationReceived(
      (notification: Notification) => {
        console.log('[Notifications] Received in foreground:', notification);
        
        // Add to store
        addNotification(notification);
        
        // Invalidate relevant queries
        const data = notification.request.content.data as NotificationData;
        if (data.category) {
          // You can invalidate specific queries based on notification category
          // Example: queryClient.invalidateQueries({queryKey: [data.category]});
        }
      },
    );

    // Handle notification tap (background/closed)
    const responseSub = notificationService.onNotificationResponse(
      (response: NotificationResponse) => {
        console.log('[Notifications] Tapped:', response);
        
        const data = response.notification.request.content.data as NotificationData;
        
        // Navigate to screen if specified
        if (data.screen) {
          navigation.navigate(data.screen as never, data.params as never);
        }
      },
    );

    // Check if app was opened by notification
    notificationService.getLastNotificationResponse().then(response => {
      if (response) {
        const data = response.notification.request.content.data as NotificationData;
        if (data.screen) {
          // Small delay to ensure navigation is ready
          setTimeout(() => {
            navigation.navigate(data.screen as never, data.params as never);
          }, 500);
        }
      }
    });

    return () => {
      foregroundSub.remove();
      responseSub.remove();
    };
  }, [navigation, queryClient, addNotification]);
}

/**
 * Hook for auto-initializing notifications on app start
 */
export function useNotificationSetup() {
  const {setExpoPushToken, setPermissionStatus} = useNotificationStore();

  useEffect(() => {
    const setup = async () => {
      // Initialize
      await notificationService.initialize();

      // Check permission
      const settings = await notificationService.getSettings();
      setPermissionStatus(settings.permission as any);

      // Get token if permission granted
      if (settings.permission === 'granted') {
        const token = await notificationService.getExpoPushToken();
        setExpoPushToken(token);
      }
    };

    setup();
  }, [setExpoPushToken, setPermissionStatus]);

  useNotificationHandlers();
}

export default {
  useNotifications,
  useNotificationHandlers,
  useNotificationSetup,
};
