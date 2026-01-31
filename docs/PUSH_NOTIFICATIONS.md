# Push Notifications Guide

Bu döküman, production-ready push notification sistemini açıklar.

## 📦 Features

✅ **Permission Management** - User-friendly permission requests  
✅ **Android Channels** - Categorized notifications with custom settings  
✅ **Local Notifications** - Schedule notifications locally  
✅ **Push Notifications** - Expo Push Notification Service  
✅ **Deep Linking** - Navigate to screens from notifications  
✅ **Badge Management** - App icon badge counts  
✅ **Categories** - Message, Alert, Reminder, Social, System  
✅ **Priorities** - Min, Low, Default, High, Max  
✅ **React Query Integration** - Auto-invalidate cache  

## 🚀 Quick Start

### 1. Setup in App Bootstrap

```typescript
import {useNotificationSetup} from '@shared/hooks';

function App() {
  // Auto-setup notifications on app start
  useNotificationSetup();
  
  return <YourApp />;
}
```

### 2. Request Permission

```typescript
import {useNotifications} from '@shared/hooks';

function MyScreen() {
  const {requestPermissions, permissionStatus} = useNotifications();
  
  const handleEnable = async () => {
    const granted = await requestPermissions();
    if (granted) {
      console.log('Permission granted!');
    }
  };
  
  return (
    <Button
      title="Enable Notifications"
      onPress={handleEnable}
    />
  );
}
```

### 3. Get Push Token

```typescript
import {useNotifications} from '@shared/hooks';

function MyScreen() {
  const {getToken} = useNotifications();
  
  const registerToken = async () => {
    const token = await getToken();
    
    // Send to your backend
    await api.registerPushToken(token);
  };
  
  return <Button title="Register" onPress={registerToken} />;
}
```

### 4. Schedule Local Notification

```typescript
import {useNotifications} from '@shared/hooks';
import {NotificationCategory} from '@infra/notifications';

function MyScreen() {
  const {scheduleNotification} = useNotifications();
  
  const sendNotification = async () => {
    await scheduleNotification({
      title: 'Hello!',
      body: 'This is a test notification',
      data: {
        category: NotificationCategory.MESSAGE,
        type: 'test',
      },
    });
  };
  
  return <Button title="Send" onPress={sendNotification} />;
}
```

## 📱 Android Channels

Android gerektirir ki notification'lar bir channel'a ait olsun.

### Pre-configured Channels

```typescript
enum NotificationCategory {
  MESSAGE = 'message',     // High priority, sound, vibrate
  ALERT = 'alert',         // Max priority, red light
  UPDATE = 'update',       // Default priority, no vibrate
  REMINDER = 'reminder',   // High priority, badge
  SOCIAL = 'social',       // Default priority, badge
  SYSTEM = 'system',       // Low priority, no sound
}
```

### Usage

```typescript
await scheduleNotification({
  title: 'New Message',
  body: 'You have a new message',
  data: {
    category: NotificationCategory.MESSAGE, // Auto-selects channel
    type: 'message',
  },
});
```

Channels automatically created on app start!

## 🎯 Notification Types

### Immediate

```typescript
await scheduleNotification({
  title: 'Hello',
  body: 'Immediate notification',
  data: {category: NotificationCategory.MESSAGE},
});
```

### Delayed

```typescript
await scheduleNotification(
  {
    title: 'Reminder',
    body: 'This will show in 10 seconds',
    data: {category: NotificationCategory.REMINDER},
  },
  10, // seconds
);
```

### At Specific Time

```typescript
import {notificationService} from '@infra/notifications';

await notificationService.scheduleNotificationAt(
  {
    title: 'Meeting',
    body: 'Meeting starts in 5 minutes',
    data: {category: NotificationCategory.REMINDER},
  },
  new Date('2026-02-01T10:00:00'),
);
```

### Repeating

```typescript
import {notificationService} from '@infra/notifications';

await notificationService.scheduleRepeatingNotification(
  {
    title: 'Daily Reminder',
    body: 'Don\'t forget to check in',
    data: {category: NotificationCategory.REMINDER},
  },
  86400, // Every 24 hours
);
```

## 🧭 Deep Linking from Notifications

### Setup

Deep linking automatically handled by `useNotificationHandlers`:

```typescript
import {useNotificationSetup} from '@shared/hooks';

function App() {
  useNotificationSetup(); // Auto-handles deep linking
  return <YourApp />;
}
```

### Send Notification with Navigation

```typescript
await scheduleNotification({
  title: 'New Message',
  body: 'John sent you a message',
  data: {
    category: NotificationCategory.MESSAGE,
    type: 'message',
    screen: 'MessageDetail', // Screen name
    params: {id: '123'},     // Screen params
  },
});
```

When user taps notification → automatically navigates to `MessageDetail` screen with `{id: '123'}`.

## 🎨 Permission Prompt UI

User-friendly permission request:

```typescript
import {NotificationPermissionPrompt} from '@shared/components';

function MyScreen() {
  const [showPrompt, setShowPrompt] = useState(false);
  
  return (
    <>
      <Button
        title="Enable Notifications"
        onPress={() => setShowPrompt(true)}
      />
      
      <NotificationPermissionPrompt
        visible={showPrompt}
        onClose={() => setShowPrompt(false)}
        title="Stay Updated"
        message="Get notified about important updates"
      />
    </>
  );
}
```

