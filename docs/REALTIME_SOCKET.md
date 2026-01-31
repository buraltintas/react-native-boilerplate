# Real-time & Socket Support

Bu döküman, WebSocket/Socket.IO entegrasyonunu ve React Query ile kullanımını açıklar.

## 📦 Technologies

- **Socket.IO Client** - Reliable WebSocket connections
- **Expo Notifications** - Push notifications as fallback
- **React Query** - Automatic cache invalidation
- **Zustand** - Socket state management

## 🔌 Socket Architecture

### Layers

```
┌─────────────────────────────────────┐
│         UI Components               │
│  (useSocket, useSocketEvent hooks)  │
└─────────────────────────────────────┘
                 ↓
┌─────────────────────────────────────┐
│      React Query Integration        │
│     (useSocketQuery hook)           │
└─────────────────────────────────────┘
                 ↓
┌─────────────────────────────────────┐
│         Socket Store                │
│  (Connection state - Zustand)       │
└─────────────────────────────────────┘
                 ↓
┌─────────────────────────────────────┐
│       Socket Service                │
│  (Socket.IO client wrapper)         │
└─────────────────────────────────────┘
```

**Prensip:** Socket state hiçbir zaman UI component'te tutulmaz!

## 🚀 Quick Start

### 1. Configuration

```typescript
// .env
EXPO_PUBLIC_SOCKET_URL=wss://api.example.com
EXPO_PUBLIC_SOCKET_PATH=/socket.io
```

### 2. Connect to Socket

```typescript
import {useSocket} from '@shared/hooks';

function MyComponent() {
  const {status, isConnected, connect, disconnect} = useSocket();

  useEffect(() => {
    connect();
    return () => disconnect();
  }, []);

  return (
    <Text>Status: {status}</Text>
  );
}
```

### 3. Listen to Events

```typescript
import {useSocketEvent} from '@shared/hooks';

function MyComponent() {
  useSocketEvent('message:new', (data) => {
    console.log('New message:', data);
  });

  return <View>...</View>;
}
```

### 4. Emit Events

```typescript
import {useSocket} from '@shared/hooks';

function MyComponent() {
  const {emit, isConnected} = useSocket();

  const sendMessage = () => {
    if (isConnected) {
      emit('message:send', {
        text: 'Hello!',
        timestamp: Date.now(),
      });
    }
  };

  return <Button onPress={sendMessage} />;
}
```

## 🔄 React Query Integration

### Auto Cache Invalidation

Socket event geldiğinde otomatik cache invalidation:

```typescript
import {useSocketQuery} from '@shared/hooks';
import {queryKeys} from '@shared/query';

function MyComponent() {
  // Fetch data with React Query
  const {data: messages} = useQuery({
    queryKey: queryKeys.messages.list(),
    queryFn: fetchMessages,
  });

  // Auto-invalidate when socket event arrives
  useSocketQuery({
    event: 'message:new',
    queryKeys: [queryKeys.messages.list()],
  });

  return <MessageList messages={messages} />;
}
```

### Conditional Invalidation

Custom logic ile invalidation:

```typescript
useSocketQuery<Message>({
  event: 'message:updated',
  onEvent: (data) => {
    // Only invalidate if it's my message
    if (data.userId === currentUserId) {
      return [queryKeys.messages.detail(data.id)];
    }
    // Return nothing = no invalidation
  },
});
```

### Debounced Invalidation

Çok fazla event geliyorsa debounce:

```typescript
useSocketQuery({
  event: 'typing:indicator',
  queryKeys: [queryKeys.users.list()],
  debounce: 500, // 500ms wait
});
```

### Multiple Bindings

Birden fazla event-query binding:

```typescript
import {useSocketQueries, socketQueryPatterns} from '@shared/hooks';

function MyComponent() {
  useSocketQueries([
    // Pattern 1: List + Detail invalidation
    socketQueryPatterns.listAndDetail('messages'),
    
    // Pattern 2: List on create
    socketQueryPatterns.listOnCreate('users'),
    
    // Pattern 3: All on delete
    socketQueryPatterns.allOnDelete('posts'),
    
    // Custom pattern
    {
      event: 'notification:new',
      queryKeys: [queryKeys.notifications.list()],
      debounce: 1000,
    },
  ]);

  return <View>...</View>;
}
```

