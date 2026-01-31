/**
 * Infra - Notifications - Types
 * 
 * Type definitions for push notifications
 */

/**
 * Notification categories
 */
export enum NotificationCategory {
  MESSAGE = 'message',
  ALERT = 'alert',
  UPDATE = 'update',
  REMINDER = 'reminder',
  SOCIAL = 'social',
  SYSTEM = 'system',
}

/**
 * Notification priority
 */
export enum NotificationPriority {
  MIN = 'min',
  LOW = 'low',
  DEFAULT = 'default',
  HIGH = 'high',
  MAX = 'max',
}

/**
 * Notification data payload
 */
export interface NotificationData {
  id?: string;
  category: NotificationCategory;
  type: string;
  
  // Navigation
  screen?: string;
  params?: Record<string, any>;
  
  // Custom data
  [key: string]: any;
}

/**
 * Local notification config
 */
export interface LocalNotificationConfig {
  title: string;
  body: string;
  subtitle?: string;
  data?: NotificationData;
  sound?: boolean | string;
  badge?: number;
  priority?: NotificationPriority;
  categoryId?: string;
  
  // Android specific
  channelId?: string;
  color?: string;
  icon?: string;
  
  // iOS specific
  threadIdentifier?: string;
}

/**
 * Notification permission status
 */
export type NotificationPermissionStatus = 
  | 'undetermined' 
  | 'denied' 
  | 'granted' 
  | 'provisional';

/**
 * Notification settings
 */
export interface NotificationSettings {
  permission: NotificationPermissionStatus;
  ios?: {
    allowsAlert: boolean;
    allowsBadge: boolean;
    allowsSound: boolean;
  };
  android?: {
    importance: number;
  };
}

export default NotificationData;