## 🔢 Badge Management

### Set Badge Count

```typescript
import {useNotifications} from '@shared/hooks';

const {setBadge, clearBadge, unreadCount} = useNotifications();

// Set badge
await setBadge(5);

// Clear badge
await clearBadge();

// Get current count from store
console.log(unreadCount);
```

### Auto-increment Badge

```typescript
import {useNotificationStore} from '@shared/store';

// Automatically increments on new notification
useNotificationHandlers(); // Built-in
```

## 📊 Notification Store

State management with Zustand:

```typescript
import {useNotificationStore} from '@shared/store';

function MyComponent() {
  const {
    expoPushToken,
    permissionStatus,
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead,
    clearNotifications,
  } = useNotificationStore();
  
  return (
    <View>
      <Text>Unread: {unreadCount}</Text>
      <Text>Total: {notifications.length}</Text>
      
      <Button title="Mark All Read" onPress={markAllAsRead} />
      <Button title="Clear All" onPress={clearNotifications} />
    </View>
  );
}
```

## 🔄 React Query Integration

Auto-invalidate queries based on notifications:

```typescript
import {useNotificationHandlers} from '@shared/hooks';
import {useEffect} from 'react';

function useNotificationQuerySync() {
  const queryClient = useQueryClient();
  
  useEffect(() => {
    const sub = notificationService.onNotificationReceived((notification) => {
      const data = notification.request.content.data;
      
      // Invalidate based on category
      if (data.category === 'message') {
        queryClient.invalidateQueries({queryKey: ['messages']});
      }
    });
    
    return () => sub.remove();
  }, [queryClient]);
}
```

Or modify `useNotificationHandlers` in `src/shared/hooks/useNotifications.ts`.

## 🔔 Backend Integration

### 1. Register Push Token

```typescript
import {useNotifications} from '@shared/hooks';
import {api} from '@infra/api';

function useRegisterPushToken() {
  const {getToken} = useNotifications();
  
  useEffect(() => {
    const register = async () => {
      const token = await getToken();
      if (token) {
        await api.post('/push-tokens', {token});
      }
    };
    
    register();
  }, []);
}
```

### 2. Send from Backend (Node.js Example)

```javascript
// Backend (Node.js)
const {Expo} = require('expo-server-sdk');
const expo = new Expo();

async function sendPushNotification(token, title, body, data) {
  const messages = [{
    to: token,
    sound: 'default',
    title,
    body,
    data,
    priority: 'high',
    channelId: 'messages',
  }];
  
  const chunks = expo.chunkPushNotifications(messages);
  
  for (const chunk of chunks) {
    await expo.sendPushNotificationsAsync(chunk);
  }
}

// Usage
await sendPushNotification(
  userToken,
  'New Message',
  'You have a new message',
  {
    category: 'message',
    screen: 'MessageDetail',
    params: {id: '123'},
  },
);
```

## 🎯 Best Practices

### ✅ DO

```typescript
// ✅ Request permission with explanation
<NotificationPermissionPrompt
  title="Stay Connected"
  message="Get notified when someone messages you"
/>

// ✅ Use appropriate categories
{
  category: NotificationCategory.MESSAGE, // For messages
  category: NotificationCategory.ALERT,   // For urgent alerts
}

// ✅ Include navigation data
{
  screen: 'MessageDetail',
  params: {id: '123'},
}

// ✅ Clean up on unmount
useEffect(() => {
  const sub = notificationService.onNotificationReceived(handler);
  return () => sub.remove();
}, []);

// ✅ Handle both foreground and background
useNotificationSetup(); // Handles both
```

### ❌ DON'T

```typescript
// ❌ Request permission immediately on launch
useEffect(() => {
  requestPermissions(); // Too aggressive!
}, []);

// ❌ Send too many notifications
for (let i = 0; i < 100; i++) {
  scheduleNotification({...}); // Spam!
}

// ❌ Forget to clean up listeners
notificationService.onNotificationReceived(handler); // Memory leak!

// ❌ Use generic category for everything
{category: NotificationCategory.SYSTEM} // Not helpful
```

## 🧪 Testing

### Test with Local Notifications

```typescript
// Test immediate
await scheduleNotification({
  title: 'Test',
  body: 'Testing notification',
  data: {category: NotificationCategory.MESSAGE},
});

// Test delayed
await scheduleNotification(config, 5); // 5 seconds

// Test navigation
await scheduleNotification({
  title: 'Test Navigation',
  body: 'Tap to navigate',
  data: {
    category: NotificationCategory.MESSAGE,
    screen: 'TestScreen',
    params: {test: true},
  },
});
```

### Test Push Notifications

Use Expo Push Notification Tool:
https://expo.dev/notifications

## 📚 Examples

Comprehensive examples:
- `src/shared/notifications/example-usage.tsx`

## 🔗 Resources

- [Expo Notifications Docs](https://docs.expo.dev/versions/latest/sdk/notifications/)
- [Expo Push Notifications](https://docs.expo.dev/push-notifications/overview/)
- [Android Notification Channels](https://developer.android.com/training/notify-user/channels)

---

**Özet:** Production-ready push notifications with channels, deep linking, and badge management! 🔔
