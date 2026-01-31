/**
 * Example: Real-time Socket Integration
 * 
 * Comprehensive examples of socket usage with React Query
 */

import React, {useEffect, useState} from 'react';
import {View, Text, StyleSheet, Button, FlatList} from 'react-native';
import {useQuery, useQueryClient} from '@tanstack/react-query';
import {
  useSocket,
  useSocketEvent,
  useSocketQuery,
  useSocketQueries,
  socketQueryPatterns,
} from '@shared/hooks';
import {queryKeys} from '@shared/query';

// Mock data types
interface Message {
  id: string;
  text: string;
  userId: string;
  timestamp: number;
}

interface User {
  id: string;
  name: string;
  online: boolean;
}

/**
 * Example 1: Basic Socket Connection
 */
function SocketConnectionExample() {
  const {status, isConnected, connect, disconnect, reconnect} = useSocket();

  return (
    <View style={styles.section}>
      <Text style={styles.title}>Socket Connection</Text>
      <Text>Status: {status}</Text>
      <Text>Connected: {isConnected ? 'Yes' : 'No'}</Text>
      
      <View style={styles.buttons}>
        <Button title="Connect" onPress={connect} />
        <Button title="Disconnect" onPress={disconnect} />
        <Button title="Reconnect" onPress={reconnect} />
      </View>
    </View>
  );
}

/**
 * Example 2: Listening to Socket Events
 */
function SocketEventExample() {
  const [lastMessage, setLastMessage] = useState<string | null>(null);

  // Listen to 'message' event
  useSocketEvent<Message>('message', message => {
    console.log('New message:', message);
    setLastMessage(message.text);
  });

  // Listen to 'user:online' event
  useSocketEvent<{userId: string}>('user:online', data => {
    console.log('User online:', data.userId);
  });

  return (
    <View style={styles.section}>
      <Text style={styles.title}>Socket Events</Text>
      <Text>Last Message: {lastMessage || 'None'}</Text>
    </View>
  );
}

/**
 * Example 3: Emitting Events
 */
function EmitEventExample() {
  const {emit, isConnected} = useSocket();

  const sendMessage = () => {
    if (!isConnected) {
      alert('Not connected!');
      return;
    }

    emit('message:send', {
      text: 'Hello from React Native!',
      timestamp: Date.now(),
    });
  };

  return (
    <View style={styles.section}>
      <Text style={styles.title}>Emit Events</Text>
      <Button title="Send Message" onPress={sendMessage} disabled={!isConnected} />
    </View>
  );
}

/**
 * Example 4: Socket + React Query Integration
 */
function SocketQueryExample() {
  const queryClient = useQueryClient();

  // Fetch messages with React Query
  const {data: messages = []} = useQuery<Message[]>({
    queryKey: queryKeys.messages.list(),
    queryFn: async () => {
      // Your API call here
      return [];
    },
  });

  // Invalidate messages when new message arrives
  useSocketQuery<Message>({
    event: 'message:new',
    queryKeys: [queryKeys.messages.list()],
  });

  // Custom handler with conditional invalidation
  useSocketQuery<Message>({
    event: 'message:updated',
    onEvent: data => {
      // Only invalidate if it's my message
      if (data.userId === 'current-user-id') {
        return [queryKeys.messages.detail(data.id)];
      }
    },
  });

  return (
    <View style={styles.section}>
      <Text style={styles.title}>Socket + React Query</Text>
      <Text>Messages: {messages.length}</Text>
      
      <FlatList
        data={messages}
        keyExtractor={item => item.id}
        renderItem={({item}) => (
          <View style={styles.messageItem}>
            <Text>{item.text}</Text>
            <Text style={styles.timestamp}>
              {new Date(item.timestamp).toLocaleTimeString()}
            </Text>
          </View>
        )}
      />
    </View>
  );
}

/**
 * Example 5: Multiple Socket-Query Bindings
 */
function MultipleSocketQueriesExample() {
  // Set up multiple socket-query bindings
  useSocketQueries([
    // Messages
    socketQueryPatterns.listOnCreate('messages'),
    socketQueryPatterns.listAndDetail('messages'),
    
    // Users
    {
      event: 'user:online',
      queryKeys: [queryKeys.users.list()],
    },
    
    // Custom pattern
    {
      event: 'notification:new',
      onEvent: data => {
        console.log('New notification:', data);
        return [queryKeys.notifications.list()];
      },
      debounce: 500, // Debounce invalidation
    },
  ]);

  return (
    <View style={styles.section}>
      <Text style={styles.title}>Multiple Bindings</Text>
      <Text>✅ Listening to messages, users, notifications</Text>
    </View>
  );
}

/**
 * Example 6: Chat Room with Real-time Updates
 */
function ChatRoomExample() {
  const {emit, isConnected} = useSocket();
  const [message, setMessage] = useState('');

  // Join room on mount
  useEffect(() => {
    emit('room:join', {roomId: 'general'});

    return () => {
      emit('room:leave', {roomId: 'general'});
    };
  }, [emit]);

  // Listen to room messages
  useSocketQuery<Message>({
    event: 'room:message',
    queryKeys: [queryKeys.messages.list()],
  });

  // Listen to typing indicator
  useSocketEvent<{userId: string; typing: boolean}>('room:typing', data => {
    console.log('User typing:', data);
  });

  const sendMessage = () => {
    if (!message.trim() || !isConnected) return;

    emit('room:message', {
      roomId: 'general',
      text: message,
      timestamp: Date.now(),
    });

    setMessage('');
  };

  return (
    <View style={styles.section}>
      <Text style={styles.title}>Chat Room</Text>
      <Text>Room: general</Text>
      <Text>Status: {isConnected ? 'Connected' : 'Disconnected'}</Text>
      
      <Button title="Send Message" onPress={sendMessage} disabled={!isConnected} />
    </View>
  );
}

/**
 * Example 7: Presence System
 */
function PresenceExample() {
  const {emit} = useSocket();
  const [onlineUsers, setOnlineUsers] = useState<string[]>([]);

  // Send presence on mount
  useEffect(() => {
    emit('presence:online');

    return () => {
      emit('presence:offline');
    };
  }, [emit]);

  // Listen to presence updates
  useSocketEvent<{users: string[]}>('presence:update', data => {
    setOnlineUsers(data.users);
  });

  return (
    <View style={styles.section}>
      <Text style={styles.title}>Presence</Text>
      <Text>Online Users: {onlineUsers.length}</Text>
    </View>
  );
}

/**
 * Main Example Screen
 */
export default function RealTimeSocketExample() {
  return (
    <FlatList
      data={[
        {id: '1', component: SocketConnectionExample},
        {id: '2', component: SocketEventExample},
        {id: '3', component: EmitEventExample},
        {id: '4', component: SocketQueryExample},
        {id: '5', component: MultipleSocketQueriesExample},
        {id: '6', component: ChatRoomExample},
        {id: '7', component: PresenceExample},
      ]}
      keyExtractor={item => item.id}
      renderItem={({item}) => {
        const Component = item.component;
        return <Component />;
      }}
      contentContainerStyle={styles.container}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  section: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
    color: '#007AFF',
  },
  buttons: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 12,
  },
  messageItem: {
    padding: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  timestamp: {
    fontSize: 12,
    color: '#999',
    marginTop: 4,
  },
});
