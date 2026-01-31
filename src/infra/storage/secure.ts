/**
 * Infra - Secure Storage
 * 
 * Secure storage for sensitive data (tokens, keys)
 * Uses Expo SecureStore on both platforms
 * Gracefully degrades in Expo Go
 */

// Lazy import for Expo Go compatibility
let SecureStore: any = null;

try {
  SecureStore = require('expo-secure-store');
} catch (error) {
  console.warn('[SecureStorage] expo-secure-store not available (Expo Go)');
}

export interface ISecureStorage {
  getItem(key: string): Promise<string | null>;
  setItem(key: string, value: string): Promise<void>;
  removeItem(key: string): Promise<void>;
  clear(): Promise<void>;
}

class SecureStorageAdapter implements ISecureStorage {
  private keys: Set<string> = new Set();
  private isAvailable = false;
  private memoryFallback: Map<string, string> = new Map();

  constructor() {
    this.isAvailable = SecureStore !== null;
    if (!this.isAvailable) {
      console.warn('[SecureStorage] Using memory fallback (not secure!)');
    }
  }

  async getItem(key: string): Promise<string | null> {
    if (!this.isAvailable) {
      return this.memoryFallback.get(key) || null;
    }

    try {
      const value = await SecureStore.getItemAsync(key);
      if (value) {
        this.keys.add(key);
      }
      return value;
    } catch (error) {
      console.error('[SecureStorage] Error getting item:', error);
      return null;
    }
  }

  async setItem(key: string, value: string): Promise<void> {
    if (!this.isAvailable) {
      this.memoryFallback.set(key, value);
      this.keys.add(key);
      return;
    }

    try {
      await SecureStore.setItemAsync(key, value);
      this.keys.add(key);
    } catch (error) {
      console.error('[SecureStorage] Error setting item:', error);
      throw error;
    }
  }

  async removeItem(key: string): Promise<void> {
    if (!this.isAvailable) {
      this.memoryFallback.delete(key);
      this.keys.delete(key);
      return;
    }

    try {
      await SecureStore.deleteItemAsync(key);
      this.keys.delete(key);
    } catch (error) {
      console.error('[SecureStorage] Error removing item:', error);
    }
  }

  async clear(): Promise<void> {
    if (!this.isAvailable) {
      this.memoryFallback.clear();
      this.keys.clear();
      return;
    }

    try {
      // SecureStore doesn't have a clear all method
      // We need to delete each key individually
      const keysArray = Array.from(this.keys);
      await Promise.all(
        keysArray.map(key => SecureStore.deleteItemAsync(key))
      );
      this.keys.clear();
    } catch (error) {
      console.error('[SecureStorage] Error clearing storage:', error);
    }
  }
}

// Export the default secure storage implementation
export const secureStorage: ISecureStorage = new SecureStorageAdapter();

// Token management helpers
const REFRESH_TOKEN_KEY = 'refresh_token';

export const tokenManager = {
  async getRefreshToken(): Promise<string | null> {
    return secureStorage.getItem(REFRESH_TOKEN_KEY);
  },

  async setRefreshToken(token: string): Promise<void> {
    return secureStorage.setItem(REFRESH_TOKEN_KEY, token);
  },

  async clearRefreshToken(): Promise<void> {
    return secureStorage.removeItem(REFRESH_TOKEN_KEY);
  },
};

export default secureStorage;
