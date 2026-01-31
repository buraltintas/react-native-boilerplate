/**
 * Infra - Socket - Client
 * 
 * WebSocket/Socket.IO client implementation
 */

import {io, Socket} from 'socket.io-client';
import {AppState, AppStateStatus} from 'react-native';
import config from '@infra/config';
import {useAuthStore} from '@shared/store';
import analytics from '@infra/analytics';
import type {
  SocketConfig,
  SocketConnectionStatus,
  SocketEventHandler,
  SocketService as ISocketService,
} from './types';

class SocketService implements ISocketService {
  private socket: Socket | null = null;
  private status: SocketConnectionStatus = 'disconnected';
  private config: SocketConfig;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private appStateSubscription: any = null;
  private isInForeground = true;

  constructor(config: SocketConfig) {
    this.config = {
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
      timeout: 10000,
      ...config,
    };

    // Listen to app state changes
    this.setupAppStateListener();
  }

  /**
   * Setup app state listener for background/foreground handling
   */
  private setupAppStateListener() {
    this.appStateSubscription = AppState.addEventListener(
      'change',
      this.handleAppStateChange,
    );
  }

  /**
   * Handle app state changes
   */
  private handleAppStateChange = (nextAppState: AppStateStatus) => {
    const isGoingToForeground = nextAppState === 'active' && !this.isInForeground;
    const isGoingToBackground = nextAppState.match(/inactive|background/) && this.isInForeground;

    if (isGoingToForeground) {
      this.isInForeground = true;
      this.handleForeground();
    } else if (isGoingToBackground) {
      this.isInForeground = false;
      this.handleBackground();
    }
  };

  /**
   * Handle app coming to foreground
   */
  private handleForeground() {
    console.log('[Socket] App in foreground');
    
    // Reconnect if needed
    if (this.socket && !this.socket.connected) {
      this.reconnect();
    }
  }

  /**
   * Handle app going to background
   */
  private handleBackground() {
    console.log('[Socket] App in background');
    
    // Keep connection alive but reduce activity
    // In production, you might want to disconnect to save battery
    // this.disconnect();
  }

  /**
   * Connect to socket server
   */
  connect(): void {
    if (this.socket?.connected) {
      console.log('[Socket] Already connected');
      return;
    }

    this.status = 'connecting';

    // Get auth token
    const token = useAuthStore.getState().accessToken;

    // Create socket instance
    this.socket = io(this.config.url, {
      path: this.config.path,
      autoConnect: this.config.autoConnect ?? true,
      reconnection: this.config.reconnection,
      reconnectionAttempts: this.config.reconnectionAttempts,
      reconnectionDelay: this.config.reconnectionDelay,
      timeout: this.config.timeout,
      auth: {
        token,
        ...this.config.auth,
      },
      transports: ['websocket'], // Force WebSocket only (no polling)
    });

    // Setup event listeners
    this.setupEventListeners();

    console.log('[Socket] Connecting to', this.config.url);
  }

  /**
   * Setup socket event listeners
   */
  private setupEventListeners() {
    if (!this.socket) return;

    this.socket.on('connect', () => {
      console.log('[Socket] Connected');
      this.status = 'connected';
      this.reconnectAttempts = 0;
      
      analytics.trackEvent('socket_connected', {
        url: this.config.url,
      });
    });

    this.socket.on('disconnect', reason => {
      console.log('[Socket] Disconnected:', reason);
      this.status = 'disconnected';
      
      analytics.trackEvent('socket_disconnected', {
        reason,
      });
    });

    this.socket.on('connect_error', error => {
      console.error('[Socket] Connection error:', error);
      this.status = 'error';
      this.reconnectAttempts++;
      
      if (this.reconnectAttempts >= this.maxReconnectAttempts) {
        console.error('[Socket] Max reconnection attempts reached');
        this.disconnect();
      }
    });

    this.socket.on('reconnect', attemptNumber => {
      console.log('[Socket] Reconnected after', attemptNumber, 'attempts');
      this.status = 'connected';
      this.reconnectAttempts = 0;
    });

    this.socket.on('reconnect_attempt', attemptNumber => {
      console.log('[Socket] Reconnection attempt', attemptNumber);
      this.status = 'reconnecting';
    });

    this.socket.on('reconnect_error', error => {
      console.error('[Socket] Reconnection error:', error);
    });

    this.socket.on('reconnect_failed', () => {
      console.error('[Socket] Reconnection failed');
      this.status = 'error';
    });
  }

  /**
   * Disconnect from socket server
   */
  disconnect(): void {
    if (this.socket) {
      this.socket.disconnect();
      this.socket.removeAllListeners();
      this.socket = null;
    }
    
    this.status = 'disconnected';
    console.log('[Socket] Disconnected');
  }

  /**
   * Check if socket is connected
   */
  isConnected(): boolean {
    return this.socket?.connected ?? false;
  }

  /**
   * Emit event to server
   */
  emit<T = any>(event: string, data: T): void {
    if (!this.socket?.connected) {
      console.warn('[Socket] Cannot emit, not connected');
      return;
    }

    this.socket.emit(event, data);
  }

  /**
   * Listen to event from server
   * Returns unsubscribe function
   */
  on<T = any>(event: string, handler: SocketEventHandler<T>): () => void {
    if (!this.socket) {
      console.warn('[Socket] Cannot listen, socket not initialized');
      return () => {};
    }

    this.socket.on(event, handler);

    // Return unsubscribe function
    return () => {
      this.off(event, handler);
    };
  }

  /**
   * Listen to event once
   */
  once<T = any>(event: string, handler: SocketEventHandler<T>): void {
    if (!this.socket) {
      console.warn('[Socket] Cannot listen, socket not initialized');
      return;
    }

    this.socket.once(event, handler);
  }

  /**
   * Remove event listener
   */
  off(event: string, handler?: SocketEventHandler): void {
    if (!this.socket) return;

    if (handler) {
      this.socket.off(event, handler);
    } else {
      this.socket.off(event);
    }
  }

  /**
   * Get connection status
   */
  getStatus(): SocketConnectionStatus {
    return this.status;
  }

  /**
   * Manually trigger reconnection
   */
  reconnect(): void {
    if (this.socket?.connected) {
      console.log('[Socket] Already connected');
      return;
    }

    console.log('[Socket] Manual reconnection');
    this.reconnectAttempts = 0;
    this.socket?.connect();
  }

  /**
   * Update auth token (e.g., after refresh)
   */
  updateAuth(token: string) {
    if (this.socket) {
      this.socket.auth = {token};
      
      // Reconnect with new token
      if (this.socket.connected) {
        this.disconnect();
        this.connect();
      }
    }
  }

  /**
   * Cleanup
   */
  destroy() {
    this.disconnect();
    this.appStateSubscription?.remove();
  }
}

// Create singleton instance
export const socketService = new SocketService({
  url: config.socket.url,
  path: config.socket.path,
  autoConnect: false, // Manual connection after auth
  reconnection: true,
  reconnectionAttempts: 5,
  reconnectionDelay: 1000,
  timeout: 10000,
});

export default socketService;
