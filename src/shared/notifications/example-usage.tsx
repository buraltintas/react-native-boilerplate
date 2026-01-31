/**
 * Example: Push Notifications
 * 
 * Comprehensive examples of push notification usage
 */

import React, {useState} from 'react';
import {View, Text, StyleSheet, ScrollView, Button} from 'react-native';
import {
  useNotifications,
  useNotificationSetup,
} from '@shared/hooks';
import {NotificationPermissionPrompt} from '@shared/components';
import {NotificationCategory} from '@infra/notifications';

/**
 * Example 1: Basic Setup
 */
function NotificationSetupExample() {
  const {
    expoPushToken,
    permissionStatus,
    unreadCount,
    requestPermissions,
    getToken,
  } = useNotifications();

  // Auto-setup notifications on mount
  useNotificationSetup();

  return (
    <View style={styles.section}>
      <Text style={styles.title}>Notification Setup</Text>
      
      <Text>Permission: {permissionStatus}</Text>
      <Text>Unread: {unreadCount}</Text>
      <Text>Token: {expoPushToken ? `${expoPushToken.substring(0, 20)}...` : 'None'}</Text>

      <View style={styles.buttons}>
        <Button title="Request Permission" onPress={requestPermissions} />
        <Button title="Get Token" onPress={getToken} />
      </View>
    </View>
  );
}

/**
 * Example 2: Permission Prompt
 */
function PermissionPromptExample() {
  const [showPrompt, setShowPrompt] = useState(false);

  return (
    <View style={styles.section}>
      <Text style={styles.title}>Permission Prompt</Text>
      
      <Button
        title="Show Permission Prompt"
        onPress={() => setShowPrompt(true)}
      />

      <NotificationPermissionPrompt
        visible={showPrompt}
        onClose={() => setShowPrompt(false)}
        title="Enable Notifications"
        message="Stay updated with important messages and alerts!"
      />
    </View>
  );
}

/**
 * Example 3: Schedule Local Notifications
 */
function LocalNotificationExample() {
  const {scheduleNotification} = useNotifications();

  const scheduleImmediate = async () => {
    await scheduleNotification({
      title: 'Hello!',
      body: 'This is an immediate notification',
      data: {
        category: NotificationCategory.MESSAGE,
        type: 'test',
      },
    });
  };

  const scheduleDelayed = async () => {
    await scheduleNotification(
      {
        title: 'Reminder',
        body: 'This notification was scheduled 5 seconds ago',
        data: {
          category: NotificationCategory.REMINDER,
          type: 'reminder',
        },
      },
      5, // 5 seconds delay
    );
  };

  const scheduleWithNavigation = async () => {
    await scheduleNotification({
      title: 'Tap to open',
      body: 'This will navigate to a screen',
      data: {
        category: NotificationCategory.MESSAGE,
        type: 'navigation',
        screen: 'AnimalDetail',
        params: {id: '123'},
      },
    });
  };

  return (
    <View style={styles.section}>
      <Text style={styles.title}>Local Notifications</Text>
      
      <View style={styles.buttons}>
        <Button title="Immediate" onPress={scheduleImmediate} />
        <Button title="Delayed (5s)" onPress={scheduleDelayed} />
        <Button title="With Navigation" onPress={scheduleWithNavigation} />
      </View>
    </View>
  );
}

/**
 * Example 4: Categories & Channels
 */
function CategoriesExample() {
  const {scheduleNotification} = useNotifications();

  const sendMessage = async () => {
    await scheduleNotification({
      title: 'New Message',
      body: 'You have a new message from John',
      data: {
        category: NotificationCategory.MESSAGE,
        type: 'message',
      },
    });
  };

  const sendAlert = async () => {
    await scheduleNotification({
      title: '⚠️ Alert',
      body: 'This is an important alert!',
      data: {
        category: NotificationCategory.ALERT,
        type: 'alert',
      },
      priority: 'high',
    });
  };

  const sendReminder = async () => {
    await scheduleNotification({
      title: '🔔 Reminder',
      body: 'Don\'t forget your appointment',
      data: {
        category: NotificationCategory.REMINDER,
        type: 'reminder',
      },
    });
  };

  const sendSocial = async () => {
    await scheduleNotification({
      title: '👍 Someone liked your post',
      body: 'John liked your photo',
      data: {
        category: NotificationCategory.SOCIAL,
        type: 'social',
      },
    });
  };

  return (
    <View style={styles.section}>
      <Text style={styles.title}>Categories & Channels</Text>
      
      <View style={styles.buttons}>
        <Button title="Message" onPress={sendMessage} />
        <Button title="Alert" onPress={sendAlert} />
        <Button title="Reminder" onPress={sendReminder} />
        <Button title="Social" onPress={sendSocial} />
      </View>
    </View>
  );
}

/**
 * Example 5: Badge Management
 */
function BadgeExample() {
  const {setBadge, clearBadge, unreadCount} = useNotifications();

  return (
    <View style={styles.section}>
      <Text style={styles.title}>Badge Management</Text>
      <Text>Current Badge: {unreadCount}</Text>
      
      <View style={styles.buttons}>
        <Button title="Set Badge 5" onPress={() => setBadge(5)} />
        <Button title="Clear Badge" onPress={clearBadge} />
      </View>
    </View>
  );
}

/**
 * Example 6: Register Push Token
 */
function PushTokenExample() {
  const {expoPushToken, getToken} = useNotifications();
  const [registered, setRegistered] = useState(false);

  const registerToken = async () => {
    const token = await getToken();
    if (token) {
      // Send token to your backend
      console.log('Registering token:', token);
      // await api.registerPushToken(token);
      setRegistered(true);
    }
  };

  return (
    <View style={styles.section}>
      <Text style={styles.title}>Push Token Registration</Text>
      
      {expoPushToken ? (
        <>
          <Text style={styles.token}>
            Token: {expoPushToken.substring(0, 30)}...
          </Text>
          <Text style={{color: registered ? 'green' : 'orange'}}>
            {registered ? '✅ Registered' : '⚠️ Not registered'}
          </Text>
          <Button title="Register with Backend" onPress={registerToken} />
        </>
      ) : (
        <Text>No token yet. Request permission first.</Text>
      )}
    </View>
  );
}

/**
 * Main Example Screen
 */
export default function NotificationsExample() {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.mainTitle}>Push Notifications</Text>
      
      <NotificationSetupExample />
      <PermissionPromptExample />
      <LocalNotificationExample />
      <CategoriesExample />
      <BadgeExample />
      <PushTokenExample />

      <View style={styles.info}>
        <Text style={styles.infoText}>
          ℹ️ Production-ready notification system with:
          {'\n'}• Permission management
          {'\n'}• Android channels
          {'\n'}• Categories & priorities
          {'\n'}• Deep linking
          {'\n'}• Badge management
          {'\n'}• Push token registration
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  mainTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 24,
    textAlign: 'center',
  },
  section: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
    color: '#007AFF',
  },
  buttons: {
    marginTop: 12,
    gap: 8,
  },
  token: {
    fontSize: 12,
    fontFamily: 'monospace',
    backgroundColor: '#f5f5f5',
    padding: 8,
    borderRadius: 4,
    marginVertical: 8,
  },
  info: {
    marginTop: 16,
    padding: 12,
    backgroundColor: '#E3F2FD',
    borderRadius: 8,
  },
  infoText: {
    fontSize: 12,
    color: '#1976D2',
  },
});
