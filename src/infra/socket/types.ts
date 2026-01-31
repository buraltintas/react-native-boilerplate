/**
 * Infra - Socket - Types
 * 
 * Type definitions for socket connections
 */

export type SocketConnectionStatus = 
  | 'disconnected' 
  | 'connecting' 
  | 'connected' 
  | 'reconnecting' 
  | 'error';

export interface SocketConfig {
  url: string;
  path?: string;
  autoConnect?: boolean;
  reconnection?: boolean;
  reconnectionAttempts?: number;
  reconnectionDelay?: number;
  timeout?: number;
  auth?: Record<string, any>;
}

export interface SocketEvent<T = any> {
  event: string;
  data: T;
  timestamp: number;
}

export interface SocketError {
  message: string;
  code?: string;
  details?: any;
}

export type SocketEventHandler<T = any> = (data: T) => void;

export interface SocketService {
  connect(): void;
  disconnect(): void;
  isConnected(): boolean;
  emit<T = any>(event: string, data: T): void;
  on<T = any>(event: string, handler: SocketEventHandler<T>): () => void;
  once<T = any>(event: string, handler: SocketEventHandler<T>): void;
  off(event: string, handler?: SocketEventHandler): void;
  getStatus(): SocketConnectionStatus;
  reconnect(): void;
}

export default SocketService;
