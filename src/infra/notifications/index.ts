/**
 * Infra - Notifications - Service
 * 
 * Push notifications management
 * Gracefully degrades in Expo Go
 */

import {Platform} from 'react-native';

// Lazy imports to avoid Expo Go crashes
let Notifications: any = null;
let Constants: any = null;
let setupNotificationChannels: any = null;
let getChannelId: any = null;

try {
  Notifications = require('expo-notifications');
  Constants = require('expo-constants').default;
  const channels = require('./channels');
  setupNotificationChannels = channels.setupNotificationChannels;
  getChannelId = channels.getChannelId;
} catch (error) {
  console.warn('[Notifications] Module not available (Expo Go)');
}

import analytics from '@infra/analytics';
import type {
  LocalNotificationConfig,
  NotificationData,
  NotificationCategory,
  NotificationSettings,
} from './types';

class NotificationService {
  private expoPushToken: string | null = null;
  private isInitialized = false;
  private handlerConfigured = false;
  private isAvailable = false;

  constructor() {
    this.isAvailable = Notifications !== null;
  }

  /**
   * Configure notification handler (called once)
   */
  private configureHandler() {
    if (!this.isAvailable || this.handlerConfigured) return;
    
    try {
      Notifications.setNotificationHandler({
        handleNotification: async () => {
          return {
            shouldShowAlert: true,
            shouldPlaySound: true,
            shouldSetBadge: true,
            priority: Notifications.AndroidNotificationPriority.HIGH,
          };
        },
      });
      this.handlerConfigured = true;
    } catch (error) {
      console.warn('[Notifications] Handler configuration failed');
    }
  }

  /**
   * Initialize notification service
   */
  async initialize() {
    if (!this.isAvailable) {
      console.log('[Notifications] Not available in Expo Go');
      return;
    }

    if (this.isInitialized) {
      return;
    }

    try {
      // Configure handler
      this.configureHandler();

      // Setup Android channels
      if (setupNotificationChannels) {
        try {
          await setupNotificationChannels();
        } catch (error) {
          console.warn('[Notifications] Channels setup failed');
        }
      }

      // Get permission status
      try {
        const settings = await this.getSettings();
        
        console.log('[Notifications] Initialized', {
          permission: settings.permission,
        });
      } catch (error) {
        console.warn('[Notifications] Permission check failed');
      }

      this.isInitialized = true;
    } catch (error) {
      console.error('[Notifications] Initialization error:', error);
    }
  }

  /**
   * Get current notification settings
   */
  async getSettings(): Promise<NotificationSettings> {
    if (!this.isAvailable) {
      throw new Error('Notifications not available');
    }

    const {status, ios, android} = await Notifications.getPermissionsAsync();

    return {
      status,
      permission: status === 'granted',
      ios: ios || {},
      android: android || {},
    };
  }

  /**
   * Request notification permissions
   */
  async requestPermissions(): Promise<boolean> {
    if (!this.isAvailable) {
      console.warn('[Notifications] Not available in Expo Go');
      return false;
    }

    try {
      const {status} = await Notifications.requestPermissionsAsync();
      
      analytics.logEvent({
        name: 'notification_permission_requested',
        params: {status},
      });

      return status === 'granted';
    } catch (error) {
      console.error('[Notifications] Permission request failed:', error);
      return false;
    }
  }

  /**
   * Get Expo push token
   */
  async getExpoPushToken(): Promise<string | null> {
    if (!this.isAvailable) {
      console.warn('[Notifications] Not available in Expo Go');
      return null;
    }

    if (this.expoPushToken) {
      return this.expoPushToken;
    }

    try {
      const {data} = await Notifications.getExpoPushTokenAsync({
        projectId: Constants?.expoConfig?.extra?.eas?.projectId,
      });

      this.expoPushToken = data;

      analytics.logEvent({
        name: 'push_token_obtained',
        params: {projectId: Constants?.expoConfig?.extra?.eas?.projectId || 'unknown'},
      });

      return data;
    } catch (error) {
      console.error('[Notifications] Failed to get push token:', error);
      return null;
    }
  }

  /**
   * Schedule local notification
   */
  async scheduleNotification(
    config: LocalNotificationConfig,
    delaySeconds: number = 0,
  ): Promise<string | null> {
    if (!this.isAvailable) {
      console.warn('[Notifications] Not available in Expo Go');
      return null;
    }

    try {
      const channelId = getChannelId ? getChannelId(config.category) : undefined;

      const notificationId = await Notifications.scheduleNotificationAsync({
        content: {
          title: config.title,
          body: config.body,
          data: config.data || {},
          sound: config.sound !== false,
          badge: config.badge,
          ...(Platform.OS === 'android' && {
            channelId,
            priority: config.priority || 'high',
          }),
        },
        trigger: delaySeconds > 0 ? {seconds: delaySeconds} : null,
      });

      analytics.logEvent({
        name: 'notification_scheduled',
        params: {
          category: config.category,
          delaySeconds,
        },
      });

      return notificationId;
    } catch (error) {
      console.error('[Notifications] Failed to schedule notification:', error);
      return null;
    }
  }

  /**
   * Cancel notification
   */
  async cancelNotification(notificationId: string): Promise<void> {
    if (!this.isAvailable) return;

    try {
      await Notifications.cancelScheduledNotificationAsync(notificationId);
    } catch (error) {
      console.error('[Notifications] Failed to cancel notification:', error);
    }
  }

  /**
   * Cancel all notifications
   */
  async cancelAllNotifications(): Promise<void> {
    if (!this.isAvailable) return;

    try {
      await Notifications.cancelAllScheduledNotificationsAsync();
    } catch (error) {
      console.error('[Notifications] Failed to cancel all notifications:', error);
    }
  }

  /**
   * Set badge count
   */
  async setBadgeCount(count: number): Promise<void> {
    if (!this.isAvailable) return;

    try {
      await Notifications.setBadgeCountAsync(count);
    } catch (error) {
      console.error('[Notifications] Failed to set badge:', error);
    }
  }

  /**
   * Clear badge
   */
  async clearBadge(): Promise<void> {
    if (!this.isAvailable) return;

    try {
      await Notifications.setBadgeCountAsync(0);
    } catch (error) {
      console.error('[Notifications] Failed to clear badge:', error);
    }
  }

  /**
   * Listen to foreground notifications
   */
  onNotificationReceived(
    handler: (notification: any) => void,
  ): () => void {
    if (!this.isAvailable) {
      return () => {};
    }

    try {
      const subscription = Notifications.addNotificationReceivedListener(handler);
      return () => subscription.remove();
    } catch (error) {
      console.error('[Notifications] Failed to add listener:', error);
      return () => {};
    }
  }

  /**
   * Listen to notification responses (user tapped notification)
   */
  onNotificationResponse(
    handler: (response: any) => void,
  ): () => void {
    if (!this.isAvailable) {
      return () => {};
    }

    try {
      const subscription = Notifications.addNotificationResponseReceivedListener(handler);
      return () => subscription.remove();
    } catch (error) {
      console.error('[Notifications] Failed to add response listener:', error);
      return () => {};
    }
  }

  /**
   * Get last notification response (for cold start)
   */
  async getLastNotificationResponse(): Promise<any | null> {
    if (!this.isAvailable) {
      return null;
    }

    try {
      return await Notifications.getLastNotificationResponseAsync();
    } catch (error) {
      console.error('[Notifications] Failed to get last response:', error);
      return null;
    }
  }
}

export const notificationService = new NotificationService();

export default notificationService;