## 🎯 Common Patterns

### 1. Chat Room

```typescript
function ChatRoom({roomId}: {roomId: string}) {
  const {emit} = useSocket();

  // Join room on mount
  useEffect(() => {
    emit('room:join', {roomId});
    return () => {
      emit('room:leave', {roomId});
    };
  }, [roomId, emit]);

  // Fetch messages
  const {data: messages} = useQuery({
    queryKey: queryKeys.messages.list(roomId),
    queryFn: () => fetchRoomMessages(roomId),
  });

  // Auto-update on new messages
  useSocketQuery({
    event: 'room:message',
    queryKeys: [queryKeys.messages.list(roomId)],
  });

  // Listen to typing
  useSocketEvent('room:typing', (data) => {
    console.log('User typing:', data);
  });

  const sendMessage = (text: string) => {
    emit('room:message', {roomId, text});
  };

  return <ChatUI messages={messages} onSend={sendMessage} />;
}
```

### 2. Presence System

```typescript
function usePresence() {
  const {emit} = useSocket();
  const [onlineUsers, setOnlineUsers] = useState<string[]>([]);

  // Send presence on mount
  useEffect(() => {
    emit('presence:online');
    
    const interval = setInterval(() => {
      emit('presence:heartbeat');
    }, 30000); // Every 30s

    return () => {
      clearInterval(interval);
      emit('presence:offline');
    };
  }, [emit]);

  // Listen to presence updates
  useSocketEvent<{users: string[]}>('presence:update', (data) => {
    setOnlineUsers(data.users);
  });

  return {onlineUsers};
}
```

### 3. Live Notifications

```typescript
function useNotifications() {
  const {data: notifications, refetch} = useQuery({
    queryKey: queryKeys.notifications.list(),
    queryFn: fetchNotifications,
  });

  // Auto-refetch on new notification
  useSocketQuery({
    event: 'notification:new',
    queryKeys: [queryKeys.notifications.list()],
    onEvent: (notification) => {
      // Show local notification
      notificationService.scheduleNotification({
        title: notification.title,
        body: notification.body,
      });
      
      // Invalidate cache
      return [queryKeys.notifications.list()];
    },
  });

  return {notifications};
}
```

### 4. Live Updates Feed

```typescript
function useFeed() {
  const {data: feed} = useQuery({
    queryKey: queryKeys.feed.list(),
    queryFn: fetchFeed,
  });

  // Multiple real-time updates
  useSocketQueries([
    {event: 'post:created', queryKeys: [queryKeys.feed.list()]},
    {event: 'post:liked', queryKeys: [queryKeys.feed.list()]},
    {event: 'comment:added', queryKeys: [queryKeys.feed.list()]},
  ]);

  return {feed};
}
```

## 🔄 Lifecycle Management

### Foreground/Background Handling

Socket service otomatik olarak app state'i dinler:

```typescript
// Automatic behavior:
// - App goes to background → keep connection (or disconnect to save battery)
// - App comes to foreground → auto-reconnect if needed
```

Custom behavior:

```typescript
import {socketService} from '@infra/socket';
import {AppState} from 'react-native';

useEffect(() => {
  const subscription = AppState.addEventListener('change', (state) => {
    if (state === 'active') {
      // App in foreground
      socketService.reconnect();
    } else {
      // App in background
      socketService.disconnect();
    }
  });

  return () => subscription.remove();
}, []);
```

### Auth Token Updates

Token yenilendiğinde socket'i güncelle:

```typescript
import {socketService} from '@infra/socket';

// After token refresh
const newToken = await refreshToken();
socketService.updateAuth(newToken);
```

### Reconnection Strategy

Automatic reconnection config:

```typescript
// src/infra/socket/client.ts
const config = {
  reconnection: true,
  reconnectionAttempts: 5,
  reconnectionDelay: 1000,
  timeout: 10000,
};
```

Manual reconnection:

