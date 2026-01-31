/**
 * Infra - Network
 * 
 * Network state management and offline detection
 */

import NetInfo, {NetInfoState} from '@react-native-community/netinfo';
import {useEffect, useState} from 'react';

export interface NetworkState {
  isConnected: boolean;
  isInternetReachable: boolean | null;
  type: string;
}

/**
 * Network Service
 */
class NetworkService {
  private listeners: Set<(state: NetworkState) => void> = new Set();
  private currentState: NetworkState = {
    isConnected: true,
    isInternetReachable: null,
    type: 'unknown',
  };

  constructor() {
    this.initialize();
  }

  private initialize() {
    // Subscribe to network state
    NetInfo.addEventListener((state: NetInfoState) => {
      this.currentState = {
        isConnected: state.isConnected ?? false,
        isInternetReachable: state.isInternetReachable,
        type: state.type,
      };

      // Notify listeners
      this.listeners.forEach(listener => listener(this.currentState));
    });
  }

  /**
   * Get current network state
   */
  async getState(): Promise<NetworkState> {
    const state = await NetInfo.fetch();
    return {
      isConnected: state.isConnected ?? false,
      isInternetReachable: state.isInternetReachable,
      type: state.type,
    };
  }

  /**
   * Check if online
   */
  isOnline(): boolean {
    return this.currentState.isConnected;
  }

  /**
   * Subscribe to network changes
   */
  subscribe(listener: (state: NetworkState) => void): () => void {
    this.listeners.add(listener);
    // Return unsubscribe function
    return () => {
      this.listeners.delete(listener);
    };
  }
}

export const networkService = new NetworkService();

/**
 * Hook for network state
 */
export function useNetworkState() {
  const [networkState, setNetworkState] = useState<NetworkState>({
    isConnected: true,
    isInternetReachable: null,
    type: 'unknown',
  });

  useEffect(() => {
    // Get initial state
    networkService.getState().then(setNetworkState);

    // Subscribe to changes
    const unsubscribe = networkService.subscribe(setNetworkState);

    return unsubscribe;
  }, []);

  return networkState;
}

export default networkService;
