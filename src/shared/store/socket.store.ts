/**
 * Shared - Store - Socket Store
 * 
 * Socket connection state management
 */

import {create} from 'zustand';
import type {SocketConnectionStatus} from '@infra/socket';

interface SocketState {
  // Connection state
  status: SocketConnectionStatus;
  isConnected: boolean;
  lastConnectedAt: number | null;
  lastDisconnectedAt: number | null;
  
  // Reconnection state
  reconnectAttempts: number;
  
  // Active subscriptions
  activeSubscriptions: Set<string>;
  
  // Actions
  setStatus: (status: SocketConnectionStatus) => void;
  setConnected: (connected: boolean) => void;
  setReconnectAttempts: (attempts: number) => void;
  addSubscription: (channel: string) => void;
  removeSubscription: (channel: string) => void;
  clearSubscriptions: () => void;
  reset: () => void;
}

const initialState = {
  status: 'disconnected' as SocketConnectionStatus,
  isConnected: false,
  lastConnectedAt: null,
  lastDisconnectedAt: null,
  reconnectAttempts: 0,
  activeSubscriptions: new Set<string>(),
};

export const useSocketStore = create<SocketState>((set, get) => ({
  ...initialState,

  setStatus: status => {
    set({status});
    
    // Track connection timestamps
    if (status === 'connected') {
      set({
        isConnected: true,
        lastConnectedAt: Date.now(),
        reconnectAttempts: 0,
      });
    } else if (status === 'disconnected') {
      set({
        isConnected: false,
        lastDisconnectedAt: Date.now(),
      });
    }
  },

  setConnected: isConnected => {
    set({isConnected});
  },

  setReconnectAttempts: reconnectAttempts => {
    set({reconnectAttempts});
  },

  addSubscription: channel => {
    const {activeSubscriptions} = get();
    activeSubscriptions.add(channel);
    set({activeSubscriptions: new Set(activeSubscriptions)});
  },

  removeSubscription: channel => {
    const {activeSubscriptions} = get();
    activeSubscriptions.delete(channel);
    set({activeSubscriptions: new Set(activeSubscriptions)});
  },

  clearSubscriptions: () => {
    set({activeSubscriptions: new Set()});
  },

  reset: () => {
    set(initialState);
  },
}));

export default useSocketStore;