```typescript
const {reconnect, status} = useSocket();

if (status === 'error') {
  reconnect();
}
```

## 📱 Push Notifications (Fallback)

Socket bağlantısı yokken (background/closed), push notifications kullan.

### Setup

```typescript
import {notificationService} from '@infra/notifications';

// Request permissions
await notificationService.requestPermissions();

// Get push token
const token = await notificationService.getExpoPushToken();

// Send to backend
await api.registerPushToken(token);
```

### Listen to Notifications

```typescript
useEffect(() => {
  // Foreground notifications
  const foregroundSub = notificationService.onNotificationReceived((notification) => {
    console.log('Notification received:', notification);
    
    // Invalidate React Query cache
    queryClient.invalidateQueries({queryKey: ['notifications']});
  });

  // Background/Closed notifications (tapped)
  const responseSub = notificationService.onNotificationResponse((response) => {
    console.log('Notification tapped:', response);
    
    // Navigate to screen
    const data = response.notification.request.content.data;
    navigation.navigate('MessageDetail', {id: data.messageId});
  });

  return () => {
    foregroundSub.remove();
    responseSub.remove();
  };
}, []);
```

### Hybrid Strategy

```typescript
function useHybridNotifications() {
  const {isConnected} = useSocket();

  // If socket connected, use socket
  if (isConnected) {
    useSocketEvent('notification:new', handleNotification);
  }
  
  // If socket not connected, rely on push
  useEffect(() => {
    if (!isConnected) {
      const sub = notificationService.onNotificationReceived(handleNotification);
      return () => sub.remove();
    }
  }, [isConnected]);

  function handleNotification(data: any) {
    // Same handler for both sources
    queryClient.invalidateQueries({queryKey: ['notifications']});
  }
}
```

## 🎯 Best Practices

### ✅ DO

```typescript
// ✅ Use hooks in components
function MyComponent() {
  useSocketEvent('message', handleMessage);
}

// ✅ Store socket state in Zustand
const {isConnected} = useSocketStore();

// ✅ Integrate with React Query
useSocketQuery({
  event: 'update',
  queryKeys: [['items']],
});

// ✅ Clean up on unmount
useEffect(() => {
  const unsub = socketService.on('event', handler);
  return unsub;
}, []);

// ✅ Check connection before emit
if (isConnected) {
  emit('message', data);
}
```

### ❌ DON'T

```typescript
// ❌ Don't store socket state in component
const [messages, setMessages] = useState([]);
useSocketEvent('message', msg => setMessages(prev => [...prev, msg]));

// ❌ Don't use socket directly in components
import {io} from 'socket.io-client';
const socket = io('url'); // Use socketService instead!

// ❌ Don't forget to clean up
socketService.on('event', handler); // Memory leak!

// ❌ Don't emit without checking connection
emit('message', data); // May fail silently
```

## 🔍 Debugging

### Connection Status

```typescript
import {useSocketStore} from '@shared/store';

function DebugSocket() {
  const {status, isConnected, lastConnectedAt, reconnectAttempts} = useSocketStore();

  return (
    <View>
      <Text>Status: {status}</Text>
      <Text>Connected: {isConnected ? 'Yes' : 'No'}</Text>
      <Text>Last Connected: {new Date(lastConnectedAt).toLocaleString()}</Text>
      <Text>Reconnect Attempts: {reconnectAttempts}</Text>
    </View>
  );
}
```

### Event Logging

```typescript
// Log all events
socketService.on('*', (event, data) => {
  console.log('[Socket Event]', event, data);
});
```

### Network Inspector

Expo Network Inspect ile WebSocket trafiğini izle:

```bash
npx expo start --dev-client
# Open app, shake device, click "Debug Remote JS"
```

## 📚 Examples

Comprehensive examples:
- `src/shared/socket/example-usage.tsx`

## 🔗 Resources

- [Socket.IO Client Docs](https://socket.io/docs/v4/client-api/)
- [Expo Notifications](https://docs.expo.dev/versions/latest/sdk/notifications/)
- [React Query](https://tanstack.com/query/latest)

---

**Özet:** Real-time updates with automatic cache invalidation! 🔌
