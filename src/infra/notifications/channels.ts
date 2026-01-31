/**
 * Infra - Notifications - Channels (Android)
 * 
 * Android notification channels management
 */

import * as Notifications from 'expo-notifications';
import {Platform} from 'react-native';
import type {NotificationCategory, NotificationPriority} from './types';

/**
 * Notification channel configuration
 */
interface NotificationChannel {
  id: string;
  name: string;
  description?: string;
  importance: Notifications.AndroidImportance;
  sound?: string;
  vibrate?: boolean;
  enableLights?: boolean;
  lightColor?: string;
  badge?: boolean;
}

/**
 * Android notification channels
 */
export const NOTIFICATION_CHANNELS: Record<NotificationCategory, NotificationChannel> = {
  message: {
    id: 'messages',
    name: 'Messages',
    description: 'New messages and conversations',
    importance: Notifications.AndroidImportance.HIGH,
    sound: 'default',
    vibrate: true,
    enableLights: true,
    badge: true,
  },
  alert: {
    id: 'alerts',
    name: 'Alerts',
    description: 'Important alerts and warnings',
    importance: Notifications.AndroidImportance.MAX,
    sound: 'default',
    vibrate: true,
    enableLights: true,
    lightColor: '#ff0000',
    badge: true,
  },
  update: {
    id: 'updates',
    name: 'Updates',
    description: 'App updates and news',
    importance: Notifications.AndroidImportance.DEFAULT,
    sound: 'default',
    vibrate: false,
    badge: false,
  },
  reminder: {
    id: 'reminders',
    name: 'Reminders',
    description: 'Scheduled reminders',
    importance: Notifications.AndroidImportance.HIGH,
    sound: 'default',
    vibrate: true,
    badge: true,
  },
  social: {
    id: 'social',
    name: 'Social',
    description: 'Likes, comments, and follows',
    importance: Notifications.AndroidImportance.DEFAULT,
    sound: 'default',
    vibrate: false,
    badge: true,
  },
  system: {
    id: 'system',
    name: 'System',
    description: 'System notifications',
    importance: Notifications.AndroidImportance.LOW,
    sound: undefined,
    vibrate: false,
    badge: false,
  },
};

/**
 * Setup Android notification channels
 */
export async function setupNotificationChannels() {
  if (Platform.OS !== 'android') {
    return;
  }

  try {
    // Create all channels
    for (const channel of Object.values(NOTIFICATION_CHANNELS)) {
      await Notifications.setNotificationChannelAsync(channel.id, {
        name: channel.name,
        description: channel.description,
        importance: channel.importance,
        sound: channel.sound,
        vibrationPattern: channel.vibrate ? [0, 250, 250, 250] : undefined,
        enableLights: channel.enableLights,
        lightColor: channel.lightColor,
        showBadge: channel.badge,
      });
    }

    console.log('[Notifications] Android channels setup complete');
  } catch (error) {
    console.error('[Notifications] Error setting up channels:', error);
  }
}

/**
 * Get channel ID for category
 */
export function getChannelId(category: NotificationCategory): string {
  return NOTIFICATION_CHANNELS[category].id;
}

export default {
  NOTIFICATION_CHANNELS,
  setupNotificationChannels,
  getChannelId,
};
