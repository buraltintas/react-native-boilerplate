/**
 * Shared - Hooks - useSocket
 * 
 * Hook for socket connection management
 */

import {useEffect, useCallback} from 'react';
import {socketService} from '@infra/socket';
import {useSocketStore} from '@shared/store/socket.store';
import type {SocketEventHandler} from '@infra/socket';

/**
 * Hook for managing socket connection
 */
export function useSocket() {
  const {status, isConnected} = useSocketStore();

  const connect = useCallback(() => {
    socketService.connect();
  }, []);

  const disconnect = useCallback(() => {
    socketService.disconnect();
  }, []);

  const reconnect = useCallback(() => {
    socketService.reconnect();
  }, []);

  const emit = useCallback(<T = any>(event: string, data: T) => {
    socketService.emit(event, data);
  }, []);

  return {
    status,
    isConnected,
    connect,
    disconnect,
    reconnect,
    emit,
  };
}

/**
 * Hook for listening to socket events
 */
export function useSocketEvent<T = any>(
  event: string,
  handler: SocketEventHandler<T>,
  deps: any[] = [],
) {
  useEffect(() => {
    // Subscribe to event
    const unsubscribe = socketService.on(event, handler);

    // Cleanup
    return () => {
      unsubscribe();
    };
  }, [event, ...deps]);
}

/**
 * Hook for auto-connecting socket when component mounts
 */
export function useSocketAutoConnect() {
  const {connect, disconnect} = useSocket();

  useEffect(() => {
    connect();

    return () => {
      disconnect();
    };
  }, [connect, disconnect]);
}

export default {
  useSocket,
  useSocketEvent,
  useSocketAutoConnect,
};
