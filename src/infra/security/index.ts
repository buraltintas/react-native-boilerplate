/**
 * Infra - Security
 * 
 * Security utilities: jailbreak detection, screen blur, etc.
 * Gracefully degrades in Expo Go
 */

import {AppState, AppStateStatus, Platform} from 'react-native';

// Lazy imports for Expo Go compatibility
let DeviceInfo: any = null;
let Keychain: any = null;

try {
  DeviceInfo = require('react-native-device-info').default;
} catch (error) {
  console.warn('[Security] react-native-device-info not available (Expo Go)');
}

try {
  Keychain = require('react-native-keychain');
} catch (error) {
  console.warn('[Security] react-native-keychain not available (Expo Go)');
}

/**
 * Security Service
 */
class SecurityService {
  private appStateListeners: Set<(status: AppStateStatus) => void> = new Set();
  private isAvailable = false;

  constructor() {
    this.isAvailable = DeviceInfo !== null && Keychain !== null;
    this.initializeAppStateListener();
  }

  /**
   * Initialize app state listener
   */
  private initializeAppStateListener() {
    AppState.addEventListener('change', (nextAppState: AppStateStatus) => {
      this.appStateListeners.forEach(listener => listener(nextAppState));
    });
  }

  /**
   * Check if device is jailbroken/rooted
   */
  async isJailbroken(): Promise<boolean> {
    if (!this.isAvailable || !DeviceInfo) {
      console.log('[Security] Jailbreak detection not available (Expo Go)');
      return false;
    }

    try {
      // Simple check - can be enhanced
      const isEmulator = await DeviceInfo.isEmulator();
      
      if (Platform.OS === 'ios') {
        // iOS jailbreak detection
        // Note: This is basic, real apps should use more sophisticated checks
        return false; // Simplified for demo
      } else {
        // Android root detection
        return false; // Simplified for demo
      }
    } catch (error) {
      console.error('[Security] Jailbreak check failed:', error);
      return false;
    }
  }

  /**
   * Subscribe to app state changes
   */
  onAppStateChange(listener: (status: AppStateStatus) => void): () => void {
    this.appStateListeners.add(listener);
    return () => {
      this.appStateListeners.delete(listener);
    };
  }

  /**
   * Check if app is in foreground
   */
  isInForeground(): boolean {
    return AppState.currentState === 'active';
  }

  /**
   * Get device information
   */
  async getDeviceInfo(): Promise<{
    brand: string;
    model: string;
    systemVersion: string;
    appVersion: string;
  }> {
    if (!DeviceInfo) {
      return {
        brand: 'unknown',
        model: 'unknown',
        systemVersion: Platform.Version.toString(),
        appVersion: '1.0.0',
      };
    }

    try {
      return {
        brand: await DeviceInfo.getBrand(),
        model: await DeviceInfo.getModel(),
        systemVersion: DeviceInfo.getSystemVersion(),
        appVersion: DeviceInfo.getVersion(),
      };
    } catch (error) {
      console.error('[Security] Failed to get device info:', error);
      return {
        brand: 'unknown',
        model: 'unknown',
        systemVersion: Platform.Version.toString(),
        appVersion: '1.0.0',
      };
    }
  }
}

export const securityService = new SecurityService();

export default securityService;
