/**
 * Infra - Storage
 * 
 * Storage abstraction layer
 * Using AsyncStorage
 */

import AsyncStorage from '@react-native-async-storage/async-storage';

export interface IStorage {
  getItem(key: string): Promise<string | null>;
  setItem(key: string, value: string): Promise<void>;
  removeItem(key: string): Promise<void>;
  clear(): Promise<void>;
}

/**
 * AsyncStorage-based storage
 */
class AsyncStorageAdapter implements IStorage {
  async getItem(key: string): Promise<string | null> {
    return AsyncStorage.getItem(key);
  }

  async setItem(key: string, value: string): Promise<void> {
    return AsyncStorage.setItem(key, value);
  }

  async removeItem(key: string): Promise<void> {
    return AsyncStorage.removeItem(key);
  }

  async clear(): Promise<void> {
    return AsyncStorage.clear();
  }
}

// Export the default storage implementation
export const storage: IStorage = new AsyncStorageAdapter();

export default storage;
